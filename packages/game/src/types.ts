import { ZodSchema } from "zod";
export interface BaseElement {
  name: string;
  label: string;
  field: Field;
  schema: ZodSchema;
}

export type ScoutingElement = BaseElement & {
  screens: Screen[];
};

type ObjectiveScreen = `Objective${
  | "Pregame"
  | "Auto"
  | "Teleop"
  | "Endgame"
  | "Postgame"
  | "Other"
  | "Info"}`;
type SubjectiveScreen = `Subjective${"Team" | "Other" | "Info"}`;
type PitScreen = `Pit${
  | "Specifications"
  | "Drive"
  | "Auto"
  | "Teleop"
  | "Endgame"
  | "Other"
  | "Info"}`;

export type Screen = ObjectiveScreen | SubjectiveScreen | PitScreen;

export type Field =
  | { fieldType: "Boolean" | "Text" }
  | {
      fieldType: "Numeric";
      min?: number;
      max?: number;
      isInteger: boolean;
      incrementable: boolean;
    }
  | { fieldType: "Dropdown"; options: string[] }
  | { fieldType: "Grouping"; fields: ScoutingElement[] };

export interface YearGame {
  name: string;
  year: number;
  allianceSize: number;
  description: string;

  elements: ScoutingElement[];
}
