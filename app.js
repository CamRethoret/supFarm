
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
    Growing = require('./models/Growing.Model.js').Growing,
    Weapon = require('./models/Weapon.Model.js').Weapon,
    Item = require('./models/Item.Model.js').Item,
    GraceTime = require('./models/GraceTime.Model.js').GraceTime;

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
app.get('/generateWeapons', checkAuth, game.generateWeapons);
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

    GraceTime.find(function(error, graceTimes) {
        if(error) console.error(error);
        else {
            graceTimes.forEach(function(graceTime) {
                graceTime.time -= 10;

                if(graceTime.time == 0) {

                } else {
                    graceTime.save();
                }
            })
        }
    });

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

            Growing.findOne({ 'type' : grow_type }, function(error, growing) {
                if(error) console.log(error);
                else if(growing != null) {
                    grow = growing;

                    // On update les differents champs
                    tile.time += 10;

                    if(tile.humidity > 0 || tile.fertility > 0) {

                        var humidity = tile.humidity - (0.5 + grow.consumption);
                        var fertility = tile.fertility - (0.5 + grow.consumption);

                        if(humidity <= 0) tile.humidity = 0;
                        else tile.humidity = humidity;

                        if(fertility <= 0) tile.fertility = 0;
                        else tile.fertility = fertility;

                        tile.health = (tile.humidity + tile.fertility) / 2;
                    }

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
                            } else if(tile.maturity >= 20 && tile.maturity < 60) {
                                tile.growing = 'Tomatoes_Level2';
                            } else if(tile.maturity >= 60 && tile.maturity < 80) {
                                tile.growing = 'Tomatoes_Level3';
                            } else if(tile.maturity >= 80 && tile.maturity < 100) {
                                tile.growing = 'Tomatoes_Level4';
                            } else if(tile.maturity == 100) {
                                tile.growing = 'Tomatoes';
                            }
                        } else if(tile.growing.indexOf('Corn') !== -1) {
                            if(tile.maturity >= 0 && tile.maturity < 20) {
                                tile.growing = 'Corn_Level1';
                            } else if(tile.maturity >= 20 && tile.maturity < 60) {
                                tile.growing = 'Corn_Level2';
                            } else if(tile.maturity >= 60 && tile.maturity < 80) {
                                tile.growing = 'Corn_Level3';
                            } else if(tile.maturity >= 80 && tile.maturity < 100) {
                                tile.growing = 'Corn_Level4';
                            } else if(tile.maturity == 100) {
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
                                tile.growing = 'Wheat_Level2';
                            } else if(tile.maturity >= 80 && tile.maturity < 100) {
                                tile.growing = 'Wheat_Level3';
                            } else if(tile.maturity == 100) {
                                tile.growing = 'Wheat';
                            }
                        }
                    }
                } else {
                    if(tile.humidity > 0 || tile.fertility > 0) {

                        var humidity = tile.humidity - 0.5 ;
                        var fertility = tile.fertility + 0.5;

                        if(humidity <= 0) tile.humidity = 0;
                        else tile.humidity = humidity;

                        if(fertility <= 0) tile.fertility = 0;
                        else if(fertility >= 100) tile.fertility = 100;
                        else tile.fertility = fertility;

                        tile.health = (tile.humidity + tile.fertility) / 2;
                    }
                }
                tile.save(function(err){
                    if(err) console.error(err);
                    else {
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

var intervalFight = null;

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

                    if(user.health == user.health_max) {
                        user.health_max = user_level * 100;
                        user.health = user.health_max;
                    } else {
                        user.health_max = user_level * 100;
                    }

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

    socket.on('getUserMoney', function(data) {
        User.findOne({ "_id" : data }, function(error, user) {
            if(error) console.log(error);
            else {
                socket.emit('returnUserMoney', user.money);
            }
        });
    });

    socket.on('getUserHealth', function(data) {
        User.findOne({ "_id" : data }, function(error, user) {
            if(error) console.log(error);
            else {
                socket.emit('returnUserHealth', { 'current' : user.health, 'max' : user.health_max });
            }
        });
    });

    socket.on('waterDatTile', function(data) {
        Tile.findOne({ "_id" : data._id }, function(error, tile) {
            if(error) console.log(error)
            else {
                User.findOne({ "_id" : tile.status }, function(error, user){
                    if(error) console.log(error)
                    else {
                        if(user.money >= 50) {

                            var humidity = tile.humidity + 25;

                            if(humidity >= 100) tile.humidity = 100;
                            else tile.humidity = humidity;

                            tile.health = (tile.humidity + tile.fertility) / 2;
                            tile.save();

                            socket.emit('returnWaterTile', { 'type' : 'success', 'humidity' : tile.humidity, 'health' : tile.health });

                        }
                        else {
                            socket.emit('returnWaterTile', { 'type' : 'error', 'message' : "You don't have enough money to water this tile." });
                        }
                    }
                });
            }
        });
    });

    socket.on('fertilizeDatTile', function(data) {
        Tile.findOne({ "_id" : data._id }, function(error, tile) {
            if(error) console.log(error)
            else {
                User.findOne({ "_id" : tile.status }, function(error, user){
                    if(error) console.log(error)
                    else {
                        if(user.money >= 50) {

                            var fertility = tile.fertility + 25;

                            if(fertility >= 100) tile.fertility = 100;
                            else tile.fertility = fertility;

                            tile.health = (tile.humidity + tile.fertility) / 2;
                            tile.save();

                            socket.emit('returnFertilizeTile', { 'type' : 'success', 'fertility' : tile.fertility, 'health' : tile.health });

                        }
                        else {
                            socket.emit('returnFertilizeTile', { 'type' : 'error', 'message' : "You don't have enough money to fertilize this tile." });
                        }
                    }
                });
            }
        });
    });

    socket.on('harvestDatTile', function(data) {
        Tile.findOne({ "_id" : data._id }, function(error, tile) {
            if(error) console.log(error)
            else {
                if(tile.maturity == 100) {

                    User.findOne({ "_id" : tile.status }, function(error, user) {
                        if(error) console.log(error);
                        else {
                            if(user.status == 'Playing') {

                                Growing.findOne({ "type" : tile.growing }, function(error, growing) {
                                    if(error) console.log(error);
                                    else {

                                        var time = (growing.grow_rate + growing.decay_time) - tile.time;
                                        var ratio = Math.round((time / growing.decay_time) * 100) / 100;

                                        var realProductivity = Math.round(growing.productivity * ratio);

                                        var money = Math.round(realProductivity * (growing.seed_price * Math.round(((Math.random()*2)+1)*100)/100));


                                        tile.growing = null;
                                        tile.maturity = 0;
                                        tile.time = 0;
                                        tile.save();

                                        socket.emit('returnHarvestTile', { 'type' : 'success', 'productivity' : realProductivity, 'money' : money });
                                    }
                                });
                            } else {
                                socket.emit('returnHarvestTile', { 'type' : 'error', 'message' : "You can't harvest this tile in Rest Mode. Stay calm and keep waiting." });
                            }
                        }
                    });

                }
                else {
                    socket.emit('returnHarvestTile', { 'type' : 'error', 'message' : "You can't harvest this tile for the moment. Stay calm and keep waiting." });
                }
            }
        });
    });

    socket.on('sellGrow', function(data) {
        User.findOne({ "_id" : data.user_id }, function(error, user) {
            if(error) console.log(error);
            else {
                user.money += data.money;
                user.save();

                socket.emit('returnSellGrow', user.money);
                socket.emit('returnUserMoney', user.money);
            }
        });
    });

    socket.on('userIsResting', function(user_id) {
        User.findOne({ "_id" : user_id}, function(error, user) {
            if(error) console.error(error);
            else {

                var health = user.health + user.level;

                if(health < user.health_max) user.health = health;
                else user.health = user.health_max;

                user.status = 'Resting';

                user.save();

                socket.emit('returnUserIsResting', { 'health' : user.health, 'health_max' : user.health_max });
            }
        });
    });

    socket.on('userNotResting', function(user_id) {
        User.findOne({ "_id" : user_id}, function(error, user) {
            if(error) console.error(error);
            else {
                user.status = 'Playing';
                user.save();
            }
        });
    });

    socket.on('buyWeapon', function(data) {
        User.findOne({ "_id" : data.user_id}, function(error, user) {
            if(error) console.error(error);
            else {
                Weapon.findOne({ 'name' : data.weapon }, function(error, weapon) {
                    if(error) console.error(error);
                    else {
                        if(user.money > weapon.price) {

                            user.money -= weapon.price;
                            user.save();

                            var weapon = new Item({
                                "type" : weapon.name,
                                "user_id" : user._id
                            });

                            weapon.save();

                            socket.emit('returnBuyWeapon', { 'type' : 'success' })

                        } else {
                            socket.emit('returnBuyWeapon', { 'type' : 'error', 'message' : "You don't have enough money to buy this weapon." });
                        }
                    }
                });
            }
        });
    });

    socket.on('getWeaponForUser', function(user_id) {
        Item.find({ 'user_id' : user_id }, function(error, weapons) {
            if(error) console.log(error);
            else {
                socket.emit('returnGetWeaponForUser', weapons);
            }
        });
    });

    socket.on('beginAttack', function(data) {
        User.findOne({ '_id' : data.attacker}, function(error, attacker) {
            if(error) console.log(error);
            else {
                User.findOne({ '_id' : data.defender }, function(error, defender) {
                    if(error) console.log(error);
                    else {
                        Weapon.findOne({ 'name' : data.attacker_weapon }, function(error, attacker_weapon) {
                            if(error) console.log(error);
                            else {
                                Item.find({ 'user_id' : data.defender }, function(error, items) {
                                    if(error) console.log(error);
                                    else {

                                        Weapon.findOne({ 'name' : items[0].type }, function(error, defender_weapon) {

                                             intervalFight = setInterval(function() {
                                             var degAtt = 0;
                                             var degDef = 0;

                                             for(var i = 0; i < attacker_weapon.hits_per_seconds; i++) {
                                             var rand = Math.round((Math.random() * 100));
                                             if(rand <= attacker_weapon.hit_ratio) {
                                             degAtt += attacker_weapon.power;
                                             }
                                             }

                                             for(var i = 0; i < defender_weapon.hits_per_seconds; i++) {
                                             var rand = Math.round((Math.random() * 100));
                                             if(rand <= defender_weapon.hit_ratio) {
                                             degDef += defender_weapon.power;
                                             }
                                             }

                                             if((attacker.health - degDef) > 0) attacker.health -= degDef;
                                             else attacker.health = 0;
                                             if((defender.health - degAtt) > 0) defender.health -= degAtt;
                                             else defender.health = 0;

                                             if(attacker.health == 0) stopFight('defender', data.attacker, data.defender, attacker.level, defender.level);
                                             if(defender.health == 0) stopFight('attacker', data.attacker, data.defender, attacker.level, defender.level);

                                             attacker.save();
                                             defender.save();

                                             socket.emit('fightStats', { 'attacker' : (attacker.health * 100) / attacker.health_max, 'defender' : (defender.health * 100) / defender.health_max, 'attacker_weapon' : attacker_weapon.name, 'defender_weapon' : defender_weapon.name, 'attacker_damage' : degDef, 'defender_damage' : degAtt });

                                             }, 1000);
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    function stopFight(player, attacker, defender, attacker_level, defender_level) {
        clearInterval(intervalFight);
        intervalFight = null;

        if(player == 'attacker') {

            var waiting_time = (attacker_level / defender_level) * 300;

            var graceTime = new GraceTime({
                'winner_id' : attacker,
                'looser_id' : defender,
                'time' : waiting_time
            });

            graceTime.save();
        }

        socket.emit('stopFight', { 'message' : player, 'attacker' : attacker, 'defender' : defender });
    }

    socket.on('getUserStatus', function(user_id) {
        User.findOne({ '_id' : user_id}, function(error, user) {
            if(error) console.error(error);
            else {
                socket.emit('returnUserStatus', user.status);
            }
        });
    });

    socket.on('getGraceTime', function(data) {
        GraceTime.findOne({ 'winner_id' : data.attacker, 'looser_id' : data.defender}, function(error, graceTime) {
            if(error) console.log(error);
            else if(graceTime != null) {
                socket.emit('returnGraceTime', { 'status' : 'error', 'time' : graceTime.time });
            } else {
                socket.emit('returnGraceTime',{ 'status' : 'success'});
            }
        });
    });
})

