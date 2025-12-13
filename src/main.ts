import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 5010;
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            // forbidNonWhitelisted: true,
        })
    );
    app.use(cookieParser());
    app.enableCors({
        origin: configService.get<string>('CLIENT_URL'),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
    });
    await app.listen(port);
}
bootstrap().catch(e => console.log(e));
