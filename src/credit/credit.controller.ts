// eslint-disable-next-line no-redeclare
import { Body, Controller, Post } from '@nestjs/common';
import { CreditService } from 'src/credit/credit.service';
import { CreateCreditDto } from 'src/credit/types/dto/create-credit.dto';
import { ResponseBase } from 'src/shared/response-base';

@Controller('credit')
export class CreditController {
    constructor(private creditService: CreditService) {

    }

    @Post('create')
    async create(@Body() createCreditDto: CreateCreditDto): Promise<ResponseBase> {
        return await this.creditService.create(createCreditDto);
    }
}
