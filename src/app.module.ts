import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { CreditModule } from './credit/credit.module';
import { InstallmentModule } from './installment/installment.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({ 
            isGlobal: true,
        }), 
        ScheduleModule.forRoot(), 
        PrismaModule, 
        UserModule, 
        CreditModule, 
        InstallmentModule, 
        AuthModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
