import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCreditDto } from 'src/credit/types/dto/create-credit.dto';
import { CreateCreditResponse } from 'src/credit/types/response/create-credit.response';
import { InstallmentService } from 'src/installment/installment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CreditService {
    constructor(private configService: ConfigService, private prisma: PrismaService, private userService: UserService, private installmentService: InstallmentService) {

    }

    async create(createCreditDto: CreateCreditDto): Promise<CreateCreditResponse> {

    }
}
