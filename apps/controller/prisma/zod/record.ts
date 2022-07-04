import * as z from "zod"
import { Station } from "@prisma/client"
import { CompleteGame, RelatedGameModel, CompleteTeam, RelatedTeamModel } from "./index"

export const RecordModel = z.object({
  id: z.number().int(),
  station: z.nativeEnum(Station),
  gameId: z.number().int(),
  data: z.string().array(),
  teamId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteRecord extends z.infer<typeof RecordModel> {
  Game: CompleteGame
  Team: CompleteTeam
}

/**
 * RelatedRecordModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRecordModel: z.ZodSchema<CompleteRecord> = z.lazy(() => RecordModel.extend({
  Game: RelatedGameModel,
  Team: RelatedTeamModel,
}))
