import { ZodSchema } from "zod";
export interface BaseElement {
  name: string;
  label: string;
  field: Field;
  schema: ZodSchema;
}

export type ObjectiveElement = BaseElement & { screens: ObjectiveScreen[] };
export type SubjectiveElement = BaseElement & {
  screens: SubjectiveScreen[];
};
export type PitElement = BaseElement & { screens: PitScreen[] };

export type ScoutingElement = ObjectiveElement | SubjectiveElement | PitElement;

type ObjectiveScreen = `Objective${
  | "Auto"
  | "Teleop"
  | "Endgame"
  | "Pregame"
  | "Postgame"
  | "Info"}`;
type SubjectiveScreen = `Subjective${"Team" | "Other" | "Info"}`;
type PitScreen = `Pit${
  | "Info"
  | "Specifications"
  | "Drive"
  | "Auto"
  | "Teleop"
  | "Endgame"
  | "Other"}`;

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
  allianceSize: number;
  description: string;

  objectiveElements: ObjectiveElement[];
  subjectiveElements: SubjectiveElement[];
  pitElements: PitElement[];
}
