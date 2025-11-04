@echo off
echo Installing dependencies for Gun Capital Discord Bot...
echo =====================================================
echo This script will attempt to install the required Node.js packages.
echo If you encounter permission errors, you may need to run this as administrator
echo or adjust your PowerShell execution policy.
echo.

echo Installing discord.js...
npm install discord.js

echo Installing dotenv...
npm install dotenv

echo Installation complete!
echo.
echo To start the bot, run start.bat or use: node index.js
pause