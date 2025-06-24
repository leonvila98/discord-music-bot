class QueueManager {
    constructor() {
        this.queues = new Map(); // Map<GuildId, Queue>
    }

    // Obtener la cola de un servidor específico
    getQueue(guildId) {
        if (!this.queues.has(guildId)) {
            this.queues.set(guildId, {
                songs: [],
                currentSong: null,
                isPlaying: false,
                volume: 100
            });
        }
        return this.queues.get(guildId);
    }

    // Agregar una canción a la cola
    addSong(guildId, song) {
        const queue = this.getQueue(guildId);
        queue.songs.push(song);
        return queue.songs.length;
    }

    // Obtener la siguiente canción de la cola
    getNextSong(guildId) {
        const queue = this.getQueue(guildId);
        if (queue.songs.length > 0) {
            const nextSong = queue.songs.shift();
            queue.currentSong = nextSong;
            return nextSong;
        }
        queue.currentSong = null;
        queue.isPlaying = false;
        return null;
    }

    // Obtener la canción actual
    getCurrentSong(guildId) {
        const queue = this.getQueue(guildId);
        return queue.currentSong;
    }

    // Verificar si hay canciones en la cola
    hasSongs(guildId) {
        const queue = this.getQueue(guildId);
        return queue.songs.length > 0;
    }

    // Obtener todas las canciones en la cola
    getSongs(guildId) {
        const queue = this.getQueue(guildId);
        return queue.songs;
    }

    // Limpiar la cola
    clearQueue(guildId) {
        const queue = this.getQueue(guildId);
        queue.songs = [];
        queue.currentSong = null;
        queue.isPlaying = false;
    }

    // Establecer el estado de reproducción
    setPlaying(guildId, isPlaying) {
        const queue = this.getQueue(guildId);
        queue.isPlaying = isPlaying;
    }

    // Verificar si está reproduciendo
    isPlaying(guildId) {
        const queue = this.getQueue(guildId);
        return queue.isPlaying;
    }

    // Remover una canción específica de la cola por índice
    removeSong(guildId, index) {
        const queue = this.getQueue(guildId);
        if (index >= 0 && index < queue.songs.length) {
            const removedSong = queue.songs.splice(index, 1)[0];
            return removedSong;
        }
        return null;
    }

    // Obtener el tamaño de la cola
    getQueueSize(guildId) {
        const queue = this.getQueue(guildId);
        return queue.songs.length;
    }
}

module.exports = QueueManager; 