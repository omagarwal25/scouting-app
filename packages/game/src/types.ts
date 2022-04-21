import { ZodSchema } from "zod";

export interface ScoringElement {
  name: string;
  label: string;
  screens: Screen[];
  field: Field;
  schema: ZodSchema;
  hash: number;
}

type Screen = "Auto" | "Teleop" | "Endgame" | "Pregame" | "Postgame";

export type Field =
  | { fieldType: "Boolean" | "Text" }
  | {
      fieldType: "Numeric";
      min?: number;
      max?: number;
      isInteger: boolean;
      incrementable: boolean;
    }
  | { fieldType: "Dropdown"; options: string[] };
export interface YearGame {
  name: string;
  year: number;
  description: string;

  scoringElements: ScoringElement[];
}

export function hashCode(str: string) {
  var hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
