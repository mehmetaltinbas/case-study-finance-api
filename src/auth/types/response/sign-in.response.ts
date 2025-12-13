import { ResponseBase } from "src/shared/types/response-base";

export interface SignInResponse extends ResponseBase {
    jwt?: string;
    userId?: number;
}
