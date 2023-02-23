import dotenv from "dotenv";
import { envsafe, port, str, url } from "envsafe";

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
  DATABASE_URL: url(),
  EVENT_CODE: str(),
  SHEET_ID: str(),
});
