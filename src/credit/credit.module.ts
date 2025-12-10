import { Module } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreditController } from './credit.controller';
import { InstallmentModule } from 'src/installment/installment.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [UserModule, InstallmentModule],
    providers: [CreditService],
    controllers: [CreditController]
})
export class CreditModule {}
