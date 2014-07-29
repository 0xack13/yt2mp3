var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var exec, request, spawn, _ref;

var app = express();
request = require('request');
_ref = require('child_process'), spawn = _ref.spawn, exec = _ref.exec;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.get('/:id', function(req, res) {
    var entry = req.params.id;
    return youtube_dl_url_child = exec("./youtube-dl --simulate --get-url http://www.youtube.com/watch?v=" + entry, function(err, stdout, stderr) {
          var ffmpeg_child, youtube_dl_url;

          youtube_dl_url = stdout.toString();

          if(youtube_dl_url !== ""){
              console.log ("url: " + youtube_dl_url);
              youtube_dl_url = youtube_dl_url.substring(0, youtube_dl_url.length - 1);
              res.contentType = 'audio/mpeg3';
              ffmpeg_child = spawn("ffmpeg", ['-i', 'pipe:0', '-acodec', 'libmp3lame', '-f', 'mp3', '-']);
              ffmpeg_child.stdout.pipe(res);

              return request({
                url: youtube_dl_url,
                headers: {
                  'Youtubedl-no-compression': 'True'
                }
              }).pipe(ffmpeg_child.stdin);
          }else{
            console.log ("error: " + stderr);
            return false;
          }
        });
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
}); 
