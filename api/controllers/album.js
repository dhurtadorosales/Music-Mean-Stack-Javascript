'use strict'

var fs = require('fs');
var path = require('path');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(request, response) {
    var albumId = request.params.id;

    //Populate for all data artist
    Album.findById(albumId).populate({
        path: 'artist'
    }).exec((error, album) => {
        if (error) {
            response.status(500).send({
                message: 'Request error'
            });
        } else {
            if (!album) {
                response.status(404).send({
                    message: 'Album not exists'
                });
            } else {
                return response.status(200).send({
                    album
                });
            }
        }
    });

}

function getAlbums(request, response) {
    var artistId = request.params.artist;
    var find = null;

    if (!artistId) {
        // All albums
        find = Album.find().sort('title');
    } else {
        // Album of this artist
        find = Album.find({
            artist: artistId
        }).sort('year');
    }

    find.populate({
        path: 'artist'
    }).exec((error, albums) => {
        if (error) {
            response.status(500).send({
                message: 'Request error'
            });
        } else {
            if (!albums) {
                response.status(404).send({
                    message: 'Albums not found'
                });
            } else {
                return response.status(200).send({
                    albums
                });
            }
        }
    });
}

function saveAlbum(request, response) {
    var album = new Album;

    var params = request.body;

    album.title =  params.title;
    album.description =  params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    if (album.title != null && album.description != null && album.year != null && album.artist != null) {
        // Save album
        album.save((error, albumStored) => {
            if (error) {
                response.status(500).send({
                    message: 'Error to save album'
                });
            } else {
                if (!albumStored) {
                    response.status(404).send({
                        message: 'Object not found'
                    });
                } else {
                    response.status(200).send({
                        album: albumStored
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

function updateAlbum(request, response) {
    var albumId = request.params.id;
    var update = request.body;

    Album.findByIdAndUpdate(albumId, update, (error, albumUpdated) => {
        if (error) {
            response.status(500).send({
                message: 'Error to update album'
            });
        } else {
            if (!albumUpdated) {
                response.status(404).send({
                    message: 'This album not exists'
                });
            } else {
                response.status(200).send({
                    user: albumUpdated
                });
            }
        }
    });
}

function deleteAlbum(request, response) {
    var albumId = request.params.id;

    Album.findByIdAndRemove(albumId, (error, albumRemoved) => {
        if (error) {
            response.status(500).send({
                message: 'Error to delete album'
            });
        } else {
            if (!albumRemoved) {
                response.status(404).send({
                    message: 'This album not exists'
                });
            } else {
                Song.find({
                    album: albumRemoved._id
                }).remove((error, songRemoved) => {
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
                                album: albumRemoved
                            });
                        }
                    }
                });
            }
        }
    });
}


function uploadImage(request, response) {
    var albumId = request.params.id;
    var fileName = 'Image not uploaded';

    if (request.files) {
        var filePath = request.files.image.path;
        var fileSplit = filePath.split('/');
        fileName = fileSplit[2];

        var extSplit = fileName.split('.');
        var fileExt = extSplit[1];

        if (fileExt == 'png' || fileExt == 'jpg' ||fileExt == 'gif') {
            Album.findByIdAndUpdate(albumId, {
                image: fileName
            }, (error, albumUpdated) => {
                if (error) {
                    response.status(500).send({
                        message: 'Error to update album'
                    });
                } else {
                    if (!albumUpdated) {
                        response.status(404).send({
                            message: 'Albumu not exists'
                        });
                    } else {
                        response.status(200).send({
                            user: albumUpdated
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
            message: 'Image not uploaded'
        });
    }
}

function getImageFile(request, response) {
    var imageFile = request.params.imageFile;
    var pathFile = './uploads/albums/' + imageFile;

    fs.exists(pathFile, function (exists) {
        if (exists) {
            response.sendFile(path.resolve(pathFile));
        } else {
            response.status(200).send({
                message: 'Image not exists'
            });
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};