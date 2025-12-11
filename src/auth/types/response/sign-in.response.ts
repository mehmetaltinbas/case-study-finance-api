import { ResponseBase } from "src/shared/response-base";

export interface SignInResponse extends ResponseBase {
    jwt?: string;
    userId?: number;
}
