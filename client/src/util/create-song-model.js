export default function createSongModel(spotifySong) {
    let song = {};

    song.id = spotifySong.id;
    song.name = spotifySong.name;

    song.artist = spotifySong.artists.map((artist) => {
        return artist.name;
    }).reduce((prev, curr, index) => {
        if (index) {
            return prev + ', ' + curr
        }

        return prev + curr;
    }, '');

    if (spotifySong.album && spotifySong.album.images && spotifySong.album.images.length) {
        song.imageUrl = spotifySong.album.images[0].url;
    }

    return song;
};