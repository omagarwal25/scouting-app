import * as z from "zod"
import { GameType } from "@prisma/client"
import { CompleteRecord, RelatedRecordModel } from "./index"

export const GameModel = z.object({
  id: z.number().int(),
  key: z.string(),
  time: z.date(),
  type: z.nativeEnum(GameType),
  number: z.number().int(),
  set: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteGame extends z.infer<typeof GameModel> {
  Records: CompleteRecord[]
}

/**
 * RelatedGameModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGameModel: z.ZodSchema<CompleteGame> = z.lazy(() => GameModel.extend({
  Records: RelatedRecordModel.array(),
}))
