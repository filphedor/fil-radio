import './bundle.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';

import SpotifyRadio from '/components/spotify-radio/spotify-radio';

import Dependencies from './util/dependencies';

import SpotifyService from './services/spotify-service';
import QueueService from './services/queue-service';
import NotificationService from './services/notification-service';

let spotifyService = new SpotifyService({'clientId': process.env.SPOTIFY_CLIENT_ID});
let queueService = new QueueService(process.env.QUEUE_HOST, process.env.QUEUE_EVENT_HOST);
let notificationService = new NotificationService();

queueService.connect();

Dependencies.addDependency('spotifyService', spotifyService);
Dependencies.addDependency('queueService', queueService);
Dependencies.addDependency('notificationService', notificationService);

const root = createRoot(document.getElementById('root'));
root.render(<SpotifyRadio/>);
