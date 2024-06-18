import './radio.scss';

import React, { useState, useEffect } from "react";

import Dependencies from '/util/dependencies';


let SpotifyRadio = function() {
    let [search, setSearch] = useState('');
    let [searchResults, setSearchResults] = useState([]);
    let [isConnected, setIsConnected] = useState(false);
    let [queue, setQueue] = useState([]);
    let [currentSong, setCurrentSong] = useState(null);

    const spotifyService = Dependencies.getDependency('spotifyService');
    const queueService = Dependencies.getDependency('queueService');
    const notificationService = Dependencies.getDependency('notificationService');

    const updateQueue = async function() {
        try {
            let queue = await queueService.getQueue();

            setQueue(queue);
        } catch(e) {
            notificationService.trigger({
                'message': 'Cannot get current queue',
                'type': notificationService.Types.ERROR
            })
        }
    };

    const updateCurrentSong = async function() {
        try {
            let song = await queueService.getCurrentSong();

            setCurrentSong(song);
        } catch(e) {
            notificationService.trigger({
                'message': 'Cannot get current song',
                'type': notificationService.Types.ERROR
            })
        }
    };

    const setUpEvents = async function() {
        let unListenConnect = queueService.onConnect(() => {
            setIsConnected(true);
        });

        let unListenDisconnect = queueService.onDisconnect(() => {
            setIsConnected(false);
        });

        let unListenQueueChange = queueService.onQueueChange(() => {
            console.log('updating queue')
            updateQueue();
        });

        let unListenSongStart = queueService.onSongStart((song) => {
            console.log('updating current song')
            updateCurrentSong();

            if (song) {
                spotifyService.playSong(song.id);
            }
        });

        return (() => {
            unListenConnect();
            unListenDisconnect();
            unListenQueueChange();
            unListenSongStart();
        });
    };

    useEffect(() => {
        updateQueue();
        updateCurrentSong();
        setUpEvents();
    }, []);

    let handleSearchChange = function(e) {
        setSearch(e.target.value);
    };

    let handleSearch = async function() {
        let results = await spotifyService.searchTracks(search);

        setSearchResults(results);
    };

    let handleKey = function(e) {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    let handleAdd = async function(songId) {
        try {
            await queueService.addSongById(songId);
        } catch(e) {
            if (e.message === queueService.QueueErrors.SONG_EXISTS) {
                notificationService.trigger({
                    'message': 'Song is already in queue',
                    'type': notificationService.Types.ERROR
                });
            } else {
                notificationService.trigger({
                    'message': 'Unable to add song to queue',
                    'type': notificationService.Types.ERROR
                });
            }
        }
    }

    let getSearchResults = function() {
        return searchResults.map((result) => {
            return (
                <div className={'radio__search-result'}>
                    <div className={'radio__search-name'}>
                        {result.name}
                    </div>
                    <div className={'radio__search-artist'}>
                        {result.artist}
                    </div>
                    <div className={'radio__search-add'} onClick={() => handleAdd(result.id)}>Add</div>
                </div>
            )
        });
    };

    let getQueueResults = function() {
        return queue.map((result) => {
            return (
                <div className={'radio__search-result'}>
                    <div className={'radio__search-name'}>
                        {result.name}
                    </div>
                    <div className={'radio__search-artist'}>
                        {result.artist}
                    </div>
                    <div className={'radio__search-add'} onClick={() => handleAdd(result.id)}>Add</div>
                </div>
            )
        });
    };

    return (
        <div className={'radio'}>
            <div className={'radio__search-section'}>
                <div className={'radio__search'}>
                    <input className={'radio__search-input'} onChange={handleSearchChange} onKeyDown={handleKey} value={search}></input>
                </div>
                <div className={'radio__search-results'}>
                    {getSearchResults()}
                </div>
            </div>
            <div className={'radio__player-section'}>
                {currentSong ? currentSong.name : "No song playing"}
            </div>
            <div className={'radio__queue-section'}>
                <div className={'radio__queue-status'}>
                    {isConnected.toString()}
                </div>
                <div className={'radio__queue-results'}>
                    {getQueueResults()}
                </div>
            </div>
        </div>
    );
};

export default SpotifyRadio;