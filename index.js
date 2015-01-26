var fs = require('fs');
var http = require('http');
var path = require('path');
var express = require('express');
var less = require('less-middleware');
var markdown = require('./markdown');

// Cache markdown pages in memory
var pages = {};

var app = express();
app.set('view engine', 'jade');

// Mount static file and less compiler middleware
var publicDir = path.join(__dirname, 'public');
app.use(less(publicDir));
app.use(express.static(publicDir));

// Handle named pages
app.get('/', function(request, response) {
    response.render('index', {
        title: 'Kevin Whinnery'
    });
});

app.get('/about', function(request, response) {
    response.render('about', {
        title: 'Character Record: Kevin Whinnery'
    });
});

// catch-all handler for simple markdown posts
app.get('/:page', function(request, response, next) {
    var pageRequested = request.params.page;
    var content = pages[pageRequested] || markdown(request.params.page);
    if (!content) {
        return next();
    } else if (!pages[pageRequested]) {
        pages[pageRequested] = content;
    }

    response.render('markdown', {
        title: content.title,
        pageContent: content.html
    });
});

// 404
app.use(function(request, response, next) {
    response.status(404)
        .sendFile(path.join(__dirname, 'public', '404.html'));
});

// Create and run HTTP server
var server = http.createServer(app);
var port = process.env.PORT||3000;
server.listen(port, function() {
    console.log('Express server running on *:'+port);
});