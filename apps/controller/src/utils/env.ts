import dotenv from "dotenv";
import { envsafe, port, str } from "envsafe";

dotenv.config();

export const env = envsafe({
  NODE_ENV: str({
    devDefault: "development",
    choices: ["development", "test", "production"],
  }),
  PORT: port({
    devDefault: 8080,
  }),
  X_TBA_AUTH_KEY: str(),
  EVENT_CODE: str(),
  SHEET_ID: str(),
  CRED_PATH: str(),
});

console.log(env.EVENT_CODE);
