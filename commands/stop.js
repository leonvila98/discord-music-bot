const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing music and leave the voice channel'),

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
            // Stop the connection
            connection.destroy();

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('⏹️ Music Stopped')
                .setDescription('Stopped playing music and left the voice channel.')
                .addFields(
                    { name: 'Channel', value: voiceChannel.name, inline: true },
                    { name: 'Stopped by', value: interaction.user.username, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error stopping music:', error);
            await interaction.reply({
                content: '❌ An error occurred while stopping the music!',
                ephemeral: true
            });
        }
    },
}; 