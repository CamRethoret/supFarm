
/*
 * GET game page.
 */

exports.game = function(req, res){
    res.render('game', { title: 'Welcome to supFarm, the real farm simulator' });
};