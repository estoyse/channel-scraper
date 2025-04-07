import { Api } from "telegram";
import path from "path";
import * as fs from "fs";
import { ARCHIVE_CHANNEL_ID } from "./config.js";

export default async function messageSaver(client, event) {
  const match = event.message.text.match(/t\.me\/c\/(\d+)\/(\d+)/);

  if (!match) {
    console.log("Invalid link");
    return;
  }
  const channelId = BigInt(match[1], 10);
  const messageId = parseInt(match[2], 10);
  let accessHash;

  const dialogs = await client.getDialogs();
  for (const dialog of dialogs) {
    if (dialog.entity.id.value === channelId) {
      console.log("Access Hash:", dialog.entity.accessHash);
      accessHash = dialog.entity.accessHash;
    }
  }
  const inputChannel = new Api.InputPeerChannel({
    channelId,
    accessHash,
  });

  const ids = Array.from({ length: messageId }, (_, i) => i + 1);
  for (const id of ids) {
    try {
      const [message] = await client.getMessages(inputChannel, {
        ids: id,
      });

      if (!message) {
        console.log("Message not found. Skipping...");
        await client.sendMessage(ARCHIVE_CHANNEL_ID, {
          message: `https://t.me/c/${channelId}/${id} not found`,
          parseMode: "markdown",
        });
        continue;
      }

      if (message.className !== "Message") {
        console.log(message.className, " is not a Message. Skipping...");
        continue;
      }

      if (!message.media) {
        client.sendMessage(ARCHIVE_CHANNEL_ID, {
          message: `${message.text} \n\nhttps://t.me/c/${channelId}/${id}`,
        });
        continue;
      }

      const buffer = await client.downloadMedia(message, {
        progressCallback: (downloaded, total) => {
          const percent = ((downloaded / total) * 100).toFixed(2);
          process.stdout.write(
            `\r📦 Downloading: ${percent}% (${downloaded}/${total} bytes) of https://t.me/c/${channelId}/${id}`,
          );
        },
      });

      // 1. Determine file name and type
      let fileName = "file";
      let mimeType = "application/octet-stream";

      const doc = message.media?.document;

      if (doc && doc.className === "Document") {
        mimeType = doc.mimeType || mimeType;

        for (const attr of doc.attributes) {
          if (attr.className === "DocumentAttributeFilename") {
            fileName = attr.fileName;
            break;
          }
        }

        if (!fileName.includes(".")) {
          const ext = mimeType.split("/")[1] || "bin";
          fileName += "." + ext;
        }
      } else if (message.media?.photo) {
        fileName = "photo.jpg";
        mimeType = "image/jpeg";
      }

      const filePath = path.join("./files", fileName); // or use your own temp folder

      // 2. Save to disk
      fs.writeFileSync(filePath, buffer);

      // 3. Send the file
      await client.sendFile(ARCHIVE_CHANNEL_ID, {
        file: filePath,
        caption: `${message.text} \n\nhttps://t.me/c/${channelId}/${id}`,
      });

      console.log("File Sent");

      // Optional: delete the file afterward if you want
      fs.unlinkSync(filePath);
    } catch (error) {
      console.log(error);
    }
  }
}
