var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var shippingRouter = require('./routes/shipping');

var packageRouter = require('./routes/package');

var storesRouter = require('./routes/stores');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/shipping', shippingRouter);
app.use('/package', packageRouter);
app.use('/stores', storesRouter);


module.exports = app;