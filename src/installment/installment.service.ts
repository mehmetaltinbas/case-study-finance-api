import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from 'generated/prisma/browser';
import { CreditService } from 'src/credit/credit.service';
import { CreateInstallmentDto } from 'src/installment/types/dto/create-installment.dto';
import { PayInstallmentDto } from 'src/installment/types/dto/pay-installment.dto';
import { InstallmentStatus } from 'src/installment/types/enums/installment-status.enum';
import { CreateInstallmentResponse } from 'src/installment/types/response/create-installment.response';
import { PayInstallmentResponse } from 'src/installment/types/response/pay-installment.response';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InstallmentService {
    constructor(private configService: ConfigService, private prisma: PrismaService, @Inject(forwardRef(() => CreditService)) private creditService: CreditService) {}

    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    private async checkForLate(): Promise<void> {
        console.log("checking for late installments...");
        // newly late installments
        const lateInstallments = await this.prisma.installment.findMany({
            where: {
                dueDate: { lt: new Date() },
                status: { in: [InstallmentStatus.PENDING, InstallmentStatus.LATE] }
            }
        });
        if (lateInstallments.length === 0) return;

        for (const lateInstallment of lateInstallments) {
            console.log("\n");
            console.log(`late fee calculation for late installment with id: ${lateInstallment.id}`);
            const associatedCredit = await this.creditService.readById(lateInstallment.creditId);
            if (!associatedCredit.isSuccess || !associatedCredit.credit) /* what happens if associatedCredit not found but there is a lateInstallment? */ {
                continue;
            };

            const lateDays: number = Math.floor((new Date().getTime() - lateInstallment.dueDate.getTime()) / (24 * 60 * 60 * 1000));
            console.log(`late days: ${lateDays}`);
            const lateFee = (lateDays * ((associatedCredit.credit.interestRate).toNumber() / 100) * lateInstallment.amount.toNumber()) / 360;
            console.log(`interest rate: ${Number(associatedCredit.credit.interestRate)}`);
            console.log(`late fee: ${lateFee}`);
            const updatedLateInstallment = await this.prisma.installment.update({
                where: { id: lateInstallment.id },
                data: { 
                    status: InstallmentStatus.LATE, 
                    lateFee,
                }
            });
        }
    }

    async create(createInstallmentDto: CreateInstallmentDto, tx?: Prisma.TransactionClient): Promise<CreateInstallmentResponse>  {
        const { dueDate, ...restOfDto } = createInstallmentDto;
        
        // dueDate can't be at weekends
        if (dueDate.getDay() === 6) {
            dueDate.setDate(dueDate.getDate() + 2);
        } else if (dueDate.getDay() === 0) {
            dueDate.setDate(dueDate.getDate() + 1);
        }

        const prismaClient = tx ?? this.prisma;

        const installment = await prismaClient.installment.create({
            data: { ...restOfDto, dueDate }
        });
        if (!installment) return { isSuccess: false, message: "installment couldn't created" };

        return { isSuccess: true, message: "installment created", installment: { 
            id: installment.id, 
            dueDate: installment.dueDate, 
            amount: Number(installment.amount)
        } };
    }

    async pay(userId: number, payInstallmentDto: PayInstallmentDto): Promise<PayInstallmentResponse> {
        const installment = await this.prisma.installment.findFirst({ where: { id: payInstallmentDto.id, status: { in: [InstallmentStatus.PENDING, InstallmentStatus.LATE] } }});
        if (!installment) return { isSuccess: false, message: 'no pending or late installment found by given id' };

        const readSingleCreditResponse = await this.creditService.readByIdAndUserId(installment.creditId, userId);
        if (!readSingleCreditResponse.isSuccess || !readSingleCreditResponse.credit) return readSingleCreditResponse;

        const amountNeedsToBePaid = installment.amount.plus(installment.lateFee);
        const paidAmount = (installment.paidAmount).plus(new Decimal(payInstallmentDto.amount));

        const status = paidAmount.gte(amountNeedsToBePaid) ? InstallmentStatus.PAID : installment.status;

        const updatedInstallment = await this.prisma.installment.update({
            where: { id: installment.id },
            data: { status, paidAmount: paidAmount.toNumber() > amountNeedsToBePaid.toNumber() ? amountNeedsToBePaid : paidAmount }
        });
        if (!updatedInstallment) return { isSuccess: false, message: 'unsuccessfull installment pay' };

        if (status === Number(InstallmentStatus.PAID)) {
            const refundRaw = paidAmount.toNumber() - amountNeedsToBePaid.toNumber();
            const refund = Math.round(refundRaw * 100) / 100;
            void this.creditService.checkCreditPaid(updatedInstallment.creditId);
            return { isSuccess: true, message: 'installment fully paid', refund };
        }
        return { isSuccess: true, message: 'installment partially paid' };
    }
}
