import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    private configService: ConfigService;
    
    constructor(configService: ConfigService) {
        console.log('DATABASE_URL:', configService.get('DATABASE_URL'));
        super({
            datasources: {
                db: {
                    url: configService.get<string>('DATABASE_URL'),
                }
            }
        });
        this.configService = configService;
    }
}
