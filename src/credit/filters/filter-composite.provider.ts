import { Injectable } from "@nestjs/common";
import { CreditWhereInput } from "generated/prisma/models";
import { CreatedAtFilterProvider } from "src/credit/filters/created-at.filter.provider";
import { Filter } from "src/credit/filters/filter.interface";
import { StatusFilterProvider } from "src/credit/filters/status.filter.provider";
import { FilterCriteriaDomain } from "src/credit/types/domain/filter-criteria.domain";

@Injectable()
export class FilterCompositeProvider implements Filter {
    private children: Filter[];

    constructor(statusFilter: StatusFilterProvider, createdAtFilter: CreatedAtFilterProvider) {
        this.children = [statusFilter, createdAtFilter];
    }

    filter(filterCriteriaDomain: FilterCriteriaDomain, creditWhereInput: CreditWhereInput): CreditWhereInput {
        for (const child of this.children) {
            creditWhereInput = child.filter(filterCriteriaDomain, creditWhereInput);
        }
        return creditWhereInput;
    }
}
