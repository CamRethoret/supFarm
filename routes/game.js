
/*
 * GET game page.
 */

exports.game = function(req, res){
    res.render('game', { title: 'Welcome to supFarm, the real farm simulator' });
};

exports.generateTile = function(req,res) {

    var Tile = require('../models/Tile.Model.js').Tile;


    for(var i = 0; i < 10; i++) {
        for(var j = 0; j < 10; j++) {
            var newTile = new Tile({
                "status" : 0,
                "position" : j+","+i,
                "humidity" : 100,
                "fertility" : 100,
                "time" : 0,
                "health" : 100,
                "maturity" : 0
            });

            newTile.save(function(error,tile) {
                if(error) { console.log(error); }
                else { console.log("Tile "+tile.position+" ajoutée :"); }
            })
        }
    }

    res.redirect('/game');
};

exports.generateGrowings = function(req,res) {

    var Growing = require('../models/Growing.Model.js').Growing;

    var tomatoes = new Growing({
        "type" : "Tomatoes",
        "grow_rate" : 300,
        "decay_time" : 120,
        "productivity" : 3,
        "storability" : 3600,
        seed_price : 100
    });

    var corn = new Growing({
        "type" : "Corn",
        "grow_rate" : 600,
        "decay_time" : 240,
        "productivity" : 5,
        "storability" : 4200,
        seed_price : 300
    });

    var wheat = new Growing({
        "type" : "Wheat",
        "grow_rate" : 1000,
        "decay_time" : 500,
        "productivity" : 10,
        "storability" : 5000,
        seed_price : 777
    });

    tomatoes.save(function(error, tomatoes) {
        if(error) { console.log(error); }
        else { console.log("Tomatoes added !"); }
    })

    corn.save(function(error, tomatoes) {
        if(error) { console.log(error); }
        else { console.log("Corn added !"); }
    })

    wheat.save(function(error, tomatoes) {
        if(error) { console.log(error); }
        else { console.log("Wheat added !"); }
    })

    res.redirect('/game');
};