const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const QueueManager = require('../utils/queueManager');

const queueManager = new QueueManager();

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
            const song = {
                title: videoInfo.videoDetails.title,
                url: url,
                thumbnail: videoInfo.videoDetails.thumbnails[0].url,
                duration: videoInfo.videoDetails.lengthSeconds,
                requestedBy: interaction.user.username,
                requestedByAvatar: interaction.user.displayAvatarURL()
            };

            const guildId = interaction.guild.id;
            const queue = queueManager.getQueue(guildId);
            const connection = getVoiceConnection(guildId);

            // Si no hay conexión, crear una nueva
            if (!connection) {
                const newConnection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });

                const player = createAudioPlayer();
                newConnection.subscribe(player);

                // Configurar eventos del reproductor
                player.on(AudioPlayerStatus.Playing, () => {
                    console.log('Audio started playing');
                    queueManager.setPlaying(guildId, true);
                });

                player.on(AudioPlayerStatus.Idle, () => {
                    console.log('Audio finished playing');
                    queueManager.setPlaying(guildId, false);
                    
                    // Reproducir siguiente canción si hay
                    const nextSong = queueManager.getNextSong(guildId);
                    if (nextSong) {
                        playNextSong(newConnection, player, nextSong, interaction);
                    } else {
                        // No hay más canciones, desconectar después de 30 segundos
                        setTimeout(() => {
                            if (!queueManager.hasSongs(guildId)) {
                                newConnection.destroy();
                            }
                        }, 30000);
                    }
                });

                player.on('error', error => {
                    console.error('Error:', error);
                    interaction.followUp({
                        content: '❌ An error occurred while playing the audio!',
                        ephemeral: true
                    });
                    queueManager.setPlaying(guildId, false);
                });

                // Agregar la canción a la cola y reproducir
                queueManager.addSong(guildId, song);
                queueManager.setPlaying(guildId, true);
                await playNextSong(newConnection, player, song, interaction);

            } else {
                // Ya hay una conexión, solo agregar a la cola
                const position = queueManager.addSong(guildId, song);
                
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('🎵 Added to Queue')
                    .setDescription(`**${song.title}**`)
                    .setThumbnail(song.thumbnail)
                    .addFields(
                        { name: 'Position in queue', value: `#${position}`, inline: true },
                        { name: 'Requested by', value: song.requestedBy, inline: true },
                        { name: 'Queue size', value: `${queueManager.getQueueSize(guildId)} songs`, inline: true }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            }

        } catch (error) {
            console.error('Error:', error);
            await interaction.editReply({
                content: '❌ An error occurred while processing the YouTube URL!',
                ephemeral: true
            });
        }
    },
};

// Función para reproducir la siguiente canción
async function playNextSong(connection, player, song, interaction) {
    try {
        const stream = ytdl(song.url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        });

        const resource = createAudioResource(stream);
        player.play(resource);

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('🎵 Now Playing')
            .setDescription(`**${song.title}**`)
            .setThumbnail(song.thumbnail)
            .addFields(
                { name: 'Requested by', value: song.requestedBy, inline: true },
                { name: 'Queue size', value: `${queueManager.getQueueSize(interaction.guild.id)} songs`, inline: true }
            )
            .setTimestamp();

        // Enviar mensaje al canal
        const channel = interaction.channel;
        await channel.send({ embeds: [embed] });

    } catch (error) {
        console.error('Error playing next song:', error);
        const channel = interaction.channel;
        await channel.send('❌ An error occurred while playing the next song!');
    }
} 