import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreditWhereInput } from 'generated/prisma/models';
import { FilterCompositeProvider } from 'src/credit/filters/filter-composite.provider';
import { FilterCriteriaDomain } from 'src/credit/types/domain/filter-criteria.domain';
import { CreateCreditDto } from 'src/credit/types/dto/create-credit.dto';
import { CreditStatus } from 'src/credit/types/enums/credit-status.enum';
import { CreateCreditResponse } from 'src/credit/types/response/create-credit.response';
import { ReadMultipleCreditsResponse } from 'src/credit/types/response/read-multiple-credits.response';
import { InstallmentService } from 'src/installment/installment.service';
import { InstallmentStatus } from 'src/installment/types/enums/installment-status.enum';
import { InstallmentSummary } from 'src/installment/types/installment-summary';
import { ReadSingleCreditResponse } from 'src/installment/types/response/read-single-credit.response';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CreditService {
    constructor(private configService: ConfigService, private prisma: PrismaService, private userService: UserService, @Inject(forwardRef(() => InstallmentService)) private installmentService: InstallmentService, private filterCompositeProvider: FilterCompositeProvider) {}

    async create(createCreditDto: CreateCreditDto): Promise<CreateCreditResponse> {
        const readUserResponse = await this.userService.readById(createCreditDto.userId);
        if (!readUserResponse.isSuccess || !readUserResponse.user) return readUserResponse;

        try {
            return await this.prisma.$transaction(async (tx) => {
                const credit = await tx.credit.create({
                    data: {
                        userId: createCreditDto.userId,
                        status: CreditStatus.ACTIVE,
                        amount: createCreditDto.amount,
                        interestRate: createCreditDto.interestRate,
                    }
                });
                if (!credit) throw new Error("credit couldn't created");

                const installmentCreations = [];
                for (let i = 1; i <= createCreditDto.installmentCount; i++) {
                    const dueDate = new Date();
                    dueDate.setDate(new Date().getDate() + i*30);
                    installmentCreations.push(this.installmentService.create({
                        creditId: credit.id,
                        status: InstallmentStatus.PENDING,
                        amount: createCreditDto.amount/createCreditDto.installmentCount,
                        dueDate
                    }, tx));
                }
                const createInstallmentResponses = await Promise.all(installmentCreations);

                const installments: InstallmentSummary[] = [];
                createInstallmentResponses.forEach(createInstallmentCreateResponse => {
                    if (!createInstallmentCreateResponse.isSuccess || !createInstallmentCreateResponse.installment) throw new Error('at least 1 unsuccessfull installment creation');
                    installments.push(createInstallmentCreateResponse.installment);
                });
                return { isSuccess: true, message: 'success', creditId: credit.id, installments };
            });
        } catch (error) {
            return { isSuccess: false, message: `error: ${(error as Error).message}` };
        }
    }

    async readById(id: number): Promise<ReadSingleCreditResponse> {
        const credit = await this.prisma.credit.findUnique({ where: { id }});
        if (!credit) return { isSuccess: false, message: `no credit found by given id: ${id}` };

        return { isSuccess: true, message: `credit found by given id: ${id}`, credit };
    }

    async readByIdAndUserId(id: number, userId: number): Promise<ReadSingleCreditResponse> {
        const credit = await this.prisma.credit.findUnique({ where: { id, userId }});
        if (!credit) return { isSuccess: false, message: `no credit found by given id: ${id} and given userId: ${userId}` };

        return { isSuccess: true, message: `credit found by given id: ${id} and given userId: ${userId}`, credit };
    }

    async readAllByUserId(userId: number, filterCriteriaDomain: FilterCriteriaDomain): Promise<ReadMultipleCreditsResponse> {
        const readUserByIdResponse = await this.userService.readById(userId);
        if (!readUserByIdResponse.isSuccess || !readUserByIdResponse.user) return readUserByIdResponse;

        const creditWhereInput: CreditWhereInput = { userId };
        const filteredCreditWhereInput = this.filterCompositeProvider.filter(filterCriteriaDomain, creditWhereInput);

        const credits = await this.prisma.credit.findMany({ where: filteredCreditWhereInput, include: { installments: true }});

        return { isSuccess: true, message: 'all credits read filtered by given userId', credits };
    }

    async checkCreditPaid(id: number): Promise<void> {
        const credit = await this.prisma.credit.findUnique({ where: { id }, include: { installments: true }});
        if (credit) {
            let isAllPaid = true;
            credit.installments.forEach((installment) => {
                if (installment.status !== Number(InstallmentStatus.PAID)) isAllPaid = false;
            });
            if (isAllPaid) {
                await this.prisma.credit.update({ where: { id }, data: { status: CreditStatus.PAID }});
                console.log("credit paid fully");
            }
        }
    }
}
