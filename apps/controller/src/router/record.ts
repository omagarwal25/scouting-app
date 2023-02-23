import {
  objectiveRecordSchema,
  pitRecordSchema,
  subjectiveRecordSchema,
} from "@griffins-scout/game";
import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import {
  addObjectiveRecord,
  addPitRecord,
  addSubjectiveRecord,
  getAuthToken,
} from "../utils/sheet.js";

export const recordRouter = router({
  createRecord: publicProcedure
    .input(
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
    )
    .mutation(async ({ input }) => {
      if (input.type === "objective") {
        addObjectiveRecord(await getAuthToken(), input.record);
      } else if (input.type === "pit") {
        addPitRecord(await getAuthToken(), input.record);
      } else {
        addSubjectiveRecord(await getAuthToken(), input.record);
      }
    }),
});
