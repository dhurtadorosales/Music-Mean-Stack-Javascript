'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var mdAuth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var mdUpload = multipart({
    uploadDir: './uploads/songs'
});

var api = express.Router();

api.get('/song/:id', mdAuth.ensureAuth, SongController.getSong);
api.post('/song', mdAuth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', mdAuth.ensureAuth, SongController.getSongs);
api.put('/song/:id', mdAuth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', mdAuth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [mdAuth.ensureAuth, mdUpload], SongController.uploadFile);
api.get('/get-song-file/:songFile', SongController.getSongFile);

module.exports = api;