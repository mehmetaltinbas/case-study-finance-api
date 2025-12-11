// eslint-disable-next-line no-redeclare
import { Body, Controller, Post } from '@nestjs/common';
import { InstallmentService } from 'src/installment/installment.service';
import { PayInstallmentDto } from 'src/installment/types/dto/pay-installment.dto';
import { ResponseBase } from 'src/shared/response-base';

@Controller('installment')
export class InstallmentController {
    constructor(private installmentService: InstallmentService) {}

    @Post('pay')
    async pay(@Body() payInstallmentDto: PayInstallmentDto): Promise<ResponseBase> {
        return await this.installmentService.pay(payInstallmentDto);
    }
}
