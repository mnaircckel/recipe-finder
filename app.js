"use strict";
// Imports
const express = require('express');
const path = require('path');
const request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const utils = require('./utils');
const config = require('./config');

// Initialize Express
const app = express();
app.use(express.static('assets')).use(cookieParser());

// Define routes
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
})

// Spotify Routes
// See: https://developer.spotify.com/web-api/authorization-guide/
app.get('/login', function(req, res) {
  var state = utils.randomString(16);
  res.cookie(config.stateKey, state);

  // Request authorization via Spotify
  var scope = 'user-read-private playlist-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: config.clientId,
      scope: scope,
      redirect_uri: config.redirectUri,
      state: state
    }));
});

app.get('/callback', function(req, res) {
  // Get an authorization code to obtain access token
  var code = req.query.code || null;
  // Verify state
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[config.stateKey] : null;
  if (state === null || state !== storedState) {
    // Handle state error
    res.redirect('/');
  } else {
    // Get ready for authorization
    res.clearCookie(config.stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(config.clientId + ':' + config.clientSecret).toString('base64'))
      },
      json: true
    };
    // Once the state is verified and authorization code is obtained
    // Request should return refresh and access tokens
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        // Handle successful authorization
        var accessToken = body.access_token;
        var refreshToken = body.refresh_token;
        var expiresIn = body.expires_in;
        console.log('Access Token: ' + accessToken);
        console.log('Refresh Token: ' + refreshToken);
        console.log('Expires In: ' + expiresIn);
        res.redirect('/');
      } else {
        // Handle authorization error
        console.log(body);
        res.redirect('/');
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {
  // Request access token from refresh token
  var refreshToken = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(config.clientId + ':' + config.clientSecret).toString('base64'))
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    },
    json: true
  };
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      // Handle successful authorization
      // Request should return access token and maybe refresh token
      var accessToken = body.access_token;
      var refreshToken = body.refresh_token;
      var expiresIn = body.expires_in;
      console.log('Access Token: ' + accessToken);
      console.log('Refresh Token: ' + refreshToken);
      console.log('Expires In: ' + expiresIn);
      res.redirect('/');
    } else {
      // Handle authorization error
      console.log(body);
      res.redirect('/');
    }
  });
});

app.get('/spotify_request', function(req, res) {
  // Get access token from query
  var accessToken = req.query.access_token;
  // Use the access token to access the Spotify Web API
  var options = {
    url: 'https://api.spotify.com/v1/me',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    json: true
  };
  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      // Handle successful Web API call
      console.log(body);
      res.redirect('/');
    } else {
      // Handle Web API call error
      console.log(body);
      res.redirect('/');
    }
  });
});

// Start sever
app.listen(3000, function() {
  console.log('Spotify manager listening on port 3000!');
})
