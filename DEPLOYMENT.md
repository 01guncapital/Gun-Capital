# Deployment Guide for Gun Capital Discord Bot

## Hosting Options

There are several ways to deploy your Discord bot. Here are some popular options:

### 1. Local Hosting (Development)

For testing and development:
```
node index.js
```

### 2. Cloud Hosting Services

#### Heroku (Free Tier Available)
1. Create a Heroku account
2. Install Heroku CLI
3. Login: `heroku login`
4. Create app: `heroku create your-app-name`
5. Set environment variables:
   ```
   heroku config:set DISCORD_TOKEN=your_token_here
   ```
6. Deploy: `git push heroku master`

#### Railway (Free Tier Available)
1. Create a Railway account
2. Connect your GitHub repository
3. Add environment variables in the Railway dashboard
4. Deploy with one click

#### Render (Free Tier Available)
1. Create a Render account
2. Create a new Web Service
3. Connect your repository
4. Set environment variables
5. Set build command: `npm install`
6. Set start command: `npm start`

### 3. VPS or Dedicated Server

1. Get a VPS (DigitalOcean, Linode, AWS, etc.)
2. Install Node.js
3. Upload your bot files
4. Install dependencies: `npm install`
5. Set environment variables
6. Run the bot: `node index.js`
7. Use a process manager like PM2 for production:
   ```
   npm install pm2 -g
   pm2 start index.js
   pm2 startup
   pm2 save
   ```

## Environment Variables

Make sure to set these environment variables in your hosting environment:

- `DISCORD_TOKEN` - Your bot's token from Discord Developer Portal

## Process Management

For production deployments, use a process manager like PM2:

1. Install PM2 globally:
   ```
   npm install pm2 -g
   ```

2. Start your bot with PM2:
   ```
   pm2 start index.js --name gun-capital-bot
   ```

3. Save the process list:
   ```
   pm2 save
   ```

4. Set PM2 to start on boot:
   ```
   pm2 startup
   ```

## Monitoring and Logging

- Check logs with: `pm2 logs gun-capital-bot`
- Monitor performance with: `pm2 monit`
- Restart the bot with: `pm2 restart gun-capital-bot`
- Stop the bot with: `pm2 stop gun-capital-bot`

## Auto-Restart on Failure

PM2 will automatically restart your bot if it crashes. You can also configure it to restart on file changes for development:

```
pm2 start index.js --name gun-capital-bot --watch
```

## Scaling Considerations

- For a single server bot, the current implementation is sufficient
- For multiple servers, consider implementing sharding
- Monitor memory usage and restart periodically if needed