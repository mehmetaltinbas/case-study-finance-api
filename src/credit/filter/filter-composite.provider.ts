import { Injectable } from "@nestjs/common";
import { CreditWhereInput } from "generated/prisma/models";
import { CreatedAtFilterProvider } from "src/credit/filter/created-at-filter.provider";
import { Filter } from "src/credit/filter/filter";
import { StatusFilterProvider } from "src/credit/filter/status-filter.provider";
import { FilterCriteriaDomain } from "src/credit/types/domain/filter-criteria.domain";

@Injectable()
export class FilterCompositeProvider implements Filter {
    private children: Filter[];

    constructor(statusFilter: StatusFilterProvider, createdAtFilter: CreatedAtFilterProvider) {
        this.children = [statusFilter, createdAtFilter];
    }

    filter(filterCriteriaDomain: FilterCriteriaDomain, creditWhereInput: CreditWhereInput): CreditWhereInput {
        for (const leave of this.children) {
            creditWhereInput = leave.filter(filterCriteriaDomain, creditWhereInput);
        }
        return creditWhereInput;
    }
}
