import axios from 'axios';


export default class SpotifyService {
    constructor(clientId, clientSecret) {
        this._clientId = clientId;
        this._clientSecret = clientSecret;
        this._token = null;

        this.SpotifyErrors = {
            'COMMUNICATION_ERROR': 'Communication error',
            'AUTH_ERROR': 'Auth error',
        };
    }

    async connect() {
        let authConfig = {
            'headers': {
                'Authorization': 'Basic ' + (new Buffer.from(this._clientId + ':' + this._clientSecret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        let authData = {
            grant_type: 'client_credentials'
        };

        try {
            let response = await axios.post(
                'https://accounts.spotify.com/api/token', 
                authData,
                authConfig
            );

            this._token = response.data.access_token;

            return;
        } catch(e) {
            console.log(e)
            throw new Error(this.SpotifyErrors.AUTH_ERROR);
        }
    }

    async _wrapWithAuthCatch(func) {
        try {
            let response = await func();

            return response;
        } catch(e) {
            if (axios.isAxiosError(e) && e.response.status === 401) {

                await this.connect();

                let response2 = await func();

                return response2;
            }
        }
    }

    async getSongData(songId) {
        try {
            let response = await this._wrapWithAuthCatch(async () => {
                let url = 'https://api.spotify.com/v1/tracks/' + songId;

                let requestConf = {
                    'headers': {
                        'Authorization': 'Bearer ' + this._token
                    }
                };

                let innerResponse = await axios.get(url, requestConf);

                return innerResponse;
            });

            return response.data;
        } catch(e) {
            if (e.message === this.SpotifyErrors.AUTH_ERROR) {
                throw new Error(this.SpotifyErrors.AUTH_ERROR);
            }

            throw new Error(this.SpotifyErrors.COMMUNICATION_ERROR);
        }
    }
}