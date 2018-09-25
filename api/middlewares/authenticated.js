'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_key';

exports.ensureAuth = function (request, response, next) {
    if (!request.headers.authorization) {
        return response.status(403).send({
            message: 'Authorization header not exists'
        });
    }

    var token = request.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return response.status(401).send({
                message: 'Token has expired'
            });
        }
    } catch (ex) {
        return response.status(404).send({
            message: 'Token not valid'
        });
    }

    request.user = payload;

    next();
};