import { ZodSchema } from "zod";
export interface ObjectiveElement {
  name: string;
  label: string;
  screens: Screen[];
  field: Field;
  schema: ZodSchema;
}

export type SubjectiveElement = Omit<ObjectiveElement, "screens">;

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

  objectiveElements: ObjectiveElement[];
  subjectiveElements: SubjectiveElement[];
  infoElements: SubjectiveElement[];
}
