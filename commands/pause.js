const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause or resume the current music'),

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

            const state = player.state.status;

            if (state === 'playing') {
                player.pause();
                const embed = new EmbedBuilder()
                    .setColor('#ffff00')
                    .setTitle('⏸️ Music Paused')
                    .setDescription('Music has been paused.')
                    .addFields(
                        { name: 'Channel', value: voiceChannel.name, inline: true },
                        { name: 'Paused by', value: interaction.user.username, inline: true }
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            } else if (state === 'paused') {
                player.unpause();
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('▶️ Music Resumed')
                    .setDescription('Music has been resumed.')
                    .addFields(
                        { name: 'Channel', value: voiceChannel.name, inline: true },
                        { name: 'Resumed by', value: interaction.user.username, inline: true }
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({
                    content: '❌ Cannot pause/resume in current state!',
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error('Error pausing/resuming music:', error);
            await interaction.reply({
                content: '❌ An error occurred while pausing/resuming the music!',
                ephemeral: true
            });
        }
    },
}; 