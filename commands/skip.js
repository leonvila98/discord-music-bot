const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

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

            // Stop the current audio (this will trigger the 'idle' event)
            player.stop();

            const embed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('⏭️ Song Skipped')
                .setDescription('Skipped the current song.')
                .addFields(
                    { name: 'Channel', value: voiceChannel.name, inline: true },
                    { name: 'Skipped by', value: interaction.user.username, inline: true }
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