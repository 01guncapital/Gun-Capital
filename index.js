import { Client, GatewayIntentBits, EmbedBuilder, ChannelType } from 'discord.js';
import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import 'dotenv/config';

// Configuration
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

// Create client instance with required intents
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Create Telegram bot instance
const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Function to get log channel
function getLogChannel(guild) {
  return guild.channels.cache.find(channel => 
    channel.name === CONFIG.LOG_CHANNEL_NAME && 
    channel.type === ChannelType.GuildText
  );
}

// Function to log messages
async function logMessage(guild, message, type = 'info') {
  const logChannel = getLogChannel(guild);
  if (!logChannel) return;
  
  const embed = new EmbedBuilder()
    .setTitle(`📝 Bot Log - ${type.charAt(0).toUpperCase() + type.slice(1)}`)
    .setDescription(message)
    .setColor(type === 'error' ? '#FF0000' : type === 'success' ? '#00FF00' : CONFIG.EMBED_COLOR)
    .setTimestamp();
  
  try {
    await logChannel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Failed to send log message:', error);
  }
}

// Function to send image to Telegram
async function sendImageToTelegram(imageUrl, categoryName, telegramTopicId) {
  try {
    await telegramBot.sendPhoto(CONFIG.TELEGRAM_GROUP_ID, imageUrl, { 
      message_thread_id: telegramTopicId 
    });
    console.log(`[✅ Sent] ${categoryName} → Telegram (Topic ID: ${telegramTopicId})`);
    return true;
  } catch (error) {
    console.error(`[❌ Error] Failed to send image to Telegram for ${categoryName}:`, error.message);
    return false;
  }
}

// Function to create highlight embed
function createHighlightEmbed(message, categoryName) {
  const embed = new EmbedBuilder()
    .setTitle(`📊 New Highlight from ${categoryName}`)
    .setColor(CONFIG.EMBED_COLOR)
    .setAuthor({
      name: message.author.username,
      iconURL: message.author.displayAvatarURL()
    })
    .setTimestamp(message.createdAt)
    .setFooter({ 
      text: `Forwarded by ❤️ Reaction • ${new Date().toLocaleDateString()}` 
    });
  
  // Add message content if it exists
  if (message.content && message.content.trim() !== '') {
    embed.setDescription(message.content);
  }
  
  // Add media attachments if they exist
  if (message.attachments.size > 0) {
    const attachments = Array.from(message.attachments.values());
    const image = attachments.find(att => att.contentType && att.contentType.startsWith('image/'));
    const video = attachments.find(att => att.contentType && att.contentType.startsWith('video/'));
    
    if (image) {
      embed.setImage(image.url);
    } else if (video) {
      embed.addFields({ name: '📹 Video Attachment', value: `[Watch Video](${video.url})` });
    } else {
      // For other attachments
      const attachmentLinks = attachments.map(att => `[${att.name}](${att.url})`).join('\n');
      embed.addFields({ name: '📎 Attachments', value: attachmentLinks });
    }
  }
  
  // Add link to original message
  embed.addFields({
    name: '🔗 Original Message',
    value: `[Go to original message](${message.url})`
  });
  
  return embed;
}

// Event when Discord client is ready
discordClient.once('ready', async () => {
  console.log(`Discord Bot is ready! Logged in as ${discordClient.user.tag}`);
  
  // Join all active threads in all guilds
  discordClient.guilds.cache.forEach(async (guild) => {
    try {
      const threads = await guild.channels.fetchActiveThreads();
      threads.threads.forEach(async (thread) => {
        if (!thread.joined) {
          try {
            await thread.join();
            console.log(`Joined existing thread: ${thread.name}`);
            logMessage(guild, `🧵 Joined existing thread: ${thread.name} (ID: ${thread.id})`, 'info');
          } catch (error) {
            console.error(`Failed to join thread ${thread.name}:`, error);
            logMessage(guild, `❌ Failed to join existing thread ${thread.name}: ${error.message}`, 'error');
          }
        }
      });
      
      // Log that bot is active
      logMessage(guild, `✅ Bot is now online and monitoring reactions`, 'success');
    } catch (error) {
      console.error(`Failed to fetch active threads for guild ${guild.name}:`, error);
      logMessage(guild, `❌ Failed to fetch active threads: ${error.message}`, 'error');
    }
  });
});

