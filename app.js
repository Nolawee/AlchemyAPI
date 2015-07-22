var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var db = require('monk')('locallhost/nodeblog');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var AlchemyAPI = require('./node_modules/alchemy-api/');
var alchemyapi = new AlchemyAPI();

var demo_text = 'I want to make an counry named Mark Wahlberg';
var demo_url  = '';
var demo_html = '';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Express Validator
app.use(expressValidator({
    errorFormater: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

// Connect-flash
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Make our db accessible to our router
app.use(function (req,res,next){
    req.db = db
    next();
});

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

function entities(req, res, output) {
    alchemyapi.entities('text', demo_text,{ 'sentiment':1 }, function(response) {
        output['entities'] = { text:demo_text, response.JSON.stringify(response,null,4), results:response['keywords'] };
        concepts(req, res, output);
  });
}

function keywords(req, res, output) {
    alchemyapi.keywords('text', demo_text, { 'sentiment':1 }, function(response) {
        output['keywords'] = { text:demo_text, response.JSON.stringify(response,null,4), results:response['concepts'] };
        sentiment(req, res, output);
  });
}

function concepts(req, res, output) {
    alchemyapi.concepts('text', demo_text, { 'showSourceText':1 }, function(response){
        output['concepts'] = { text:demo_text, response.JSON.stringify(response,null,4), results:response['docSentiment'] }
        text(req, res, output);
    });
}

function text(req, res, output) {
    alchemyapi.text('url', demo_url, {}, function(response) {
        output['text'] = { url:demo_url, response.JSON.stringify(response,null,4), results:response };
        language(req, res, output);
    });
}

function author(req, res, output) {
    alchemyapi.author('url', demo_url, {}, function(response) {
        output['author'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
        language(req, res, output);
    });
}

function language(req, res, output) {
    alchemyapi.language('text', demo_text, {}, function(response) {
        output['language'] = { text:demo_text, response:JSON.stringify(response,null,4), results:response };
        title(req, res, output);
    });
}


function title(req, res, output) {
    alchemyapi.title('url', demo_url, {}, function(response) {
        output['title'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
        relations(req, res, output);
    });
}


function relations(req, res, output) {
    alchemyapi.relations('text', demo_text, {}, function(response) {
        output['relations'] = { text:demo_text, response:JSON.stringify(response,null,4), results:response['relations'] };
        category(req, res, output);
    });
}


function category(req, res, output) {
    alchemyapi.category('text', demo_text, {}, function(response) {
        output['category'] = { text:demo_text, response:JSON.stringify(response,null,4), results:response };
        feeds(req, res, output);
    });
}


function feeds(req, res, output) {
    alchemyapi.feeds('url', demo_url, {}, function(response) {
        output['feeds'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response['feeds'] };
        microformats(req, res, output);
    });
}


function microformats(req, res, output) {
    alchemyapi.microformats('url', demo_url, {}, function(response) {
        output['microformats'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response['microformats'] };
        taxonomy(req, res, output);
    });
}


function taxonomy(req, res, output) {
    alchemyapi.taxonomy('url', demo_url, {}, function(response) {
        output['taxonomy'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
        combined(req, res, output);
    });
}

function combined(req, res, output) {
    alchemyapi.combined('url', demo_url, {}, function(response) {
        output['combined'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
        image(req, res, output);
    });
}

function image(req, res, output) {
    alchemyapi.image('url', demo_url, {}, function(response) {
        output['image'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
        image_keywords(req, res, output);
    });
}

function image_keywords(req, res, output) {
    alchemyapi.image_keywords('url', demo_url, {}, function(response) {
        output['image_keywords'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
        res.render('example',output);
    });
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

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
