import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { SignUpDto } from 'src/auth/types/dto/sign-up.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseBase } from 'src/shared/response-base';
import { ReadSingleUserResponse } from 'src/user/types/response/read-single-user.response';

@Injectable()
export class UserService {
    constructor(private configService: ConfigService, private prisma: PrismaService) {

    }

    async create(signUpDto: SignUpDto): Promise<ResponseBase> {
        const { password, ...restOfSignUpUserDto } = signUpDto;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                passwordHash,
                ...restOfSignUpUserDto,
            }
        });
        if (!user) return { isSuccess: false, message: "user couldn't created" };
        return { isSuccess: true, message: 'user created' };
    }

    async readById(id: number): Promise<ReadSingleUserResponse> {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        if (!user) return { isSuccess: true, message: 'unsuccessfull' };

        return { isSuccess: true, message: 'success', user };
    }

    async readByUserName(userName: string): Promise<ReadSingleUserResponse> {
        const user = await this.prisma.user.findFirst({ where: { userName }});
        if (!user) {
            return {
                isSuccess: false,
                message: `user couldn't read with userName: ${userName}`,
            };
        }
        return { isSuccess: true, message: `user read with userName: ${userName}`, user };
    }
}
