import { gameSchema } from "@griffins-scout/game";
import { z } from "zod";
import { createRouter } from "../context";
import { RecordModel } from "../models/record";

export const recordRouter = createRouter()
  .mutation("createRecord", {
    input: gameSchema,
    async resolve({ input }) {
      const record = new RecordModel(input);
      await record.save();

      return record;
    },
  })
  .query("findAll", {
    async resolve() {
      return RecordModel.find().exec();
    },
  })
  .mutation("deleteAll", {
    async resolve() {
      await RecordModel.deleteMany({}).exec();
    },
  })
  .query("findByTeam", {
    input: z.number().nonnegative().int(),
    async resolve({ input }) {
      return RecordModel.find({ "info.teamNumber": input }).exec();
    },
  });
