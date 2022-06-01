import dotenv from "dotenv";
import { logger } from "./logger";

dotenv.config({ path: "../.env" });
dotenv.config();
export const env = {
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  SERVER_PORT: process.env.SERVER_PORT,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SHOP_EMAIL: process.env.SHOP_EMAIL,
  SHOP_PW: process.env.SHOP_PW,
};

export function checkEnviornment() {
  for (let envKey in env) {
    if (env[envKey]) {
      logger.info(`${envKey}=${env[envKey]}`);
    } else {
      logger.info(`NOT FIND: ${envKey}=${env[envKey]} !!`);
    }
  }
}

export default env;
