import { CreditWhereInput } from "generated/prisma/models";
import { FilterCriteriaDomain } from "src/credit/types/domain/filter-criteria.domain";

export interface Filter {
    filter(filterCriteriaDomain: FilterCriteriaDomain, creditWhereInput: CreditWhereInput): CreditWhereInput;
}
