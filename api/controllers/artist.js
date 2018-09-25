'use strict'


var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination')
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getArtist(request, response) {
    var artistId = request.params.id;

    Artist.findById(artistId, (error, artist) => {
        if (error) {
            response.status(500).send({
                message: 'Request error'
            });
        } else {
            if (!artist) {
                response.status(404).send({
                    message: 'Artist not exists'
                });
            } else {
                return response.status(200).send({
                    artist
                });
            }
        }
    });

}

function getArtists(request, response) {
    var page = 1;
    var itemsPerPage = 3;

    if (request.params.page) {
        page = request.params.page;
    }

    Artist.find().sort('name').paginate(page, itemsPerPage, function (error, artists, total) {
        if (error) {
            response.status(500).send({
                message: 'Request error'
            });
        } else {
            if (!artists) {
                response.status(404).send({
                    message: 'Artists not found'
                });
            } else {
                return response.status(200).send({
                    totalItems: total,
                    artists: artists
                });
            }
        }
    });
}

function saveArtist(request, response) {
    var artist = new Artist;

    var params = request.body;

    artist.name =  params.name;
    artist.description =  params.description;
    artist.image = 'null';

    if (artist.name != null && artist.description != null) {
        // Save artist
        artist.save((error, artistStored) => {
            if (error) {
                response.status(500).send({
                    message: 'Error to save artist'
                });
            } else {
                if (!artistStored) {
                    response.status(404).send({
                        message: 'Object not found'
                    });
                } else {
                    response.status(200).send({
                        artist: artistStored
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

function updateArtist(request, response) {
    var artistId = request.params.id;
    var update = request.body;

    Artist.findByIdAndUpdate(artistId, update, (error, artistUpdated) => {
        if (error) {
            response.status(500).send({
                message: 'Error to update artist'
            });
        } else {
            if (!artistUpdated) {
                response.status(404).send({
                    message: 'This artist not exists'
                });
            } else {
                response.status(200).send({
                    artist: artistUpdated
                });
            }
        }
    });
}

function deleteArtist(request, response) {
    var artistId = request.params.id;

    Artist.findByIdAndRemove(artistId, (error, artistRemoved) => {
        if (error) {
            response.status(500).send({
                message: 'Error to delete artist'
            });
        } else {
            if (!artistRemoved) {
                response.status(404).send({
                    message: 'This artist not exists'
                });
            } else {
                Album.find({
                    artist: artistRemoved._id
                }).remove((error, albumRemoved) => {
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
                                            artist: artistRemoved
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}


function uploadImage(request, response) {
    var artistId = request.params.id;
    var fileName = 'Image not uploaded';

    if (request.files) {
        var filePath = request.files.image.path;
        var fileSplit = filePath.split('/');
        fileName = fileSplit[2];

        var extSplit = fileName.split('.');
        var fileExt = extSplit[1];

        if (fileExt == 'png' || fileExt == 'jpg' ||fileExt == 'gif') {
            Artist.findByIdAndUpdate(artistId, {
                image: fileName
            }, (error, artistUpdated) => {
                if (error) {
                    response.status(500).send({
                        message: 'Error to update artist'
                    });
                } else {
                    if (!artistUpdated) {
                        response.status(404).send({
                            message: 'Artist not exists'
                        });
                    } else {
                        response.status(200).send({
                            user: artistUpdated
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
    var pathFile = './uploads/artists/' + imageFile;

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
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};