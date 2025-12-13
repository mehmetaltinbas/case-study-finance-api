import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtPayload } from 'src/auth/types/jwt-payload';

const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request: ExpressRequest = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user && data && data in user ? user[data as keyof JwtPayload] : user;
});

export default User;