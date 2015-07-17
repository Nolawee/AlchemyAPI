var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var AlchemyAPI = require('./node_modules/alchemy-api/');
var alchemyapi = new AlchemyAPI();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

function example(req, res) {
    var output = {};

    //Start the analysis chain
    entities(req, res, output);
}

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


function concepts(req, res, output) {
    alchemyapi.concepts('text', demo_url1, {'showSourceText':1}, function(response){
        output['keywords'] = {text:demo_url1, response:JSON.stringify(response,null,4), results:response['concepts']};
        sentiment(req, res, output);
    });
}


/*
//CONCEPT TAGGING
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('<YOUR API KEY>');
alchemy.concepts('<URL|HTML|TEXT>', {}, function(err, response) {
  if (err) throw err;

  // See http://www.alchemyapi.com/api/concept/htmlc.html for format of returned object
  var concepts = response.concepts;

  // Do something with data
});

//RELATION EXTRACTION
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('<YOUR API KEY>');
alchemy.relations('<URL|HTML|TEXT>', {}, function(err, response) {
  if (err) throw err;

  // See http://www.alchemyapi.com/api/relation/htmlc.html for format of returned object
  var relations = response.relations;

  // Do something with data
});

//Keyword/Terminology Extraction
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('<YOUR API KEY>');
alchemy.keywords('<URL|HTML|TEXT>', {}, function(err, response) {
  if (err) throw err;

  // See http://www.alchemyapi.com/api/keyword/htmlc.html for format of returned object
  var keywords = response.keywords;

  // Do something with data
});

//Taxonomy
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('<YOUR API KEY>');
alchemy.taxonomies('<URL|HTML|TEXT>', {}, function(err, response) {
  if (err) throw err;

  // See http://www.alchemyapi.com/api/taxonomy_calls/html.html for format of returned object
  var taxonomies = response.taxonomies;

  // Do something with data
});

//RSS/ATOM Feed Discovery
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('<YOUR API KEY>');
alchemy.feeds('<URL|HTML>', {}, function(err, response) {
  if (err) throw err;

  // See http://www.alchemyapi.com/api/feed/htmlc.html for format of returned object
  var feeds = response.feeds;

  // Do something with data
});

//API Key Information
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('<YOUR API KEY>');
alchemy.apiKeyInfo({}, function(err, response) {
  if (err) throw err;

  // Do something with data
  console.log('Status:', response.status, 'Consumed:', response.consumedDailyTransactions, 'Limit:', response.dailyTransactionLimit);
  
});
*/

// production error handler
// no stacktraces leaked to user


app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
