import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { text } from "input";
import { Logger } from "telegram/extensions/Logger.js";
import {
  TELEGRAM_API_HASH,
  TELEGRAM_API_ID,
  TELEGRAM_STRING_SESSION,
  ARCHIVE_CHANNEL_ID,
} from "./config.js";
import messageSaver from "./messageSaver.js";
import { NewMessage } from "telegram/events/NewMessage.js";

const apiId = TELEGRAM_API_ID;
const apiHash = TELEGRAM_API_HASH;

const stringSession = new StringSession(TELEGRAM_STRING_SESSION);

(async () => {
  Logger.setLevel("none");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await text("Please enter your number: "),
    password: async () => await text("Please enter your password: "),
    phoneCode: async () => await text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  client.addEventHandler(
    (event) => {
      messageSaver(client, event);
    },
    new NewMessage({
      chats: [ARCHIVE_CHANNEL_ID],
    }),
  );
})();
