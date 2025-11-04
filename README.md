# Gun Capital Discord Bot

A Discord bot that monitors heart reactions on messages and forwards them to category-specific highlight channels and Telegram topics.

## Features

- Monitors ❤️ reactions on messages in specific categories
- Only responds to reactions from users with a specific role (ID: 1428890158924566741)
- Supports 4 categories:
  - Commodities (ID: 1428884790815490129) → Highlights sent to channel ID: 1435402258006278245 → Telegram topic ID: 5
  - Indices (ID: 1428884852194807968) → Highlights sent to channel ID: 1435402325215936654 → Telegram topic ID: 7
  - Crypto (ID: 1428884873224912947) → Highlights sent to channel ID: 1435402383814557716 → Telegram topic ID: 3
  - Forex (ID: 1428884896688115886) → Highlights sent to channel ID: 1435402405092266128 → Telegram topic ID: 9
- Forwards messages with rich embeds containing:
  - Original author information
  - Message content
  - Media previews
  - Link to original message
- **Sends images to Telegram topics when heart reactions are added**
- Now supports reactions in thread messages (including forum threads)
- Automatically joins new threads and all existing active threads at startup
- Logs all activities to a `bot-logs` channel

## Setup Instructions

### Prerequisites

- Node.js v16 or higher
- A Discord bot token (from Discord Developer Portal)
- A Telegram bot token (from Telegram BotFather)
- Telegram group ID where the bot will send images

### Installation

1. Clone this repository or download the files
2. Install dependencies:
   ```
   npm install
   ```

### Configuration

1. Create a Discord bot application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a Telegram bot with [BotFather](https://t.me/BotFather)
3. Copy your Discord bot token and Telegram bot token
4. Rename `.env.example` to `.env` and add your tokens:
   ```
   DISCORD_TOKEN=your_discord_bot_token_here
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   TELEGRAM_GROUP_ID=-1003290216282
   ```

### Channel Setup

Create the following channels in your Discord server:
- `bot-logs` - for bot activity logs
- Ensure you have the target highlight channels with these specific IDs:
   - Commodities highlights: Channel ID 1435402258006278245
   - Indices highlights: Channel ID 1435402325215936654
   - Crypto highlights: Channel ID 1435402383814557716
   - Forex highlights: Channel ID 1435402405092266128

### Running the Bot Locally

```
npm start
```

Or for development with auto-restart:
```
npm run dev
```

### Windows Users (PowerShell Execution Policy Issues)

If you're on Windows and encounter PowerShell execution policy issues, you can use the provided batch files:

1. Double-click `install.bat` to install dependencies
2. Double-click `start.bat` to start the bot

Alternatively, you can run the bot directly with:
```
node index.js
```

## Deployment to Railway

### Prerequisites

1. Create a [Railway](https://railway.app/) account
2. Have your Discord and Telegram bot tokens ready

### Project Structure

```
/project-root
 ├── package.json
 ├── index.js
 ├── Procfile
 ├── railway.json
 ├── .env (local test için)
 └── README.md
```

### Deployment Steps

1. Fork this repository or download the code
2. Go to [Railway](https://railway.app/) and create a new project
3. Connect your GitHub repository or upload the code directly
4. Add the following environment variables in the Railway dashboard:
   - `DISCORD_TOKEN`: Your Discord bot token
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
   - `TELEGRAM_GROUP_ID`: -1003290216282 (or your custom group ID)
5. Railway will automatically detect the start command (`npm start`) from package.json
6. Deploy the application

### Railway Configuration

- The bot will automatically start on deployment
- Logs will be visible in the Railway dashboard
- The bot will automatically restart if it crashes
- No additional configuration is needed for 24/7 uptime

## Permissions Required

The bot needs the following permissions:
- VIEW_CHANNEL
- SEND_MESSAGES
- EMBED_LINKS
- READ_MESSAGE_HISTORY
- MESSAGE_CONTENT
- MESSAGE_REACTIONS
- CREATE_PUBLIC_THREADS (to join threads)
- CREATE_PRIVATE_THREADS (to join private threads)

## How It Works

1. User adds a ❤️ reaction to any message in the monitored categories (including thread messages)
2. Bot checks if the user has the required role (ID: 1428890158924566741)
3. If the message contains images, they are sent to the corresponding Telegram topic
4. The bot creates an embed with the message content and media
5. The embed is sent to the corresponding category's highlight channel
6. All actions are logged in the `bot-logs` channel

## Enhanced Features

### Thread Support
- The bot automatically joins new threads to monitor reactions
- The bot also joins all existing active threads when it starts up
- Works with forum channels and regular thread channels
- Handles reactions on messages within threads

### Telegram Integration
- Images from heart-reacted messages are sent to Telegram topics
- Category to Telegram topic mapping:
  - Crypto → Topic ID 3
  - Commodities → Topic ID 5
  - Indices → Topic ID 7
  - Forex → Topic ID 9
- Console logs for successful and failed Telegram sends

### Customization

You can modify the category IDs, role ID, and other settings in `index.js`:

```javascript
const CONFIG = {
  // Role ID that can trigger the bot
  REQUIRED_ROLE_ID: '1428890158924566741',
  
  // Category IDs and their target channels
  CATEGORIES: {
    '1428884790815490129': { name: 'Commodities', targetChannelId: '1435402258006278245', telegramTopicId: 5 },
    '1428884852194807968': { name: 'Indices', targetChannelId: '1435402325215936654', telegramTopicId: 7 },
    '1428884873224912947': { name: 'Crypto', targetChannelId: '1435402383814557716', telegramTopicId: 3 },
    '1428884896688115886': { name: 'Forex', targetChannelId: '1435402405092266128', telegramTopicId: 9 }
  },
  
  // Emoji to listen for
  REACTION_EMOJI: '❤️',
  
  // Embed color
  EMBED_COLOR: '#6366F1',
  
  // Log channel name
  LOG_CHANNEL_NAME: 'bot-logs',
  
  // Telegram configuration
  TELEGRAM_GROUP_ID: process.env.TELEGRAM_GROUP_ID || '-1003290216282'
};