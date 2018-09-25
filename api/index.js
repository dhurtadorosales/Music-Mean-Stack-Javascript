'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/musicfy', { useNewUrlParser: true } , (error, response) => {
    if (error) {
        throw error;
    } else {
        console.log('Database connected');

        app.listen(port, function () {
           console.log('API Server listenning in http://localhost:' + port);
        });
    }
});