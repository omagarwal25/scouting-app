import Fuse from "fuse.js";
import { useMemo, useState } from "react";

type Primitive = string | number | symbol;

type GenericObject = Record<Primitive, unknown>;

// type Join<
//   L extends Primitive | undefined,
//   R extends Primitive | undefined
// > = L extends string | number
//   ? R extends string | number
//     ? `${L}.${R}`
//     : L
//   : R extends string | number
//   ? R
//   : undefined;

// type Union<
//   L extends unknown | undefined,
//   R extends unknown | undefined
// > = L extends undefined
//   ? R extends undefined
//     ? undefined
//     : R
//   : R extends undefined
//   ? L
//   : L | R;

/**
 * NestedPaths
 * Get all the possible paths of an object
 * @example
 * type Keys = NestedPaths<{ a: { b: { c: string } }>
 * // 'a' | 'a.b' | 'a.b.c'
 */
// export type NestedPaths<
//   T extends GenericObject,
//   Prev extends Primitive | undefined = undefined,
//   Path extends Primitive | undefined = undefined
// > = {
//   [K in keyof T]: T[K] extends GenericObject
//     ? NestedPaths<T[K], Union<Prev, Path>, Join<Path, K>>
//     : Union<Union<Prev, Path>, Join<Path, K>>;
// }[keyof T];

export type NestedPaths<ObjectType extends GenericObject> = {
  [Key in keyof ObjectType &
    (string | number)]: ObjectType[Key] extends GenericObject
    ? `${Key}` | `${Key}.${NestedPaths<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// export type NestedPaths<T extends GenericObject> = string;

/**
 * TypeFromPath
 * Get the type of the element specified by the path
 * @example
 * type TypeOfAB = TypeFromPath<{ a: { b: { c: string } }, 'a.b'>
 * // { c: string }
 */
export type TypeFromPath<
  T extends GenericObject,
  Path extends string // Or, if you prefer, NestedPaths<T>
> = {
  [K in Path]: K extends keyof T
    ? T[K]
    : K extends `${infer P}.${infer S}`
    ? T[P] extends GenericObject
      ? TypeFromPath<T[P], S>
      : never
    : never;
}[Path];

export type Filter<T extends GenericObject> = {
  id: NestedPaths<T>;
  fn: (value: T) => boolean;
};

/**
 *
 * @param options is where we pass in our data
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

// export const createNumericalFilter = <T extends GenericObject>(
//   id: T extends unknown ? NestedPaths<T> : string,
//   min: number,
//   max: number
// ): Filter<T> => ({
//   id,
//   fn: (value: T) =>
//     // id.split(".").reduce((curr, acc) => acc[curr], value) >= min &&
//     // value[id] <= max,
// });

export const createDropDownFilter = <
  T extends GenericObject,
  K extends NestedPaths<T>
>(
  id: K,
  is: TypeFromPath<T, K>[]
): Filter<T> => ({
  id,
  fn: (value) =>
    is.includes(id.split(".").reduce((curr, acc) => acc[curr], value)),
});

export const createTextFilter = <
  T extends GenericObject,
  K extends NestedPaths<T>
>(
  id: K,
  text: string
): Filter<T> => ({
  id,
  fn: (value: T) => (value[id] as string).includes(text),
});
