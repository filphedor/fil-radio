import './search.scss';

import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons'

import Dependencies from '/util/dependencies';

import Song from '/components/song/song';


let Search = function() {
    let [search, setSearch] = useState('');
    let [searchResults, setSearchResults] = useState([]);

    const spotifyService = Dependencies.getDependency('spotifyService');
    const queueService = Dependencies.getDependency('queueService');
    const notificationService = Dependencies.getDependency('notificationService');

    let handleSearchChange = function(e) {
        setSearch(e.target.value);
    };

    let handleSearch = async function() {
        if (search) {
            let results = await spotifyService.searchTracks(search);

            setSearchResults(results);
        }
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
        return searchResults.map((song) => {
            return (
                <Song song={song} hoverContent={
                    <div className={'search__hover-content'}>
                        <div className={'search__add-icon-wrapper'}>
                            <div className={'search__add-icon'} onClick={() => handleAdd(song.id)}>
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                         </div>
                    </div>
                }/>
            )
        });
    };

    return (
        <div className={'search'}>
            <div className={'search__search'}>
                <div className={'search__search-wrapper'}>
                    <div className={'search__search-icon'}>
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <input className={'search__input'} onChange={handleSearchChange} onKeyDown={handleKey} value={search}></input>
                </div>
            </div>
            <div className={'search__results'}>
                {getSearchResults()}
            </div>
        </div>
    );
};

export default Search;