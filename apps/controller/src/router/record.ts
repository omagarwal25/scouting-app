import {
  objectiveRecordSchema,
  pitRecordSchema,
  subjectiveRecordSchema,
} from "@griffins-scout/game";
import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import {
  addMatches,
  addObjectiveRecord,
  addPitRecord,
  addSubjectiveRecord,
  getAuthToken,
} from "../utils/sheet.js";
import { getMatches } from "../utils/blueAlliance.js";

const input = z.array(
  z
    .object({
      type: z.literal("subjective"),
      record: subjectiveRecordSchema,
    })
    .or(
      z.object({
        type: z.literal("objective"),
        record: objectiveRecordSchema,
      })
    )
    .or(
      z.object({
        type: z.literal("pit"),
        record: pitRecordSchema,
      })
    )
);

export const recordRouter = router({
  createRecord: publicProcedure.input(input).mutation(async ({ input }) => {
    // if (input.type === "objective") {
    //   addObjectiveRecord(await getAuthToken(), input.record);
    // } else if (input.type === "pit") {
    //   addPitRecord(await getAuthToken(), input.record);
    // } else {
    //   addSubjectiveRecord(await getAuthToken(), input.record);
    // }

    const obj = input
      .filter((i) => i.type === "objective")
      .map((i) => i.record);
    const subj = input
      .filter((i) => i.type === "subjective")
      .map((i) => i.record);
    const pit = input.filter((i) => i.type === "pit").map((i) => i.record);

    await addObjectiveRecord(await getAuthToken(), obj as any);
    await addSubjectiveRecord(await getAuthToken(), subj as any);
    await addPitRecord(await getAuthToken(), pit as any);

    const matches = await getMatches();
    await addMatches(await getAuthToken(), matches);
  }),
});
