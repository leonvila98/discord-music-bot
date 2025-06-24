const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Music Bot Commands')
            .setDescription('Here are all the available commands:')
            .addFields(
                { 
                    name: '/play [url]', 
                    value: 'Play music from a YouTube URL (adds to queue if already playing)', 
                    inline: false 
                },
                { 
                    name: '/queue', 
                    value: 'Show the current music queue', 
                    inline: false 
                },
                { 
                    name: '/skip', 
                    value: 'Skip the current song', 
                    inline: false 
                },
                { 
                    name: '/remove [position]', 
                    value: 'Remove a song from the queue by position', 
                    inline: false 
                },
                { 
                    name: '/pause', 
                    value: 'Pause or resume the current music', 
                    inline: false 
                },
                { 
                    name: '/stop', 
                    value: 'Stop playing music, clear queue, and leave the voice channel', 
                    inline: false 
                },
                { 
                    name: '/help', 
                    value: 'Show this help message', 
                    inline: false 
                }
            )
            .addFields(
                {
                    name: '📝 How to use',
                    value: '1. Join a voice channel\n2. Use `/play` with a YouTube URL\n3. Add more songs with `/play` - they\'ll be added to the queue\n4. Use `/queue` to see upcoming songs\n5. Use other commands to control playback',
                    inline: false
                }
            )
            .setFooter({ text: 'Music Bot - Powered by Discord.js' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
}; 