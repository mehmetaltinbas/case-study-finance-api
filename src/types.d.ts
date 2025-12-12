import JwtPayload from './auth/types/jwt-payload.interface';

declare module 'express' {
    interface Request {
        user?: JwtPayload; // same type as above
    }
}