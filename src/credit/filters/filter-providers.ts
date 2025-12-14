import { CreatedAtFilterProvider } from "src/credit/filters/created-at.filter.provider";
import { FilterCompositeProvider } from "src/credit/filters/filter-composite.provider";
import { StatusFilterProvider } from "src/credit/filters/status.filter.provider";

export const filterProviders = [FilterCompositeProvider, StatusFilterProvider, CreatedAtFilterProvider];