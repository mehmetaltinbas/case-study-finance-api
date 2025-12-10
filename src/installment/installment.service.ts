import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateInstallmentDto } from 'src/installment/types/dto/create-installment.dto';
import { CreateInstallmentResponse } from 'src/installment/types/response/create-installment.response';
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
            dueDate: installment.dueDate as Date, 
            amount: Number(installment.amount)
        } };
    }
}
