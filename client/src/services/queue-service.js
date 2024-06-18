import axios from 'axios';
import { io } from "socket.io-client";


export default class QueueService {
    constructor(apiHost, eventHost) {
        this._apiHost = apiHost;
        this._eventHost = eventHost;
        this._socket = null;
        this._isConnected = false;

        this._connectListeners = [];
        this._disconnectListeners = [];
        this._queueChangeListeners = [];
        this._songStartListeners = [];

        this.QueueErrors = {
            'SONG_EXISTS': 'Song exists',
            'COMMUNICATION_ERROR': 'Communication error',
        };
    }

    async connect() {
        if (!this._socket) {
            const socket = io("ws://" + this._eventHost, {
                reconnectionDelayMax: 10000
            });

            socket.on("connect", () => {
                this._isConnected = true;

                console.log('connect')

                this._connectListeners.forEach((listener) => {
                    listener();
                });
            });

            socket.on("disconnect", () => {
                this._isConnected = false;

                console.log('disconnect')

                this._disconnectListeners.forEach((listener) => {
                    listener();
                });
            });

            socket.on("queueChange", () => {
                console.log('queue change')

                this._queueChangeListeners.forEach((listener) => {
                    listener();
                });
            });

            socket.on("songStart", (song) => {
                console.log('song start')

                this._songStartListeners.forEach((listener) => {
                    listener(song);
                });
            });

            this._socket = socket;
        }
    }

    onConnect(listener) {
        this._connectListeners.push(listener);

        return (() => {
            this._connectListeners.splice(this._connectListeners.indexOf(listener), 1);
        });
    }

    onDisconnect(listener) {
        this._disconnectListeners.push(listener);

        return (() => {
            this._disconnectListeners.splice(this._disconnectListeners.indexOf(listener), 1);
        });
    }

    onQueueChange(listener) {
        this._queueChangeListeners.push(listener);

        return (() => {
            this._queueChangeListeners.splice(this._queueChangeListeners.indexOf(listener), 1);
        });
    }

    onSongStart(listener) {
        this._songStartListeners.push(listener);

        return (() => {
            this._songStartListeners.splice(this._songStartListeners.indexOf(listener), 1);
        });
    }

    async getQueue() {
        let url = this._apiHost + '/queue';

        try {
            let response = await axios.get(url);

            if (response.status === 200) {
                let buildTrackModel = function(spotifyTrack) {
                    let track = {};
        
                    track.id = spotifyTrack.id;
                    track.name = spotifyTrack.name;
                    track.artist = spotifyTrack.artists.map((artist) => {
                        return artist.name;
                    }).reduce((prev, curr, index) => {
                        if (index) {
                            return prev + ', ' + curr
                        }
        
                        return prev + curr;
                    }, '');
        
                    return track;
                };

                return response.data.map((track) => {
                    return buildTrackModel(track);
                });
            }
        } catch(e) {
            throw new Error(QueueErrors.COMMUNICATION_ERROR);
        }
    }

    async getCurrentSong() {
        let url = this._apiHost + '/queue/current';

        try {
            let response = await axios.get(url);

            if (response.status === 200) {
                let buildTrackModel = function(spotifyTrack) {
                    let track = {};
        
                    track.id = spotifyTrack.id;
                    track.name = spotifyTrack.name;
                    track.artist = spotifyTrack.artists.map((artist) => {
                        return artist.name;
                    }).reduce((prev, curr, index) => {
                        if (index) {
                            return prev + ', ' + curr
                        }
        
                        return prev + curr;
                    }, '');
        
                    return track;
                };

                if (!response.data) {
                    return null;
                }

                return buildTrackModel(response.data);
            }
        } catch(e) {
            console.log(e)
            throw new Error(QueueErrors.COMMUNICATION_ERROR);
        }
    }

    async addSongById(songId) {
        let url = this._apiHost + '/queue';

        try {
            let response = await axios.post(url, {
                'songId': songId
            });

            if (response.status === 201) {
                return;
            }

            console.log(response)
            
            if (response.status === 409) {
                throw new Error(QueueErrors.SONG_EXISTS);
            }

            throw new Error(QueueErrors.COMMUNICATION_ERROR);
        } catch(e) {
            console.log(e)
            if (e.message === QueueErrors.SONG_EXISTS) {
                throw e;
            }

            throw new Error(QueueErrors.COMMUNICATION_ERROR);
        }
    }

    listenForSongStart() {

    }
};