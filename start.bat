@echo off
echo Starting Gun Capital Discord Bot...
echo ==================================
echo Make sure you have:
echo 1. Added your bot token to the .env file
echo 2. Created the required channels in your Discord server
echo    - bot-logs
echo    - commodities-highlights
echo    - indices-highlights
echo    - crypto-highlights
echo    - forex-highlights
echo ==================================
echo Press Ctrl+C to stop the bot
echo.

node index.js

pause