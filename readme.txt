  npm i sqlite3
  npm i -g sqlite3

  npm install -g pkg
Create .exe file for win x64:
  pkg server.js
Create .exe file for win x86:
  pkg server.js --targets=latest-win-x86

This script completes all alarms in Casl Cloud Database (including alarms with errors, which cannot be completed by operator).