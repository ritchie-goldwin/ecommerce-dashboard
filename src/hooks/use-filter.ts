import React from "react";
import { Filter } from "src/types/filter.model";

const useFilter = (initialFilters: Filter[]) => {
  const [filters, setFilters] = React.useState<Filter[] | undefined>(initialFilters);

  return {filters, setFilters};
};

export default useFilter;
