import './radio.scss';

import React, { useState, useEffect } from "react";

import Dependencies from '/util/dependencies';

import Search from '/components/search/search';
import Queue from '/components/queue/queue';


let SpotifyRadio = function() {
    let [currentSong, setCurrentSong] = useState(null);

    const spotifyService = Dependencies.getDependency('spotifyService');
    const queueService = Dependencies.getDependency('queueService');
    const notificationService = Dependencies.getDependency('notificationService');

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
        let unListenSongStart = queueService.onSongStart((song) => {
            updateCurrentSong();

            if (song) {
                spotifyService.playSong(song.id);
            }
        });

        return (() => {
            unListenSongStart();
        });
    };

    useEffect(() => {
        updateCurrentSong();
        setUpEvents();
    }, []);

    const getBackground = function() {
        if (currentSong) {
            return (
                <div className={'radio__background'}>
                    <img className={'radio__background-image'} src={currentSong.imageUrl}></img>
                </div>
            );
        }

        return null;
    };

    return (
        <div className={'radio'}>
            <div className={'radio__search'}>
                <Search/>
            </div>
            <div className={'radio__player'}>
                {getBackground()}
                <div className={'radio__current-song-display'}>
                    {currentSong ? currentSong.name : "No song playing"}
                </div>
            </div>
            <div className={'radio__queue'}>
                <Queue/>
            </div>
        </div>
    );
};

export default SpotifyRadio;