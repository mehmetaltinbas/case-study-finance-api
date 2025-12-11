import { forwardRef, Module } from '@nestjs/common';
import { InstallmentController } from './installment.controller';
import { InstallmentService } from './installment.service';
import { CreditModule } from 'src/credit/credit.module';

@Module({
    imports: [forwardRef(() => CreditModule)],
    controllers: [InstallmentController],
    providers: [InstallmentService],
    exports: [InstallmentService]
})
export class InstallmentModule {}
