// TODO this is just a simple schema for now.
// TODO Eventually you'd want to merge in the pit scouting stuff

import { Schema, model } from "mongoose";

export interface Team {
  name: string;
  number: number;
  weight: number;
}

export const teamSchema = new Schema<Team>({
  name: Schema.Types.String,
  number: Schema.Types.Number,
  weight: Schema.Types.Number,
});

export const TeamModel = model<Team>("team", teamSchema);
