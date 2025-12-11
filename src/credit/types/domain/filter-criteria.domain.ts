import { CreditStatus } from "src/credit/types/enums/credit-status.enum";

export interface FilterCriteriaDomain {
    status?: CreditStatus;
    createdAt?: Date;
}
