const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const QueueManager = require('../utils/queueManager');

const queueManager = new QueueManager();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a song from the queue')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('Position of the song to remove (1, 2, 3, etc.)')
                .setRequired(true)
                .setMinValue(1)),

    async execute(interaction) {
        const position = interaction.options.getInteger('position') - 1; // Convertir a índice base 0
        const guildId = interaction.guild.id;

        if (!queueManager.hasSongs(guildId)) {
            return interaction.reply({
                content: '❌ No songs in queue!',
                ephemeral: true
            });
        }

        const removedSong = queueManager.removeSong(guildId, position);
        
        if (!removedSong) {
            return interaction.reply({
                content: '❌ Invalid position! Use `/queue` to see the current queue.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('🗑️ Song Removed')
            .setDescription(`**${removedSong.title}**`)
            .setThumbnail(removedSong.thumbnail)
            .addFields(
                { name: 'Removed by', value: interaction.user.username, inline: true },
                { name: 'Queue size', value: `${queueManager.getQueueSize(guildId)} songs`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
}; 