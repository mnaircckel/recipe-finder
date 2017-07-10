"use strict";
// Imports
const express = require('express');
const path = require('path');

// Initialize Express
const app = express();
app.use(express.static('assets'));

// Define routes
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
})

// Start sever
app.listen(3000, function() {
  console.log('Spotify manager listening on port 3000!');
})
