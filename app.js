
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

var Tile = require('./models/Tile.Model.js').Tile,
    User = require('./models/User.Model.js').User,
    Growing = require('./models/Growing.Model.js').Growing;

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

    Tile.find(function(error, tiles) {
        tiles.forEach(function(tile) {

            var grow = null;
            var grow_type = null;

            if(tile.growing != null) {
                if(tile.growing.indexOf('Tomatoes') !== -1) {
                    grow_type = 'Tomatoes';
                } else if(tile.growing.indexOf('Corn') !== -1) {
                    grow_type = 'Corn';
                } else if(tile.growing.indexOf('Wheat') !== -1) {
                    grow_type = 'Wheat';
                }
            }

                if(tile.humidity > 0 && tile.fertility > 0) {

                    tile.humidity -= 0.5;
                    tile.fertility -= 0.5;

                    tile.health = (tile.humidity + tile.fertility) / 2;
                }

                Growing.findOne({ 'type' : grow_type }, function(error, growing) {
                    if(error) console.log(error);
                    else if(growing != null) {
                        grow = growing;

                        // On update les differents champs
                        tile.time += 10;

                        if((grow.grow_rate + grow.decay_time) < tile.time ) {
                            tile.growing = null;
                            tile.time = 0;
                            tile.maturity = 0;
                        } else if(tile.growing != null) {

                            if(tile.maturity < 100) {
                                var maturity = Math.round(((100 * tile.time) / grow.grow_rate) * 100) / 100;

                                if(maturity < 100) tile.maturity = maturity;
                                else tile.maturity = 100;
                            }

                            if(tile.growing.indexOf('Tomatoes') !== -1) {
                                if(tile.maturity >= 0 && tile.maturity < 20) {
                                    tile.growing = 'Tomatoes_Level1';
                                } else if(tile.maturity >= 20 && tile.maturity < 40) {
                                    tile.growing = 'Tomatoes_Level2';
                                } else if(tile.maturity >= 40 && tile.maturity < 60) {
                                    tile.growing = 'Tomatoes_Level3';
                                } else if(tile.maturity >= 60 && tile.maturity < 80) {
                                    tile.growing = 'Tomatoes_Level4';
                                } else if(tile.maturity >= 80 && tile.maturity <= 100) {
                                    tile.growing = 'Tomatoes';
                                }
                            } else if(tile.growing.indexOf('Corn') !== -1) {
                                if(tile.maturity >= 0 && tile.maturity < 20) {
                                    tile.growing = 'Corn_Level1';
                                } else if(tile.maturity >= 20 && tile.maturity < 40) {
                                    tile.growing = 'Corn_Level2';
                                } else if(tile.maturity >= 40 && tile.maturity < 60) {
                                    tile.growing = 'Corn_Level3';
                                } else if(tile.maturity >= 60 && tile.maturity < 80) {
                                    tile.growing = 'Corn_Level4';
                                } else if(tile.maturity >= 80 && tile.maturity <= 100) {
                                    tile.growing = 'Corn';
                                }
                            } else if(tile.growing.indexOf('Wheat') !== -1) {
                                if(tile.maturity >= 0 && tile.maturity < 20) {
                                    tile.growing = 'Wheat_Level1';
                                } else if(tile.maturity >= 20 && tile.maturity < 40) {
                                    tile.growing = 'Wheat_Level1';
                                } else if(tile.maturity >= 40 && tile.maturity < 60) {
                                    tile.growing = 'Wheat_Level2';
                                } else if(tile.maturity >= 60 && tile.maturity < 80) {
                                    tile.growing = 'Wheat_Level3';
                                } else if(tile.maturity >= 80 && tile.maturity <= 100) {
                                    tile.growing = 'Wheat';
                                }
                            }
                        }
                    }
                    tile.save(function(err){
                        if(err) console.error(err);
                        else {
                            console.log(tile.growing);
                            io.sockets.emit('refreshTile', tile);
                        }
                    });
                });
        });
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

    Tile.find(function(error,tiles) {
        if(error) { console.log(error); }
        else {
            socket.emit('getTiles', tiles);
        }
    });

    socket.on('getTile', function(position) {
        Tile.findOne({ "position" : position }, function(error, tile) {
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