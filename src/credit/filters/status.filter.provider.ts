import { Injectable } from "@nestjs/common";
import { CreditWhereInput } from "generated/prisma/models";
import { Filter } from "src/credit/filters/filter.interface";
import { FilterCriteriaDomain } from "src/credit/types/domain/filter-criteria.domain";

@Injectable()
export class StatusFilterProvider implements Filter {
    constructor() {}

    filter(filterCriteriaDomain: FilterCriteriaDomain, creditWhereInput: CreditWhereInput): CreditWhereInput {
        if (filterCriteriaDomain.status !== undefined) creditWhereInput.status = filterCriteriaDomain.status;
        return creditWhereInput;
    }
}
