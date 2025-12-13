// eslint-disable-next-line no-redeclare
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { InstallmentService } from 'src/installment/installment.service';
import { PayInstallmentDto } from 'src/installment/types/dto/pay-installment.dto';
import { ResponseBase } from 'src/shared/response-base';

@Controller('installment')
@UseGuards(RolesGuard)
export class InstallmentController {
    constructor(private installmentService: InstallmentService) {}

    @Post('pay')
    @Roles([Role.customer])
    @ApiOperation({
        description: 'Allowed role(s): customer',
    })
    async pay(@Body() payInstallmentDto: PayInstallmentDto): Promise<ResponseBase> {
        return await this.installmentService.pay(payInstallmentDto);
    }
}
