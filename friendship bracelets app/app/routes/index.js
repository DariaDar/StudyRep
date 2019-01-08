var express = require('express');
var router = express.Router();

var busboyBodyParser = require('busboy-body-parser');
var bodyParser = require('body-parser');
var parseForm = bodyParser.urlencoded({extended: false});
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var crypto = require('crypto');

var db = mongoose.connect('mongodb://localhost/patternsDB');

var User = require('../modules/user.js');
var Pattern = require('../modules/pattern.js');


/* GET home page. */
router.get('/', function(req, res, next) {
    Pattern.find({}, function (err, patterns) {
        if(err) return next(err);
        if(patterns) {
            var cnt = (patterns.length % 3 === 0) ? Math.floor(patterns.length / 3) : Math.floor(patterns.length / 3) + 1;
            res.render('index', { title: 'Express', user: req.session.user, patterns: patterns, patternCnt: cnt});
        }
    })

});


router.post('/login', function (req, res, next) {
   var username = req.body.username;
   var password = req.body.password;

   User.findOne({username: username}, function (err, user) {
       if(user) {
           if(user.checkPassword(password)) {
               req.session.user = user;
               res.redirect('/users/profile/' + user._id);
           }
           else if(err) {
               return next(err);
           }
           else {
               return res.sendStatus(404);
           }
       }
       else {
           return res.sendStatus(404);
       }
   })
});

router.get('/registration', function (req, res, next) {
    res.render('registration');
});

router.post('/registration', function (req, res, next) {
    let username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({username: username}, function (err, user) {
        if(user) {
            if (user.checkUsername(username)) {
                return res.send(403);
            }
        }
    });
     var user = new User({username: username, password: password, email: email});
     user.save(function (err) {
         if(err) return next(err);
         else {
             req.session.user = user;
             return res.redirect('/users/profile/' + user._id);
         }
     })
});

router.get('/logout', function (req, res, next) {
    if(req.session.user) {
        delete req.session.user;
        res.redirect('/');
    }
});

router.get('/create', function (req, res, next) {
    res.render('create', {user: req.session.user});
});

router.post('/createPattern', function (req, res, next) {
    console.log("SERVER SURPRISE");
    var image = req.body.image;
    var name = req.body.name;
    var user = req.session.user;



    if(!name)
        name = "Схема";

    var pattern = new Pattern({
        title: name,
        image: image,
        author: user._id
    });

    pattern.save(function (err) {
        if(err) res.send("Введите имя схемы.");
    });

    User.findOne({_id: user._id}, function (err, user) {
        if(user) {
            user.patterns.push(pattern);
            user.save(function (err) {
                if(err) return res.send(404);
            })
        }
        else if(err) {
            console.log("DIDN'T FIND");
            return next(err);
        }
    });

    res.send("Успешно сохранено :)");
});


router.get('/pattern/:id', function (req, res, next) {
    var id = req.params.id;
    Pattern.findOne({_id: id}).populate('author').exec(function(err, pattern) {
        if(err) return next(err);
        if(pattern) {
            User.findOne({_id: pattern.author}, function (err, author) {
                if(err) return next(err);
                if(author) {
                    res.render('pattern', {user: req.session.user, pattern: pattern, author: author});
                }
            })

        }
    })
});

router.post('/deletePattern', function (req, res, next) {
    var pId = req.body.patternId;
    var aId = req.body.authorId;

    Pattern.find({_id: pId}).remove().exec(function (err, pattern) {
        if(err) return next(err);

        // User.find({_id: aId}, function (err, user) {
        //     if(err) return next(err);
        //     if(user) {
        //         user.patterns.pull(pattern);
        //         user.save(function (err) {
        //             if(err) return res.send("404");
        //         });
        //     }
        // });
    });

    User.update({_id: aId}, {$pull : {patterns: pId}}).then(err => {
        res.send(500);
    });

    res.redirect('/users/profile/' + aId);

});

router.post('/addcomment/:id', function (req, res, next) {
    var user = req.session.user;
    var id = req.params.id;
    var comment = req.body.comment;
    Pattern.findByIdAndUpdate(id, {
        $push: {
            'comments':{
                body: comment,
                author: user.username
            }
        }
    }, function (err, pattern) {
        if (err) return next(err);
        if (pattern) {
            res.redirect('/pattern/' + id);
        } else return res.send(500);
    })

});

router.post('/deletecomment/:pid/:cid', function (req, res, next) {
    var idPattern = req.params.pid;
    var comment = req.params.cid;

    Pattern.findByIdAndUpdate(idPattern, {
        $pull: {
            comments: {
                _id: comment
            }
        }
    }, function (err, pattern) {
        if (err) return next(err);
        if (!pattern) return res.send(404);
        else {
            res.redirect('/pattern/' + idPattern);
        }
    })
})


module.exports = router;
