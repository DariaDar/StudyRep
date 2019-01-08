var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var parseForm = bodyParser.urlencoded({ extended: false });


var User = require('../modules/user.js');
var Pattern = require('../modules/pattern.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/profile/:id', function (req, res, next) {
    var id = req.params.id;
    User.findById(id, function (err, user) {
        if(err) return next(err);
        if(!user) return res.send(404);
        if(user) {
            Pattern.find({author: user._id}, function (err, patterns) {
                if(err) return next(err);
                if(!patterns) res.send(404);
                else {
                    var cnt = (patterns.length % 3 === 0) ? Math.floor(patterns.length / 3) : Math.floor(patterns.length / 3) + 1;
                    res.render('profile', {user: req.session.user, patterns: patterns, patternCnt: cnt});
                }
            })
        }
    })

});


module.exports = router;
