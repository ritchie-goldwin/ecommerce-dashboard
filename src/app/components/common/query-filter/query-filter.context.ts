import React from "react";

import { QueryFilterProps } from "./index";
import { Filter } from "src/types/filter.model";

interface QueryFilterState extends QueryFilterProps {
  filters: Filter[];
}

export const queryFilterContext = React.createContext<QueryFilterState>({
  filters: [],
  setFilters() {},
  setPage() {},
});
