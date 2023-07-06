export enum FilterType {
  Text = "text",
  Number = "number",
  Option = "option",
  Date = "date",
}

export enum FilterBehaviour {
  Exact = "exact",
  Partial = "partial",
  Range = "range",
  Single = "single",
  Multiple = "multiple",
  Before = "before",
  After = "after",
}

export interface Option {
  label: string;
  value: string;
}

export interface Filter {
  name: string;
  label: string;
  type: FilterType;
  options?: Option[];
  behaviour: FilterBehaviour;
  value?: string;
}
