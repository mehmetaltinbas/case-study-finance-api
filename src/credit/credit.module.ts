import { Module } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreditController } from './credit.controller';
import { InstallmentModule } from 'src/installment/installment.module';
import { UserModule } from 'src/user/user.module';
import { filterProviders } from 'src/credit/filter/filter-providers';

@Module({
    imports: [UserModule, InstallmentModule],
    providers: [CreditService, ...filterProviders],
    controllers: [CreditController]
})
export class CreditModule {}
