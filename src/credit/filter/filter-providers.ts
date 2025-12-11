import { CreatedAtFilterProvider } from "src/credit/filter/created-at-filter.provider";
import { FilterCompositeProvider } from "src/credit/filter/filter-composite.provider";
import { StatusFilterProvider } from "src/credit/filter/status-filter.provider";

export const filterProviders = [FilterCompositeProvider, StatusFilterProvider, CreatedAtFilterProvider];