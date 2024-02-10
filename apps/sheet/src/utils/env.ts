import dotenv from "dotenv";
import { envsafe, port, str, url } from "envsafe";

dotenv.config();

export const env = envsafe({
  NODE_ENV: str({
    devDefault: "development",
    choices: ["development", "test", "production"],
  }),
  X_TBA_AUTH_KEY: str(),
  EVENT_CODE: str(),
  CONTROLLER_URL: url(),
});

console.log(env.EVENT_CODE);