// Event when a thread is created
discordClient.on('threadCreate', async (thread) => {
  try {
    // Automatically join the thread
    await thread.join();
    console.log(`Joined new thread: ${thread.name}`);
    
    // Log the event
    if (thread.guild) {
      logMessage(thread.guild, `🧵 Joined new thread: ${thread.name} (ID: ${thread.id})`, 'info');
    }
  } catch (error) {
    console.error('Failed to join thread:', error);
    if (thread.guild) {
      logMessage(thread.guild, `❌ Failed to join thread ${thread.name}: ${error.message}`, 'error');
    }
  }
});

// Event when a reaction is added
discordClient.on('messageReactionAdd', async (reaction, user) => {
  // Fetch reaction details if partial
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Failed to fetch reaction:', error);
      return;
    }
  }
  
  // Check if it's the correct emoji
  if (reaction.emoji.name !== CONFIG.REACTION_EMOJI && 
      (reaction.emoji.id && reaction.emoji.id !== CONFIG.REACTION_EMOJI)) {
    return;
  }
  
  // Get message and guild
  const message = reaction.message;
  const guild = message.guild;
  if (!guild) return;
  
  // Log the reaction event
  logMessage(guild, `❤️ Reaction added by ${user.tag} on message ID ${message.id}`, 'info');
  
  // Get the member who added the reaction
  const member = await guild.members.fetch(user.id);
  if (!member) return;
  
  // Check if user has the required role
  const hasRequiredRole = member.roles.cache.has(CONFIG.REQUIRED_ROLE_ID);
  if (!hasRequiredRole) {
    logMessage(guild, `❌ User ${user.tag} does not have the required role to trigger forwarding`, 'info');
    return;
  }
  
  // Get the channel (could be a regular channel or a thread)
  const channel = message.channel;
  let parentCategory = null;
  
  // Handle threads
  if (channel.isThread()) {
    // Get the parent channel of the thread
    const parentChannel = channel.parent;
    if (parentChannel) {
      // Check if the parent channel has a category
      parentCategory = parentChannel.parent;
    }
  } else {
    // Regular channel
    parentCategory = channel.parent;
  }
  
  // Check if the channel is in a monitored category
  if (!parentCategory || !CONFIG.CATEGORIES[parentCategory.id]) {
    logMessage(guild, `ℹ️ Reaction in unmonitored category: ${parentCategory ? parentCategory.name : 'No category'}`, 'info');
    return;
  }
  
  const categoryInfo = CONFIG.CATEGORIES[parentCategory.id];
  
  // Check if message has image attachments
  const imageAttachments = Array.from(message.attachments.values()).filter(
    att => att.contentType && att.contentType.startsWith('image/')
  );
  
  if (imageAttachments.length === 0) {
    console.log(`[⚠️ Skipped] No image found in message from ${categoryInfo.name}`);
    logMessage(guild, `⚠️ No image found in message from ${categoryInfo.name}`, 'info');
    return;
  }
  
  // Send each image to Telegram
  for (const attachment of imageAttachments) {
    try {
      const success = await sendImageToTelegram(attachment.url, categoryInfo.name, categoryInfo.telegramTopicId);
      if (success) {
        logMessage(guild, `✅ Image sent to Telegram ${categoryInfo.name} topic`, 'success');
      } else {
        logMessage(guild, `❌ Failed to send image to Telegram ${categoryInfo.name} topic`, 'error');
      }
    } catch (error) {
      console.error(`[❌ Error] Failed to process image for ${categoryInfo.name}:`, error.message);
      logMessage(guild, `❌ Failed to process image for ${categoryInfo.name}: ${error.message}`, 'error');
    }
  }
  
  // Get the target channel for this category by ID (for Discord forwarding)
  const targetChannel = guild.channels.cache.get(categoryInfo.targetChannelId);
  
  if (targetChannel) {
    try {
      // Create and send the highlight embed
      const embed = createHighlightEmbed(message, categoryInfo.name);
      await targetChannel.send({ embeds: [embed] });
      
      // Log success
      const channelName = channel.isThread() ? `thread ${channel.name}` : channel.name;
      logMessage(guild, `✅ Message forwarded from ${channelName} to ${targetChannel.name}`, 'success');
    } catch (error) {
      console.error('Failed to send highlight message:', error);
      logMessage(guild, `❌ Failed to forward message to channel ID ${categoryInfo.targetChannelId}: ${error.message}`, 'error');
    }
  }
});

// Login to Discord
discordClient.login(process.env.DISCORD_TOKEN);