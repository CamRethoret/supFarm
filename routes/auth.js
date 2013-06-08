
/*
 * GET auth page.
 */

exports.login = function(req, res){
  res.render('login', {
      title: 'Login to supFarm',
      body:'OMG it work !'
  });
};

exports.logUser = function(req,res) {
    var User = require('../models/User.Model.js').User;

    User.findOne({ "email" : req.body.email, "password" : req.body.password }, function(error, user) {
        if(error) { console.log(error); }
        else {
            if(user != null) {
                req.session.user_id = user._id;
                res.redirect('/game');
            }
            else {
                res.send('Bad user/pass');
            }
        }
    });
};

exports.logout=function(req,res) {
    delete req.session.user_id;
    res.redirect('/');
}

exports.signUp=function(req, res){
  res.render('signUp',
      {
          title:'Create new account in supFarm',
          body:'OMG it work !'
      });
};


exports.register=function(req, res){
    console.log(req.body.first_name);
    console.log(req.body.last_name);
    console.log(req.body.email);
    console.log(req.body.age);
    console.log(req.body.password);
    console.log(req.body.difficulty);
    var User = require('../models/User.Model.js').User,
    newUser = new User({
        "first_name":   req.body.first_name,
        "last_name":    req.body.last_name,
        "email":        req.body.email,
        "age":          req.body.age,
        "password":     req.body.password,
        "type":         "player",
        "money":        0,
        "location":     "1,1",
        "level":        0,
        "difficulty":   req.body.difficulty,
        "health":       100
    })
    newUser.save(function(error, user){
        if(error){console.log(error);}
        else{
            console.log("User "+user.first_name+" ajouté !");}
    })
    res.redirect('/');
};