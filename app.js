
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , auth = require('./routes/auth')
  , cookie = require('cookie')
  , connect = require('connect')

  , game = require('./routes/game')
  , http = require('http')
  , path = require('path')
  , port = 3000

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var sessionStore = new express.session.MemoryStore;

// all environments
app.set('port', process.env.PORT || port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret : "DaFack1ngS3cr3t!", store : sessionStore}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function checkAuth(req, res, next) {
    if(req.session != undefined && !req.session.user_id) {
        res.redirect('/login');
    } else {
        next();
    }
}

app.get('/', routes.index);
app.get('/game', checkAuth, game.game);
app.get('/generateTile', checkAuth, game.generateTile);
app.get('/generateGrowings', checkAuth, game.generateGrowings);
app.get('/login', auth.login);
app.post('/login', auth.logUser);
app.get('/logout', auth.logout);
app.get('/signUp', auth.signUp);
app.post('/signUp', auth.register);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//Here, magic, don't touch.
setInterval(function() {
    console.log('SetInterval working !');

    var Tile = require('./models/Tile.Model.js').Tile,
        Growing = require('./models/Growing.Model.js').Growing;

    Tile.find(function(error, tiles) {
        for(var tile in tiles) {
            var grow = null;
            var maturity = 0;
            var time = 0;

            if(tiles[tile].humidity > 0 && tiles[tile].fertility > 0) {

                tiles[tile].humidity -= 2;
                tiles[tile].fertility -= 2;

                tiles[tile].health = (tiles[tile].humidity + tiles[tile].fertility) / 2;
            }

            if(tiles[tile].growing != null) {

                var grow_type = null;

                if(tiles[tile].growing.indexOf('Tomatoes') !== -1) {
                    grow_type = 'Tomatoes';
                } else if(tiles[tile].growing.indexOf('Corn') !== -1) {
                    grow_type = 'Corn';
                } else if(tiles[tile].growing.indexOf('Wheat') !== -1) {
                    grow_type = 'Wheat';
                }

                Growing.findOne({ 'type' : grow_type }, function(error, growing) {
                    if(error) console.log(error);
                    else {
                        // On update les differents champs
                        time = tiles[tile].time + 10;

                        if((growing.grow_rate + growing.decay_time) < time ) {
                            grow = null;
                            time = 0;
                            maturity = 0;
                        }

                        console.log(tiles[tile].maturity);

                        if(tiles[tile].maturity < 100) {
                            console.log(tiles[tile].maturity + 'check !');
                            maturity = Math.round(((100 * time) / growing.grow_rate) * 100) / 100;
                        }

                        if(tiles[tile].growing != null) {
                            if(tiles[tile].growing.indexOf('Tomatoes') !== -1) {
                                if(maturity >= 0 && maturity < 20) {
                                    grow = 'Tomatoes_Level1';
                                } else if(maturity >= 20 && maturity < 40) {
                                    grow = 'Tomatoes_Level2';
                                } else if(maturity >= 40 && maturity < 60) {
                                    grow = 'Tomatoes_Level3';
                                } else if(maturity >= 60 && maturity < 80) {
                                    grow = 'Tomatoes_Level4';
                                } else if(maturity >= 80 && maturity <= 100) {
                                    grow = 'Tomatoes';
                                }
                            } else if(tiles[tile].growing.indexOf('Corn') !== -1) {
                                if(maturity >= 0 && maturity < 20) {
                                    grow = 'Corn_Level1';
                                } else if(maturity >= 20 && maturity < 40) {
                                    grow = 'Corn_Level2';
                                } else if(maturity >= 40 && maturity < 60) {
                                    grow = 'Corn_Level3';
                                } else if(maturity >= 60 && maturity < 80) {
                                    grow = 'Corn_Level4';
                                } else if(maturity >= 80 && maturity <= 100) {
                                    grow = 'Corn';
                                }
                            } else if(tiles[tile].growing.indexOf('Wheat') !== -1) {
                                if(maturity >= 0 && tiles[tile].maturity < 20) {
                                    grow = 'Wheat_Level1';
                                } else if(maturity >= 20 && maturity < 40) {
                                    grow = 'Wheat_Level1';
                                } else if(maturity >= 40 && maturity < 60) {
                                    grow = 'Wheat_Level2';
                                } else if(maturity >= 60 && maturity < 80) {
                                    grow = 'Wheat_Level3';
                                } else if(maturity >= 80 && maturity <= 100) {
                                    grow = 'Wheat';
                                }
                            }

                            console.log(grow);
                        }
                    }
                });
            }

            console.log(grow + 'again');

            tiles[tile].growing = grow;
            tiles[tile].maturity = maturity;
            tiles[tile].time = time;
            tiles[tile].save();

            io.sockets.emit('refreshTile', tiles[tile]);
        }
    });
}, 10000);

io.set('authorization', function(handshakeData, accept) {
    if(handshakeData.headers.cookie) {
        handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);

        handshakeData.sessionId = connect.utils.parseSignedCookie(handshakeData.cookie['connect.sid'], "DaFack1ngS3cr3t!")

        if(handshakeData.cookie['express.sid'] == handshakeData.sessionId) {
            return accept('Cookie is invalid', false);
        }

        sessionStore.get(handshakeData.sessionId, function(err, session) {
            if(err) {
                return accept('Error in session store', false);
            }
            else if(!session) {
                return accept('Session not found.', false);
            }

            handshakeData.session = session;

            return accept(null, true);
        });
    }
});

io.sockets.on('connection', function(socket) {

    var hs = socket.handshake;

    socket.emit('getUserId', hs.session.user_id);

    var Tile = require('./models/Tile.Model.js').Tile,
        User = require('./models/User.Model.js').User;

    Tile.find(function(error,tiles) {
        if(error) { console.log(error); }
        else {
            socket.emit('getTiles', tiles);
        }
    });

    socket.on('getTile', function(position) {
        var query = Tile.findOne({ "position" : position }, function(error, tile) {
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

    socket.on('buildOnTile', function(data) {
        Tile.findById(data.tile._id, function(error, tile) {
            if(error) { console.log(error); }
            else {
                console.log(tile);
                console.log(data);
                if(data.type == 'Building')
                    tile.building = data.build;
                if(data.type == 'Growing')
                    tile.growing = data.build;
                tile.save();

                socket.emit('returnBuildOnTile', 'success');
            }
        })
    });

    socket.on('calculateUserLevel', function(data) {
        Tile.find({ "status" : data }).count(function(error, user_level) {
            if(error) { console.log(error); }
            else {
                User.findOne({ "_id" : hs.session.user_id }, function(error, user) {
                    user.level = user_level;
                    user.save();
                    socket.emit('returnUserLevel', user_level);
                });
            }
        })
    });

    socket.on('getUserLevel', function(data) {
        User.findOne({ "_id" : data }, function(error, user) {
            if(error) console.log(error);
            else {
                socket.emit('returnUserLevel', user.level);
            }
        });
    });
})