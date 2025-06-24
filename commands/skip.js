const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const QueueManager = require('../utils/queueManager');

const queueManager = new QueueManager();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: '❌ You need to be in a voice channel to use this command!',
                ephemeral: true
            });
        }

        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            return interaction.reply({
                content: '❌ I\'m not currently playing music in any voice channel!',
                ephemeral: true
            });
        }

        try {
            const player = connection.state.subscription?.player;

            if (!player) {
                return interaction.reply({
                    content: '❌ No audio player found!',
                    ephemeral: true
                });
            }

            const currentSong = queueManager.getCurrentSong(interaction.guild.id);
            
            // Stop the current audio (this will trigger the 'idle' event and play next song)
            player.stop();

            const embed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('⏭️ Song Skipped')
                .setDescription(`Skipped: **${currentSong ? currentSong.title : 'Current song'}**`)
                .addFields(
                    { name: 'Skipped by', value: interaction.user.username, inline: true },
                    { name: 'Queue size', value: `${queueManager.getQueueSize(interaction.guild.id)} songs`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error skipping song:', error);
            await interaction.reply({
                content: '❌ An error occurred while skipping the song!',
                ephemeral: true
            });
        }
    },
}; 