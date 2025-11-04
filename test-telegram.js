// Test file for Telegram integration

console.log('Testing Telegram bot integration...');

// Load environment variables
require('dotenv').config();

// Import Telegram bot
const TelegramBot = require('node-telegram-bot-api');

// Check if Telegram bot token is provided
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set in .env file');
  process.exit(1);
}

// Create Telegram bot instance
const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// Test the bot info
telegramBot.getMe()
  .then((info) => {
    console.log('✅ Telegram bot connected successfully!');
    console.log('Bot info:', info);
  })
  .catch((error) => {
    console.error('❌ Failed to connect to Telegram:', error.message);
  });

console.log('Test completed. Check above for results.');