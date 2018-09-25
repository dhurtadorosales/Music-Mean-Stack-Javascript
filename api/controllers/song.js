'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination')
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getSong(request, response) {
    var songId = request.params.id;

    Song.findById(songId).populate({
        path: 'album'
    }).exec((error, song) => {
        if (error) {
            response.status(500).send({
                message: 'Request error'
            });
        } else {
            if (!song) {
                response.status(404).send({
                    message: 'Song not exists'
                });
            } else {
                return response.status(200).send({
                    song
                });
            }
        }
    });
}

function getSongs(request, response) {
    var albumId = request.params.album;
    var find = null;

    if (!albumId) {
        // All songs
        find = Song.find().sort('number');
    } else {
        // Song of this album
        find = Song.find({
            album: albumId
        }).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((error, songs) => {
        if (error) {
            response.status(500).send({
                message: 'Request error'
            });
        } else {
            if (!songs) {
                response.status(404).send({
                    message: 'Songs not found'
                });
            } else {
                return response.status(200).send({
                    songs
                });
            }
        }
    });
}

function saveSong(request, response) {
    var song = new Song;

    var params = request.body;

    song.number =  params.number;
    song.name =  params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    if (song.number != null && song.name != null && song.duration != null && song.album != null) {
        // Save song
        song.save((error, songStored) => {
            if (error) {
                response.status(500).send({
                    message: 'Error to save song'
                });
            } else {
                if (!songStored) {
                    response.status(404).send({
                        message: 'Object not found'
                    });
                } else {
                    response.status(200).send({
                        song: songStored
                    });
                }
            }
        });
    } else {
        response.status(200).send({
            message: 'Entry all fields'
        });
    }


}

function updateSong(request, response) {
    var songId = request.params.id;
    var update = request.body;

    Song.findByIdAndUpdate(songId, update, (error, songUpdated) => {
        if (error) {
            response.status(500).send({
                message: 'Error to update song'
            });
        } else {
            if (!songUpdated) {
                response.status(404).send({
                    message: 'This song not exists'
                });
            } else {
                response.status(200).send({
                    song: songUpdated
                });
            }
        }
    });
}

function deleteSong(request, response) {
    var songId = request.params.id;

    Song.findByIdAndRemove(songId, (error, songRemoved) => {
        if (error) {
            response.status(500).send({
                message: 'Error to delete song'
            });
        } else {
            if (!songRemoved) {
                response.status(404).send({
                    message: 'This song not exists'
                });
            } else {
                response.status(200).send({
                    album: songRemoved
                });
            }
        }
    });
}

function uploadFile(request, response) {
    var songId = request.params.id;
    var fileName = 'Image not uploaded';

    if (request.files) {
        var filePath = request.files.file.path;
        var fileSplit = filePath.split('/');
        fileName = fileSplit[2];

        var extSplit = fileName.split('.');
        var fileExt = extSplit[1];

        if (fileExt == 'mp3' || fileExt == 'ogg') {
            Song.findByIdAndUpdate(songId, {
                file: fileName
            }, (error, songUpdated) => {
                if (error) {
                    response.status(500).send({
                        message: 'Error to update song'
                    });
                } else {
                    if (!songUpdated) {
                        response.status(404).send({
                            message: 'Song not exists'
                        });
                    } else {
                        response.status(200).send({
                            user: songUpdated
                        });
                    }
                }
            });
        } else {
            response.status(200).send({
                message: 'Extension not valid'
            });
        }
    } else {
        response.status(200).send({
            message: 'File not uploaded'
        });
    }
}

function getSongFile(request, response) {
    var songFile = request.params.songFile;
    var pathFile = './uploads/songs/' + songFile;

    fs.exists(pathFile, function (exists) {
        if (exists) {
            response.sendFile(path.resolve(pathFile));
        } else {
            response.status(200).send({
                message: 'File not exists'
            });
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};