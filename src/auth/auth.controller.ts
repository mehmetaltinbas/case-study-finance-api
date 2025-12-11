// eslint-disable-next-line no-redeclare
import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { SignInDto } from 'src/auth/types/dto/sign-in.dto';
import { SignUpDto } from 'src/auth/types/dto/sign-up.dto';
import { ResponseBase } from 'src/shared/response-base';
import { UserService } from 'src/user/user.service';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService, private configService: ConfigService) {}

    @Post('sign-up')
    async signUp(@Body() signUpDto: SignUpDto): Promise<ResponseBase> {
        console.log(signUpDto);
        return await this.userService.create(signUpDto);
    }

    @Post('sign-in')
    async signIn(
        @Body() signInDto: SignInDto,
        @Res() res: ExpressResponse
    ): Promise<ExpressResponse<any, Record<string, any>>> {
        const response = await this.authService.signIn(signInDto);
        if (!response.isSuccess) {
            return res.json({ isSuccess: response.isSuccess, message: response.message });
        }
        const jwtCookieName = this.configService.get<string>('JWT_COOKIE_NAME');
        if (jwtCookieName) {
            res.cookie(jwtCookieName, response.jwt, {
                httpOnly: true,
                maxAge: 3600000,
                // secure: true,
                sameSite: 'lax',
            });
        } else if (!jwtCookieName) {
            return res.json({
                isSuccess: false,
                message: 'no jwt cookie name provided as env variable',
            });
        }
        return res.json({ isSuccess: response.isSuccess, message: response.message });
    }
}
