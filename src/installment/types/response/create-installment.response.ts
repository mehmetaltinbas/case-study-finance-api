import { InstallmentSummary } from "src/installment/types/installment-summary";
import { ResponseBase } from "src/shared/types/response-base";

export interface CreateInstallmentResponse extends ResponseBase {
    installment?: InstallmentSummary;
}