export const FilterOperator = {
  CONTAINS: "contains",
  NOT_CONTAINS: "not_contains",
  STARTS_WITH: "starts_with",
  ENDS_WITH: "ends_with",
  EQUALS: "equals",
  NOT_EQUALS: "not_equals",
  GREATER_THAN: "greater_than",
  LESS_THAN: "less_than",
  GREATER_EQUAL: "greater_equal",
  LESS_EQUAL: "less_equal",
  BEFORE: "before",
  AFTER: "after",
  BETWEEN: "between",
  IN: "in",
  NOT_IN: "not_in",
} as const;

export type FilterOperator = typeof FilterOperator[keyof typeof FilterOperator];

export interface ColumnFilter {
  columnKey: string;
  operator: FilterOperator;
  value: unknown;
  valueTo?: unknown;
}

export interface FilterState {
  globalSearch: string;
  columnFilters: Record<string, ColumnFilter>;
  showFilterDrawer: boolean;
}
