import * as dotenv from "dotenv";
dotenv.config();

export const TELEGRAM_API_HASH = process.env.TELEGRAM_API_HASH;
export const TELEGRAM_API_ID = +process.env.TELEGRAM_API_ID;

export const TELEGRAM_STRING_SESSION = process.env.TELEGRAM_STRING_SESSION;
export const ARCHIVE_CHANNEL_ID = process.env.ARCHIVE_CHANNEL_ID;
