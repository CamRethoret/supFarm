
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , auth = require('./routes/auth')

  , game = require('./routes/game')
  , http = require('http')
  , path = require('path')
  , port = 3000

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/game', game.game);
app.get('/generateTile', game.generateTile);
app.get('/login', auth.login);
app.get('/signUp', auth.signUp);
app.post('/signUp', auth.register);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function(socket) {
    var Tile = require('./models/Tile.Model.js').Tile,
        query = Tile.find();

    query.exec(function(error,tiles) {
        if(error) { console.log(error); }
        else {
            socket.emit('getTiles', tiles);
        }
    });

    socket.on('getTile', function(position) {
        var query = Tile.findOne({ "position" : position });

        query.exec(function(error, tile) {
            if(error) { console.log(error); }
            else {
                socket.emit('returnTile', tile);
            }
        });
    });

    socket.on('assignTileToPlayer', function(params) {

        Tile.findById(params.tile_id, function(error, tile) {
            if(error) { console.log(error); }
            else {
                tile.status = params.player;
                tile.save();
                socket.emit('tileCaptured');
            }
        });

    });
})