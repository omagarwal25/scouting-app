import { Filter } from "../hooks/useDataHandler";

export type FiltersProps<T> = {
  id: keyof T;
  filters: Filter<T>[];
  addFilter: (id: keyof T, fn: (value: T) => boolean) => void;
  removeFilter: (id: keyof T) => void;
};

