'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_key';

exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        firstname: user.firstname,
        lasttname: user.lastname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, secret);
};