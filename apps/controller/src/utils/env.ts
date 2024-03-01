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
  DATABASE_URL: url(),
});

