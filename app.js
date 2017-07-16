"use strict";
// Imports
const express = require('express');
const path = require('path');
const axios = require('axios');

// Initialize Express
const app = express();
app.use(express.static('assets'));

// Define routes
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
})

// Recipe search
app.get('/get_recipes', function(req, res) {
  console.log('Recieved /get_recipes request for ' + req.query.q);
  axios.get('https://api.edamam.com/search', {
      headers: {
        'Content-Encoding': 'gzip',
        'Vary': 'Accept-Encoding'
      },
      params: {
        q: req.query.q,
        from: 0,
        to: 6
      }
    })
    .then(function(response) {
      res.send(response.data);
    })
    .catch(function(error) {
      res.send(error);
    });
})

// Start sever
app.listen(3000, function() {
  console.log('Spotify manager listening on port 3000!');
})
