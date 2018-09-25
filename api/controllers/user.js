'use strict'

var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var jwt = require('../services/jwt');

function test(request, response) {
    response.status(200).send({
        message: 'Hola mundo'
    });
}

function saveUser(request, response) {
    var user = new User;

    var params = request.body;

    user.firstname =  params.firstname;
    user.lastname =  params.lastname;
    user.email =  params.email;
    user.role =  'ROLE_USER';
    user.image = 'null';

    if (params.password) {
        // Encrypt password
        bcrypt.hash(params.password, null, null, function (error, hash) {
            user.password = hash;
            if (user.firstname != null && user.lastname != null && user.email != null) {
                // Save user
                user.save((error, userStored) => {
                    if (error) {
                        response.status(500).send({
                            message: 'Error to save user'
                        });
                    } else {
                        if (!userStored) {
                            response.status(404).send({
                                message: 'Object not found'
                            });
                        } else {
                            response.status(200).send({
                                user: userStored
                            });
                        }
                    }
                });
            } else {
                response.status(200).send({
                    message: 'Entry all fields'
                });
            }
        });
    } else {
        response.status(200).send({
           message: 'Entry password'
        });
    }
}

function loginUser(request, response) {
    var params = request.body;

    var email = params.email;
    var password = params.password;

    User.findOne({
        email: email.toLowerCase()
    }, (error, user) => {
        if (error) {
            response.status(500).send({
                message: 'Request error'
            });
        } else {
            if (!user) {
                response.status(404).send({
                    message: 'User not found'
                });
            } else {
                // Check password
                bcrypt.compare(password, user.password, function (error, check) {
                    if (check) {
                        // User data
                        if (params.gethash) {
                            // Return JWT token
                            response.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            response.status(200).send({
                                user
                            });
                        }
                    } else {
                        response.status(404).send({
                            message: 'El usuario no ha podido loguearse'
                        });
                    }
                });
            }
        }
    });
}

function updateUser(request, response) {
    var userId = request.params.id;
    var update = request.body;

    if (userId !== request.user.sub) {
        return response.status(500).send({
            message: 'Permission denied'
        });
    }
    
    User.findByIdAndUpdate(userId, update, (error, userUpdated) => {
        if (error) {
            response.status(500).send({
                message: 'Error to update user'
            });
        } else {
            if (!userUpdated) {
                response.status(404).send({
                    message: 'This user not exists'
                });
            } else {
                response.status(200).send({
                    user: userUpdated
                });
            }
        }
    });
}

function uploadImage(request, response) {
    var userId = request.params.id;
    var fileName = 'Image not uploaded';

    if (request.files) {
        var filePath = request.files.image.path;
        var fileSplit = filePath.split('/');
        fileName = fileSplit[2];

        var extSplit = fileName.split('.');
        var fileExt = extSplit[1];

        if (fileExt == 'png' || fileExt == 'jpg' ||fileExt == 'gif') {
            User.findByIdAndUpdate(userId, {
                image: fileName
            }, (error, userUpdated) => {
                if (error) {
                    response.status(500).send({
                        message: 'Error to update user'
                    });
                } else {
                    if (!userUpdated) {
                        response.status(404).send({
                            message: 'El usuario no ha actualizarse'
                        });
                    } else {
                        response.status(200).send({
                            image: fileName,
                            user: userUpdated
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
    var pathFile = './uploads/users/' + imageFile;

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
    test,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};