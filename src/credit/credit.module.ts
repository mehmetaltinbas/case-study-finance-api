import { forwardRef, Module } from '@nestjs/common';
import { filterProviders } from 'src/credit/filters/filter-providers';
import { InstallmentModule } from 'src/installment/installment.module';
import { UserModule } from 'src/user/user.module';
import { CreditController } from './credit.controller';
import { CreditService } from './credit.service';


@Module({
    imports: [UserModule, forwardRef(() => InstallmentModule)],
    providers: [CreditService, ...filterProviders],
    controllers: [CreditController],
    exports: [CreditService],
})
export class CreditModule {}
