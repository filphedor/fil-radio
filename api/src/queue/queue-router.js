import express from 'express';

const routerFunc = function(queueService) {
    let router = express.Router();

    router.get('/', async (request, response) => {
        try {
            let queue = await queueService.getQueue();

            return response.json(queue);
        } catch (e) {
            return response.sendStatus(500);
        }
    });

    router.post('/', async (request, response) => {
        let songId = request.body ? request.body.songId : null;

        if (!songId) {
            return response.sendStatus(400);
        }

        try {
            await queueService.addSongById(songId);

            return response.sendStatus(201);
        } catch (e) {
            console.log(e)
            if (e.message === queueService.QueueErrors.SONG_EXISTS) {
                return response.sendStatus(409);
            }

            return response.sendStatus(500);
        }
    });

    router.get('/current', async (request, response) => {
        try {
            let song = await queueService.getCurrentSong();

            return response.json(song);
        } catch (e) {
            return response.sendStatus(500);
        }
    });

    return router;
};

export default routerFunc;