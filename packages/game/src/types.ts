import { ZodSchema } from "zod";
export interface BaseElement {
  name: string;
  label: string;
  field: Field;
  colour?:
    | "red"
    | "orange"
    | "yellow"
    | "lime"
    | "teal"
    | "blue"
    | "purple"
    | "pink";
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
type PitScreen = `Pit${
  | "Specifications"
  | "Drive"
  | "Auto"
  | "Teleop"
  | "Endgame"
  | "Other"
  | "Info"}`;

export type Screen = ObjectiveScreen | PitScreen;

export type Field =
  | { fieldType: "Boolean"; default?: boolean }
  | { fieldType: "Text"; default?: string }
  | {
      fieldType: "Numeric";
      min?: number;
      max?: number;
      isInteger: boolean;
      incrementable: boolean;
      default?: number;
    }
  | { fieldType: "Dropdown"; options: string[]; default?: string }
  | { fieldType: "Grouping"; fields: ScoutingElement[] };

export interface YearGame {
  name: string;
  year: number;
  allianceSize: number;
  description: string;

  elements: ScoutingElement[];
}
