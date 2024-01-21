const express = require('express')
const request = require('request');
const dotenv = require('dotenv');
const cors = require("cors");
const TokenManager = require('./functions/TokenManager');

dotenv.config()
var app = express();

const port = 5000
const LIMIT = 50

var token = new TokenManager(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET)
token.retrieveNewToken()

app.use(cors());

app.get("/auth/getSinglePlaylist", (req, res) => {
    if (token.isTokenExpired()) {
        token.retrieveNewToken()
    }

    let playlist = req.query.playlist;
    let encodedPlaylist = encodeURIComponent(playlist);
    const fields = "fields=owner.display_name%2Cimages%2Cname%2Cname%2Cid" 
    let spotifyURL = `https://api.spotify.com/v1/playlists/${encodedPlaylist}?${fields}`;

    fetch(spotifyURL, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token.getAccessToken()}`,
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        // Process and send back the data
        console.log("200: Returned Playlists")
        res.json(data);
    })
    .catch(error => {
        // Handle any errors
        if (error.status === 401) {
            console.log("Retrying due to error, attempting to refresh token")

        }
    });

})

app.get('/auth/getPlaylists', (req, res) => {
    // Check if token needs to refreshed
    if (token.isTokenExpired()) {
        token.retrieveNewToken()
    }

    let name = req.query.name

    let encodedName = encodeURIComponent(name);
    let spotifyURL = `https://api.spotify.com/v1/search?q=${encodedName}&type=playlist&limit=${LIMIT}&offset=0`;


    fetch(spotifyURL, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token.getAccessToken()}`,
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            // Process and send back the data
            console.log("200: Returned Playlists")
            res.json(data);
        })
        .catch(error => {
            // Handle any errors
            if (error.status === 401) {
                console.log("Retrying due to error, attempting to refresh token")

            }
        });
})

app.get("/auth/getTracks", (req, res) => {
    // Check if token needs to refreshed
    if (token.isTokenExpired()) {
        token.retrieveNewToken();
    }

    // TODO: randomly pull songs


    let name = req.query.name;
    let encodedName = encodeURIComponent(name);
    let spotifyURL = `https://api.spotify.com/v1/playlists/${encodedName}/tracks?limit=100`;
    fetch(spotifyURL, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token.getAccessToken()}`,
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            // Process and send back the data
            console.log("200: Returned Tracks")
            res.json(data);
        })
        .catch(error => {
            // Handle any errors
            console.log("error: ", error.status)
        });
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})