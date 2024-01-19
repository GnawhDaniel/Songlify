const request = require('request');


class TokenManager {
    constructor(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET) {
        this.accessToken = '';
        this.SPOTIFY_CLIENT_ID = SPOTIFY_CLIENT_ID;
        this.SPOTIFY_CLIENT_SECRET = SPOTIFY_CLIENT_SECRET;
        this.expirationTime = null;
    }

    setAccessToken(token) {
        this.expirationTime = Date.now() + (1 * 60 * 60 * 1000)
        // this.expirationTime = Date.now() + (1 * 1000)
        this.accessToken = token;
    }

    getAccessToken() {
        return this.accessToken;
    }

    isTokenExpired() {
        return !this.accessToken || !this.expirationTime || Date.now() >= this.expirationTime
    }

    // Function to retrieve a new access token from the Spotify API
    retrieveNewToken() {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };

        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                this.setAccessToken(body.access_token);
                console.log("Access token updated: ", this.accessToken);
            } else {
                // Handle errors or unsuccessful token retrieval
                console.error("Failed to retrieve token", error);
            }
        });
    }

    // Function to check and refresh token if necessary
    refreshTokenIfNeeded() {
        this.retrieveNewToken();
    }
}

module.exports = TokenManager;
