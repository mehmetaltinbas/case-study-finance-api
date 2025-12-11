import { Injectable } from "@nestjs/common";
import { CreditWhereInput } from "generated/prisma/models";
import { Filter } from "src/credit/filter/filter";
import { FilterCriteriaDomain } from "src/credit/types/domain/filter-criteria.domain";

@Injectable()
export class CreatedAtFilterProvider implements Filter {
    constructor() {}

    filter(filterCriteriaDomain: FilterCriteriaDomain, creditWhereInput: CreditWhereInput): CreditWhereInput {
        if (filterCriteriaDomain.createdAt) {
            const date = new Date(filterCriteriaDomain.createdAt);
            const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
            const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

            creditWhereInput.createdAt = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }
        return creditWhereInput;
    }
}
