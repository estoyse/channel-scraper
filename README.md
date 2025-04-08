# 🏴‍☠️ channel-scraper

A Telegram automation script built with [GramJS](https://github.com/gram-js/gramjs) to **save and archive messages/media** from `t.me/c/...` (private channel) links into a designated archive channel.

When you send a `t.me/c/<channel_id>/<post_id>` link in your archive channel, this bot will:

- Automatically fetch the target message from the source channel.
- Save any attached media (document, video, photo, etc.) to disk.
- Re-upload the media to your archive channel with proper caption.
- Gracefully handle missing or non-media messages.

---

## 🚀 Features

- ✅ Supports document, photo, video, and text messages
- ✅ Downloads with progress bar
- ✅ Auto re-uploads media to archive channel
- ✅ Skips and logs inaccessible or missing messages
- ✅ Works with private `t.me/c/...` links

---

## 📦 Requirements

- Node.js ≥ 18
- Telegram API credentials
- Your Telegram account with access to both source and archive channels

---

## 🛠️ Setup

### 1. Clone the repo

```bash
git clone https://github.com/estoyse/channel-scraper.git
cd channel-scraper
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `config.js` file

Inside the project root, create a `.env` file:

```
TELEGRAM_API_ID=123456 # from my.telegram.org
TELEGRAM_API_HASH=your_api_hash #from my.telegram.org
TELEGRAM_STRING_SESSION="" # Leave empty for first run
ARCHIVE_CHANNEL_ID=1234567890 # your archive channel's ID (without -100 prefix)
```

> You'll be prompted to log in on the first run. Once authenticated, the session string will be sent to your saved messages — copy and paste it into your `.env` to skip login next time.

---

## 📂 Usage

### 1. Run the bot

```bash
node index.js
```

### 2. Interact in Telegram

- In your archive channel, send any message containing a `t.me/c/<channel_id>/<post_id>` link.
- The bot will fetch the message, download any media, and re-upload it with caption.

---

## 📁 File Structure

```
money-trckr-backend/
│
├── files/               # Temporary folder for downloads
├── messageSaver.js      # Core logic for downloading/sending messages
├── index.js             # Entry point
├── config.js            # Gets environment variables from .env
├── .env                 # Your env variables (not committed)
└── README.md
```

---

## ⚠️ Notes

- For `t.me/c/<channel_id>/<post_id>` links, the `channel_id` is the **internal ID**, not the public `@username`.
- Make sure your Telegram account is a member of both source and destination channels.

---

## 🔒 Privacy & Security

- This project uses **Telegram’s official MTProto protocol** via GramJS.
- Your session string is stored locally — treat it like a password.
- Solely for educational purposes only. Do not use this for illegal activities.

---

## 📜 License

MIT — feel free to fork and build on it.

---

## 🙋‍♂️ Support or Questions?

Open an issue or reach out on Telegram.
