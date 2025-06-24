# 🎵 Discord Music Bot

A Discord bot that plays music from YouTube URLs using Discord.js and ytdl-core.

## Features

- 🎵 Play music from YouTube URLs
- ⏸️ Pause and resume playback
- ⏭️ Skip current song
- ⏹️ Stop music and leave voice channel
- 📋 Help command with all available commands
- 🎨 Beautiful embeds with song information
- 🎯 Slash commands for easy interaction

## Prerequisites

- Node.js 16.9.0 or higher
- A Discord bot token
- FFmpeg (included via ffmpeg-static)

## Setup Instructions

### 1. Create a Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Copy the bot token (you'll need this later)
5. Under "Privileged Gateway Intents", enable:
   - Message Content Intent
   - Server Members Intent
   - Presence Intent

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

1. Copy `env.example` to `.env`
2. Fill in your bot token and client ID:

```env
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```

### 4. Deploy Slash Commands

```bash
node deploy-commands.js
```

### 5. Run the Bot

```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Commands

| Command | Description |
|---------|-------------|
| `/play [url]` | Play music from a YouTube URL |
| `/pause` | Pause or resume the current music |
| `/skip` | Skip the current song |
| `/stop` | Stop playing music and leave the voice channel |
| `/help` | Show all available commands |

## Usage

1. Invite the bot to your server with the following permissions:
   - Send Messages
   - Use Slash Commands
   - Connect to Voice Channels
   - Speak in Voice Channels

2. Join a voice channel

3. Use `/play` with a YouTube URL to start playing music

4. Use other commands to control playback

## Project Structure

```
discord-music-bot/
├── commands/           # Slash command files
│   ├── play.js        # Play music command
│   ├── pause.js       # Pause/resume command
│   ├── skip.js        # Skip song command
│   ├── stop.js        # Stop music command
│   └── help.js        # Help command
├── index.js           # Main bot file
├── deploy-commands.js # Command deployment script
├── package.json       # Dependencies and scripts
├── env.example        # Environment variables template
└── README.md          # This file
```

## Dependencies

- **discord.js**: Discord API wrapper
- **@discordjs/voice**: Voice functionality
- **ytdl-core**: YouTube video downloading
- **ffmpeg-static**: FFmpeg binary for audio processing
- **libsodium-wrappers**: Encryption for voice
- **dotenv**: Environment variable management

## Troubleshooting

### Bot doesn't join voice channel
- Make sure the bot has the "Connect" and "Speak" permissions
- Check that you're in a voice channel when using commands

### Audio doesn't play
- Ensure FFmpeg is properly installed (included via ffmpeg-static)
- Check that the YouTube URL is valid
- Verify the bot has proper permissions

### Commands not working
- Make sure you've deployed the slash commands using `node deploy-commands.js`
- Check that the bot has "Use Slash Commands" permission

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License. 