import { InstallmentSummary } from "src/installment/types/installment-summary";
import { ResponseBase } from "src/shared/response-base";

export interface CreateCreditResponse extends ResponseBase {
    creditId?: number;
    installments?: InstallmentSummary[];
}
