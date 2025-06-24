const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music from a YouTube URL')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('YouTube URL to play')
                .setRequired(true)),

    async execute(interaction) {
        const url = interaction.options.getString('url');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: '❌ You need to be in a voice channel to use this command!',
                ephemeral: true
            });
        }

        if (!ytdl.validateURL(url)) {
            return interaction.reply({
                content: '❌ Please provide a valid YouTube URL!',
                ephemeral: true
            });
        }

        await interaction.deferReply();

        try {
            // Get video info
            const videoInfo = await ytdl.getInfo(url);
            const videoTitle = videoInfo.videoDetails.title;
            const videoThumbnail = videoInfo.videoDetails.thumbnails[0].url;

            // Join voice channel
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            // Create audio player
            const player = createAudioPlayer();
            connection.subscribe(player);

            // Create audio resource from YouTube
            const stream = ytdl(url, {
                filter: 'audioonly',
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            });

            const resource = createAudioResource(stream);
            player.play(resource);

            // Create embed
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🎵 Now Playing')
                .setDescription(`**${videoTitle}**`)
                .setThumbnail(videoThumbnail)
                .addFields(
                    { name: 'Channel', value: voiceChannel.name, inline: true },
                    { name: 'Requested by', value: interaction.user.username, inline: true }
                )
                .setTimestamp();

            // Handle player events
            player.on(AudioPlayerStatus.Playing, () => {
                console.log('Audio started playing');
            });

            player.on(AudioPlayerStatus.Idle, () => {
                console.log('Audio finished playing');
                connection.destroy();
            });

            player.on('error', error => {
                console.error('Error:', error);
                interaction.followUp({
                    content: '❌ An error occurred while playing the audio!',
                    ephemeral: true
                });
                connection.destroy();
            });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error:', error);
            await interaction.editReply({
                content: '❌ An error occurred while processing the YouTube URL!',
                ephemeral: true
            });
        }
    },
}; 