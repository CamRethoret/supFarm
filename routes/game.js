
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