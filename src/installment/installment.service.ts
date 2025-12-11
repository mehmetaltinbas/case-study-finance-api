import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateInstallmentDto } from 'src/installment/types/dto/create-installment.dto';
import { PayInstallmentDto } from 'src/installment/types/dto/pay-installment.dto';
import { InstallmentStatus } from 'src/installment/types/enums/installment-status.enum';
import { CreateInstallmentResponse } from 'src/installment/types/response/create-installment.response';
import { PayInstallmentResponse } from 'src/installment/types/response/pay-installment.response';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InstallmentService {
    constructor(private configService: ConfigService, private prisma: PrismaService) {

    }

    async create(createInstallmentDto: CreateInstallmentDto): Promise<CreateInstallmentResponse>  {
        const installment = await this.prisma.installment.create({
            data: createInstallmentDto
        });
        if (!installment) return { isSuccess: false, message: "installment couldn't created" };

        return { isSuccess: true, message: "installment created", installment: { 
            id: installment.id, 
            dueDate: installment.dueDate, 
            amount: Number(installment.amount)
        } };
    }

    async pay(payInstallmentDto: PayInstallmentDto): Promise<PayInstallmentResponse> {
        const installment = await this.prisma.installment.findUnique({ where: { id: payInstallmentDto.id, status: InstallmentStatus.PENDING }});
        if (!installment) return { isSuccess: false, message: 'no installment found by given id' };

        const paidAmount = (installment.paidAmount as Decimal).plus(new Decimal(payInstallmentDto.amountToPay));
        const status = paidAmount >= installment.amount ? InstallmentStatus.PAID : InstallmentStatus.PENDING;
        const updatedInstallment = await this.prisma.installment.update({
            where: { id: installment.id },
            data: { status, paidAmount: paidAmount.toNumber() > installment.amount.toNumber() ? installment.amount : paidAmount }
        });
        if (!updatedInstallment) return { isSuccess: false, message: 'unsuccessfull installment pay' };

        if (status === InstallmentStatus.PAID) {
            const refund = paidAmount.toNumber() - installment.amount.toNumber();
            return { isSuccess: true, message: 'installment fully paid', refund };
        }
        return { isSuccess: true, message: 'installment partially paid' };
    }
}
