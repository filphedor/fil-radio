import http from "http";
import express from 'express';
import cors from 'cors';
import { Server } from "socket.io";

import SpotifyService from "./spotify/spotify-service";
import QueueService from "./queue/queue-service";

import queueRouter from './queue/queue-router';

let spotifyService = new SpotifyService(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET);
let queueService = new QueueService(spotifyService);


const server = http.createServer();
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

io.listen(4000);

queueService.onQueueChange(() => {
   io.emit('queueChange'); 
});

queueService.onSongStart((song) => {
    io.emit('songStart', song); 
 });

const app = express();
app.use(express.json())
app.use(cors());

app.use('/queue', queueRouter(queueService));

http.createServer(app).listen(5000);

io.on("connection", (socket) => {
    socket.on("newMessage", (data) => {
        io.emit('newMessage', data);
    });
});

