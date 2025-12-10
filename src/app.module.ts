import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CreditModule } from './credit/credit.module';
import { InstallmentModule } from './installment/installment.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, UserModule, CreditModule, InstallmentModule, AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
