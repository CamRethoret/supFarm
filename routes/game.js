
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
        seed_price : 100,
        consumption : 0.5
    });

    var corn = new Growing({
        "type" : "Corn",
        "grow_rate" : 600,
        "decay_time" : 240,
        "productivity" : 5,
        "storability" : 4200,
        seed_price : 300,
        consumption : 1
    });

    var wheat = new Growing({
        "type" : "Wheat",
        "grow_rate" : 1000,
        "decay_time" : 500,
        "productivity" : 10,
        "storability" : 5000,
        seed_price : 777,
        consumption : 1.5
    });

    tomatoes.save(function(error, tomatoes) {
        if(error) { console.log(error); }
        else { console.log("Tomatoes added !"); }
    })

    corn.save(function(error, corn) {
        if(error) { console.log(error); }
        else { console.log("Corn added !"); }
    })

    wheat.save(function(error, wheat) {
        if(error) { console.log(error); }
        else { console.log("Wheat added !"); }
    })

    res.redirect('/game');
};

exports.generateWeapons = function(req,res) {

    var Weapon = require('../models/Weapon.Model.js').Weapon;

    var fork = new Weapon({
        "name":     'Fork',
        "power":    '10',
        "hit_ratio" : '40',
        "hits_per_seconds" : '1',
        "price" : '10000'
    });

    var baseball_bat = new Weapon({
        "name":     'Baseball Bat',
        "power":    '20',
        "hit_ratio" : '50',
        "hits_per_seconds" : '2',
        "price" : '30000'
    });

    var chainsaw = new Weapon({
        "name":     'Chainsaw',
        "power":    '40',
        "hit_ratio" : '70',
        "hits_per_seconds" : '3',
        "price" : '50000'
    });

    var ak = new Weapon({
        "name":     'AK-47',
        "power":    '60',
        "hit_ratio" : '85',
        "hits_per_seconds" : '4',
        "price" : '75000'
    });

    fork.save(function(error, fork) {
        if(error) { console.log(error); }
        else { console.log("Fork added !"); }
    })

    baseball_bat.save(function(error, baseball_bat) {
        if(error) { console.log(error); }
        else { console.log("Baseball Bat added !"); }
    })

    chainsaw.save(function(error, chainsaw) {
        if(error) { console.log(error); }
        else { console.log("Chainsaw added !"); }
    })

    ak.save(function(error, ak) {
        if(error) { console.log(error); }
        else { console.log("AK-47 added !"); }
    })

    res.redirect('/game');
};