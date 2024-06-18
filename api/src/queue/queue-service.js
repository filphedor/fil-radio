export default class QueueService {
    constructor(spotifyService) {
        this._spotifyService = spotifyService;
        this._queue = [];
        this._currentSong = null;
        this._songStartedAt = null;

        this._queueChangeListeners = [];
        this._songStartListeners = [];

        this.QueueErrors = {
            'SONG_EXISTS': 'Song exists',
            'SPOTIFY_ERROR': 'Spotify error',
        };
    }

    async getQueue() {
        return this._queue;
    }

    async getCurrentSong() {
        return this._currentSong;
    }

    async getElapsedTime() {
        if (this._currentSong && this._songStartedAt) {
            return new Date() - this._songStartedAt;
        }

        return null;
    }

    async nextSong() {
        if (this._queue.length) {
            this._currentSong = this._queue.shift();
            this._songStartedAt = new Date();

            this.triggerQueueChange();
            this.triggerSongStart(this._currentSong);

            setTimeout(() => {
                this.nextSong();
            }, this._currentSong.duration_ms);
        } else {
            this._currentSong = null;
            this._songStartedAt = null;

            this.triggerQueueChange();
            this.triggerSongStart(this._currentSong);
        }
    }

    async triggerQueueChange() {
        this._queueChangeListeners.forEach((listener) => {
            listener();
        });
    }

    async triggerSongStart(song) {
        this._songStartListeners.forEach((listener) => {
            listener(song);
        });
    }

    async onQueueChange(listener) {
        this._queueChangeListeners.push(listener);
    }

    async onSongStart(listener) {
        this._songStartListeners.push(listener);
    }

    async addSongById(songId) {
        let songData;

        try {
            songData = await this._spotifyService.getSongData(songId);
        } catch(e) {
            throw new Error(this.QueueErrors.SPOTIFY_ERROR);
        }

        //dont add songs already present in queue
        if (this._queue.includes(songData)) {
            throw new Error(this.QueueErrors.SONG_EXISTS);
        }

        this._queue.push(songData);

        if (this._queue.length === 1 && !this._currentSong) {
            this.nextSong();
        }

        this.triggerQueueChange();

        return;
    }
}