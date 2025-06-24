const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const QueueManager = require('../utils/queueManager');

const queueManager = new QueueManager();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the current music queue'),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const queue = queueManager.getQueue(guildId);
        const currentSong = queueManager.getCurrentSong(guildId);
        const songs = queueManager.getSongs(guildId);

        if (!currentSong && songs.length === 0) {
            return interaction.reply({
                content: '❌ No songs in queue!',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎵 Music Queue')
            .setTimestamp();

        // Mostrar canción actual
        if (currentSong) {
            embed.addFields({
                name: '🎵 Now Playing',
                value: `**${currentSong.title}**\nRequested by: ${currentSong.requestedBy}`,
                inline: false
            });
        }

        // Mostrar próximas canciones
        if (songs.length > 0) {
            let queueText = '';
            songs.slice(0, 10).forEach((song, index) => {
                const duration = song.duration ? formatDuration(song.duration) : 'Unknown';
                queueText += `**${index + 1}.** ${song.title} - ${duration}\n`;
                queueText += `Requested by: ${song.requestedBy}\n\n`;
            });

            if (songs.length > 10) {
                queueText += `... and ${songs.length - 10} more songs`;
            }

            embed.addFields({
                name: '📋 Up Next',
                value: queueText,
                inline: false
            });

            embed.addFields({
                name: '📊 Queue Info',
                value: `Total songs: ${songs.length}`,
                inline: true
            });
        }

        await interaction.reply({ embeds: [embed] });
    },
};

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 