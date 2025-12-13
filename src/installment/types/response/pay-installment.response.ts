import { ResponseBase } from "src/shared/types/response-base";

export interface PayInstallmentResponse extends ResponseBase {
    refund?: number;
}
