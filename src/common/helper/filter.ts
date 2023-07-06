import { Delimiter } from "@components/common/query-filter/filter-control-input";
import { Filter, FilterBehaviour, FilterType } from "src/types/filter.model";

function checkFilter<T>(row: T, filter: Filter) {
  const key = filter.name;
  if (filter.type === FilterType.Text) {
    const filterValue = filter.value?.toLowerCase();
    const rowValue = (row[key] as string).toLowerCase();
    if (filter.behaviour === FilterBehaviour.Exact) {
      return rowValue === filterValue;
    }
    if (filter.behaviour === FilterBehaviour.Partial && filterValue) {
      return rowValue.includes(filterValue);
    }
  } else if (filter.type === FilterType.Number) {
    if (filter.behaviour === FilterBehaviour.Range) {
      const rowValue = parseFloat(row[key] ?? "");

      const min = parseFloat(filter.value?.split(Delimiter)?.[0] ?? "");
      const max = parseFloat(filter.value?.split(Delimiter)?.[1] ?? "");

      return rowValue >= min && rowValue <= max;
    }
  }

  return true;
}

export function getFilteredData<T>(rows: T[], filters: Filter[]) {
  const data: T[] = rows.filter((current) => {
    for (let i = 0; i < filters.length; i++) {
      if (!filters[i].value) {
        continue;
      }
      if (!checkFilter(current, filters[i])) {
        return false;
      }
    }

    return true;
  });

  return data;
}
