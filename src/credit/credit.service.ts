import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCreditDto } from 'src/credit/types/dto/create-credit.dto';
import { CreditStatus } from 'src/credit/types/enums/credit-status.enum';
import { CreateCreditResponse } from 'src/credit/types/response/create-credit.response';
import { InstallmentService } from 'src/installment/installment.service';
import { InstallmentStatus } from 'src/installment/types/enums/installment-status.enum';
import { InstallmentSummary } from 'src/installment/types/installment-summary';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CreditService {
    constructor(private configService: ConfigService, private prisma: PrismaService, private userService: UserService, private installmentService: InstallmentService) {

    }

    async create(createCreditDto: CreateCreditDto): Promise<CreateCreditResponse> {
        const readUserResponse = await this.userService.readById(createCreditDto.userId);
        if (!readUserResponse.isSuccess || !readUserResponse.user) return readUserResponse;

        try {
            return await this.prisma.$transaction(async (tx) => {
                const credit = await this.prisma.credit.create({
                    data: {
                        userId: createCreditDto.userId,
                        status: CreditStatus.ACTIVE,
                        amount: createCreditDto.amount,
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
                    }));
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
}
