import { ResponseBase } from "src/shared/response-base";

export interface PayInstallmentResponse extends ResponseBase {
    refund?: number;
}
