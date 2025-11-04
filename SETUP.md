# Setup Guide for Gun Capital Discord Bot

## Step 1: Create a Discord Bot Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give your application a name (e.g., "Gun Capital Bot")
4. Go to the "Bot" section in the left sidebar
5. Click "Add Bot" and confirm
6. Copy the bot token - you'll need this later
7. Under "Privileged Gateway Intents", enable:
   - MESSAGE CONTENT INTENT
   - SERVER MEMBERS INTENT

## Step 2: Create a Telegram Bot

1. Open Telegram and search for [BotFather](https://t.me/BotFather)
2. Start a chat with BotFather
3. Send `/newbot` command
4. Follow the instructions to create your bot
5. Copy the bot token - you'll need this later

## Step 3: Configure Bot Permissions

1. In the Discord "Bot" section, scroll down to "Permissions"
2. Enable the following permissions:
   - View Channels
   - Send Messages
   - Embed Links
   - Read Message History
   - Use Slash Commands (optional)
   - Create Public Threads (required for thread joining)
   - Create Private Threads (required for private thread joining)
3. Copy the generated invite link

## Step 4: Install Dependencies (Once PowerShell Execution Policy is Fixed)

Due to PowerShell execution policy restrictions, you'll need to either:

Option A: Change execution policy (recommended for development)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Option B: Use the full path to npm:
```
C:\Program Files\nodejs\npm install
```

Option C: Use the provided install.bat file by double-clicking it

## Step 5: Configure Environment Variables

1. Rename `.env.example` to `.env`
2. Replace the placeholder tokens with your actual tokens:
   - `DISCORD_TOKEN`: Your Discord bot token
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
   - `TELEGRAM_GROUP_ID`: Your Telegram group ID (default is -1003290216282)

## Step 6: Set Up Discord Channels

Create the following channels in your Discord server:

1. `bot-logs` - for bot activity logs
2. Ensure you have the target highlight channels with these specific IDs:
   - Commodities highlights: Channel ID 1435402258006278245
   - Indices highlights: Channel ID 1435402325215936654
   - Crypto highlights: Channel ID 1435402383814557716
   - Forex highlights: Channel ID 1435402405092266128

Note: The bot now uses specific channel IDs rather than channel names for forwarding messages.

## Step 7: Set Up Telegram

1. Add your Telegram bot to the group where you want images to be sent
2. Ensure the bot has permission to send messages in the group
3. The group should have the forum topics enabled with the following IDs:
   - Crypto: Topic ID 3
   - Commodities: Topic ID 5
   - Indices: Topic ID 7
   - Forex: Topic ID 9

## Step 8: Invite Bot to Your Server

1. Use the invite link generated in Step 3
2. Select your server
3. Ensure all required permissions are granted

## Step 9: Run the Bot

```
node index.js
```

Or if you've fixed the execution policy:
```
npm start
```

Or use the provided start.bat file by double-clicking it

## Troubleshooting

### Common Issues

1. **"Cannot find module 'discord.js'" or "Cannot find module 'node-telegram-bot-api'"**
   - Run `npm install` to install dependencies
   - Or double-click install.bat

2. **"Missing Access" or "Missing Permissions"**
   - Ensure the bot has all required permissions
   - Check that channels exist with correct names
   - Make sure the bot has thread-related permissions

3. **Bot not responding to reactions**
   - Verify the bot is online
   - Check that the user has the required role (ID: 1428890158924566741)
   - Ensure messages are in the correct categories
   - For thread messages, ensure the bot has joined the thread (it should auto-join both new and existing active threads)

4. **Reactions not detected in threads**
   - The bot automatically joins new threads and all existing active threads at startup
   - Ensure the bot has CREATE_PUBLIC_THREADS and CREATE_PRIVATE_THREADS permissions

5. **Images not sent to Telegram**
   - Verify your Telegram bot token is correct
   - Ensure the bot is added to the Telegram group
   - Check that the Telegram group ID is correct
   - Verify the topic IDs match those in your Telegram group

### Logs

All bot activities are logged to the `bot-logs` channel. Check this channel for:
- Successful operations
- Error messages
- Permission issues
- Configuration problems
- Thread joining notifications
- Telegram send successes and failures

### Console Output

The bot provides clear console output for Telegram operations:
- `[✅ Sent] Crypto → Telegram` - Successful image send
- `[⚠️ Skipped] No image found` - Message had no images
- `[❌ Error] Failed to send image to Telegram` - Telegram send failure