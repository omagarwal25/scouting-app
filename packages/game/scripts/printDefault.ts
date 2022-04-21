import { z } from "zod";
import {
  autoSchema,
  teleopSchema,
  endgameSchema,
  pregameSchema,
  postgameSchema,
} from "../src";

const gameSchema = z.object({
  auto: autoSchema.default(autoSchema.parse({})),
  teleop: teleopSchema.default(teleopSchema.parse({})),
  endgame: endgameSchema.default(endgameSchema.parse({})),
  pregame: pregameSchema.default(pregameSchema.parse({})),
  postgame: postgameSchema.default(postgameSchema.parse({})),
});

console.log(gameSchema);
