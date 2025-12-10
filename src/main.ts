import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    console.log(process.env.ENV_TEST);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(e => console.log(e));
