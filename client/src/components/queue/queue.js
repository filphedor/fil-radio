import './queue.scss';

import React, { useState, useEffect } from "react";

import Dependencies from '/util/dependencies';

import Song from '/components/song/song';


let Queue = function() {
    let [isConnected, setIsConnected] = useState(false);
    let [queue, setQueue] = useState([]);

    const spotifyService = Dependencies.getDependency('spotifyService');
    const queueService = Dependencies.getDependency('queueService');
    const notificationService = Dependencies.getDependency('notificationService');

    const updateQueue = async function() {
        try {
            let queue = await queueService.getQueue();

            queue.reverse()

            setQueue(queue);
        } catch(e) {
            notificationService.trigger({
                'message': 'Cannot get current queue',
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
            updateQueue();
        });

        return (() => {
            unListenConnect();
            unListenDisconnect();
            unListenQueueChange();
        });
    };

    useEffect(() => {
        updateQueue();
        setUpEvents();
    }, []);

    let getQueueResults = function() {
        return queue.map((song) => {
            return (
                <Song song={song}/>
            )
        });
    };

    return (
            <div className={'queue'}>
                <div className={'queue__status'}>
                    {isConnected.toString()}
                </div>
                <div className={'queue__results'}>
                    {getQueueResults()}
                </div>
            </div>
    );
};

export default Queue;