import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request as ExpressRequest } from "express";
import { Roles } from "src/auth/roles.decorator";
import { JwtPayload } from "src/auth/types/jwt-payload";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService, private configService: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: ExpressRequest = context.switchToHttp().getRequest();

        let token;
        token = this.extractTokenFromHeader(request);
        if (!token) {
            token = this.extractTokenFromCookie(request);
            if (!token) {
                throw new UnauthorizedException();
            }
        }

        let jwtPayload: JwtPayload;
        try {
            jwtPayload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
            request['user'] = jwtPayload;
        } catch {
            throw new UnauthorizedException();
        }

        const allowedRoles = this.reflector.get(Roles, context.getHandler());
        console.log("allowed roles: ", allowedRoles);
        console.log("user's role: ", jwtPayload.role);
        if (!allowedRoles) {
            return true;
        }
        return allowedRoles.includes(jwtPayload.role);
    }

    private extractTokenFromHeader(
        request: ExpressRequest
    ): string | undefined {
        if (request.headers.authorization !== undefined) {
            const [type, token] = request.headers.authorization?.split(' ') ?? [];
            return type === 'Bearer' ? token : undefined;
        }
        return undefined;
    }

    private extractTokenFromCookie(
        request: ExpressRequest
    ): string | undefined {
        const jwtCookieName = this.configService.get<string>('JWT_COOKIE_NAME');
        if (jwtCookieName !== undefined) {
            if (request.cookies) {
                const token = (request.cookies as Record<string, string>)[
                    jwtCookieName
                ];
                return token;
            }
        } else {
            return undefined;
        }
    }
}