import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { SignInDto } from 'src/auth/types/dto/sign-in.dto';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { SignInResponse } from 'src/auth/types/response/sign-in.response';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private configService: ConfigService, private prisma: PrismaService, private jwtService: JwtService, private userService: UserService) {
    }

    async signIn(signInDto: SignInDto): Promise<SignInResponse> {
        const readSingleUserResponse = await this.userService.readByUserName(
            signInDto.userName
        );
        if (!readSingleUserResponse.isSuccess || !readSingleUserResponse.user) {
            return readSingleUserResponse;
        }
        const isMatch = await bcrypt.compare(
            signInDto.password,
            readSingleUserResponse.user.passwordHash
        );
        if (!isMatch) {
            return { isSuccess: false, message: 'password is incorrect' };
        }

        const payload: JwtPayload = {
            sub: readSingleUserResponse.user.id,
            userName: readSingleUserResponse.user.userName,
            role: readSingleUserResponse.user.role
        };
        const jwt = await this.jwtService.signAsync(payload);
        return {
            isSuccess: true,
            message: 'user signed in',
            jwt,
            userId: readSingleUserResponse.user.id,
        };
    } 
}
