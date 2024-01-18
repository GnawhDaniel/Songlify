const express = require('express')
const request = require('request');
const dotenv = require('dotenv');
const cors = require("cors");

const port = 5000

global.access_token = ''

dotenv.config()
var app = express();
app.use(cors());

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

request.post(authOptions, function(error, response, body) {
if (!error && response.statusCode === 200) {
    global.access_token = body.access_token;
    console.log("got token");
}
});

app.get('/auth/login', (req, res) => {

    var scope = "streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state"
    var state = generateRandomString(16);

    var auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: spotify_redirect_uri,
        state: state
    })

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})

app.get('/auth/callback', (req, res) => {
    var code = req.query.code;

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: spotify_redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            access_token = body.access_token;
            // res.redirect(website_redirect_uri)
        }
        else {
            console.log("Debug");
            console.log("error:", error)
            console.log("res:", response.statusCode)
        }
    });

})

app.get('/auth/getPlaylists', (req, res) => {
    let name = req.query.name

    let encodedName = encodeURIComponent(name);
    let spotifyURL = `https://api.spotify.com/v1/search?q=${encodedName}&type=playlist&limit=50&offset=0`;


    fetch(spotifyURL, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${global.access_token}`, // Authorization header
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
                // Bad Token
                // TODO: Refresh token
            }
            res.status(500).json({ error: error.message });
        });
})

// app.get('/auth/token', (req, res) => {
//     res.json({ access_token: access_token })
// })

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})