// eslint-disable-next-line no-redeclare
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';
import User from 'src/auth/decorators/user.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { InstallmentService } from 'src/installment/installment.service';
import { PayInstallmentDto } from 'src/installment/types/dto/pay-installment.dto';
import { ResponseBase } from 'src/shared/types/response-base';

@Controller('installment')
@UseGuards(RolesGuard)
export class InstallmentController {
    constructor(private installmentService: InstallmentService) {}

    @Post('pay')
    @Roles([Role.customer])
    @ApiOperation({
        description: 'Allowed role(s): customer',
    })
    async pay(@User() user: JwtPayload, @Body() payInstallmentDto: PayInstallmentDto): Promise<ResponseBase> {
        return await this.installmentService.pay(user.sub, payInstallmentDto);
    }

    @Get('test')
    async test(): Promise<string> {
        return 'tested';
    }
}
