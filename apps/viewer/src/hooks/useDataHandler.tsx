import Fuse from "fuse.js";
import { useMemo, useState } from "react";

type Filter<T> = {
  id: keyof T;
  fn: (value: T) => boolean;
};

/**
 *
 * @param options is where we pass in our data
 * @returns
 */
export const useDataHandler = <T,>({ data }: { data: T[] }) => {
  const [filters, setFilters] = useState<Filter<T>[]>([]);
  const [search, setSearch] = useState<string | null>(null);
  const [sort, setSort] = useState<{
    id: keyof T;
    fn: (a: T, b: T) => number;
    dir: "asc" | "desc";
  }>();

  const filteredData = useMemo(() => {
    const filtered = filters.reduce((acc, curr) => acc.filter(curr.fn), data);

    if (sort !== undefined) {
      const sorted = filtered.sort(sort.fn);
      return sort.dir === "asc" ? sorted : sorted.reverse();
    }

    return filtered;
  }, [data, filters, sort]);

  const searchedData = useMemo(() => {
    if (search === null) return filteredData;

    const fuse = new Fuse(filteredData);

    return fuse.search(search).map((result) => result.item);
  }, [filteredData, search]);

  const addFilter = (id: keyof T, fn: (value: T) => boolean) => {
    setFilters((fils) => [...fils.filter((f) => f.id !== id), { id, fn }]);
  };

  const removeFilter = (id: keyof T) => {
    setFilters((fils) => fils.filter((f) => f.id !== id));
  };

  return [
    searchedData,
    filters,
    addFilter,
    removeFilter,
    sort,
    setSort,
    search,
    setSearch,
  ] as const;
};

export const createNumericalFilter = <T, K extends keyof T>(
  id: K,
  min: number,
  max: number
): Filter<T> => ({
  id,
  fn: (value: T) => value[id] >= min && value[id] <= max,
});

export const createDropDownFilter = <T, K extends keyof T>(
  id: K,
  is: T[K][]
): Filter<T> => ({
  id,
  fn: (value: T) => is.includes(value[id]),
});

export const createTextFilter = <T, K extends keyof T>(
  id: K,
  text: string
): Filter<T> => ({
  id,
  fn: (value: T) => (value[id] as string).includes(text),
});
