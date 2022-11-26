import Fuse from "fuse.js";
import { useMemo, useState } from "react";

type Primitive = string | number | symbol;

type GenericObject = Record<Primitive, unknown>;

type Join<
  L extends Primitive | undefined,
  R extends Primitive | undefined
> = L extends string | number
  ? R extends string | number
    ? `${L}.${R}`
    : L
  : R extends string | number
  ? R
  : never;

type Union<
  L extends unknown | undefined,
  R extends unknown | undefined
> = L extends undefined
  ? R extends undefined
    ? undefined
    : R
  : R extends undefined
  ? L
  : L | R;

/**
 * NestedPaths
 * Get all the possible paths of an object
 * @example
 * type Keys = NestedPaths<{ a: { b: { c: string } }>
 * // 'a' | 'a.b' | 'a.b.c'
 */
export type NestedPaths<T extends GenericObject> = {
  [K in keyof T]: T[K] extends GenericObject
    ? NestedPaths1<T[K], Union<undefined, undefined>, Join<undefined, K>>
    : Union<Union<undefined, undefined>, Join<undefined, K>>;
}[keyof T];

type NestedPaths1<
  T extends GenericObject,
  Prev extends Primitive | undefined = undefined,
  Path extends Primitive | undefined = undefined
> = {
  [K in keyof T]: Union<Union<Prev, Path>, Join<Path, K>>;
}[keyof T];

/**
 * TypeFromPath
 * Get the type of the element specified by the path
 * @example
 * type TypeOfAB = TypeFromPath<{ a: { b: { c: string } }, 'a.b'>
 * // { c: string }
 */
export type TypeFromPath<
  T extends GenericObject,
  Path extends NestedPaths<T>
> = {
  [K in Path]: K extends keyof T
    ? T[K]
    : K extends `${infer P}.${infer S}`
    ? T[P] extends GenericObject
      ? S extends NestedPaths<T[P]>
        ? TypeFromPath<T[P], S>
        : never
      : never
    : never;
}[Path];

export type NestedPathsByType<
  T extends GenericObject,
  Type
> = NestedPaths<T> extends infer P
  ? P extends NestedPaths<T>
    ? TypeFromPath<T, P> extends Type
      ? P
      : never
    : never
  : never;

export type Filter<T extends GenericObject> = {
  id: NestedPaths<T>;
  fn: (value: T) => boolean;
};

type Lest = {
  a: {
    b: number;
    // c: number;
  };
  b: {
    c: number;
  };
};

type Paths = NestedPaths<Lest>;

/**
 *
 * @param data we pass in our data here
 * @returns
 */
export const useDataHandler = <T extends GenericObject>(data: T[]) => {
  // TODO have to redo anything that has 'keyof T' because otherwise we can't handle nested objects.
  // TODO one way to solve this is to have a 'path' property that is an array of strings, and then we can use that to get the value.
  // TODO but the issue with this that it isn't easily serializable, so we can't use it for comparisons.
  // TODO another way is to have a 'path' property that is a string, and then we can use that to get the value.
  // TODO formatted as A.B.C where A is the first level, B is the second level, and C is the third level.
  // TODO should figure out some way to split and query
  const [filters, setFilters] = useState<Filter<T>[]>([]);
  const [search, setSearch] = useState<string | null>(null);
  const [sort, setSort] = useState<{
    id: NestedPaths<T>;
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

  const addFilter = (id: NestedPaths<T>, fn: (value: T) => boolean) => {
    setFilters((fils) => [...fils.filter((f) => f.id !== id), { id, fn }]);
  };

  const removeFilter = (id: NestedPaths<T>) => {
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

/**
 * Nasty code to get the type of the value from the path. Bit hacky, but this is the best I could come up with.
 * @param id
 * @param data
 * @returns
 */
const nestedPathToValue = <
  T extends GenericObject,
  K extends NestedPaths<T>,
  R extends TypeFromPath<T, K>
>(
  id: K,
  data: T
): R => {
  const split = (id as string).split(".");
  return split.reduce(
    (acc, curr) =>
      typeof acc === "object" ? (acc as GenericObject)[curr] : acc,
    data as unknown
  ) as R;
};

/**
 * Creates a numerical filter, you have to specify the generic T in order to get better type hints
 * @param id path of values
 * @param min minimum
 * @param max maximum
 * @returns
 */
export const createNumericalFilter = <T extends GenericObject>(
  id: NestedPathsByType<T, number>,
  min: number,
  max: number
): Filter<T> => ({
  id,
  fn: (value: T) =>
    nestedPathToValue(id, value) >= min && nestedPathToValue(id, value) <= max,
});

type Test = {
  a: {
    b: boolean;
    e: string;
  };
};

type E = TypeFromPath<Test, NestedPathsByType<Test, boolean>>;

export const createBooleanFilter = <T extends GenericObject>(
  id: NestedPathsByType<T, boolean>,
  value: boolean
): Filter<T> => ({
  id,
  fn: (val: T) => nestedPathToValue(id, val) === value,
});

export const createDropDownFilter = <
  T extends GenericObject,
  K extends NestedPathsByType<T, string>
>(
  id: K,
  is: TypeFromPath<T, K>[]
): Filter<T> => ({
  id,
  fn: (value) => is.includes(nestedPathToValue(id, value)),
});

export const createTextFilter = <
  T extends GenericObject,
  K extends NestedPathsByType<T, string>
>(
  id: K,
  text: string
): Filter<T> => ({
  id,
  fn: (value: T) => nestedPathToValue<T, K, string>(id, value).includes(text),
});
1;
