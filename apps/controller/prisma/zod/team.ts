import * as z from "zod"
import { CompleteRecord, RelatedRecordModel } from "./index"

export const TeamModel = z.object({
  id: z.number().int(),
  name: z.string(),
  number: z.number().int(),
  weight: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteTeam extends z.infer<typeof TeamModel> {
  Records: CompleteRecord[]
}

/**
 * RelatedTeamModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTeamModel: z.ZodSchema<CompleteTeam> = z.lazy(() => TeamModel.extend({
  Records: RelatedRecordModel.array(),
}))
