var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var session = require('express-session');
var $ = require('jquery');


var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');

var app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));



// session
var sess = {
  secret: 'keyboard cat',
  cookie: {
    maxAge: 6000000
  }
};
app.use(session(sess));


function restrict(req, res, next) {
  console.log(req.session.userId)
  if (req.session.userId) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}


app.get('/', restrict,
  function(req, res) {
    res.render('index');
  });

app.get('/create', restrict,
  function(req, res) {
    res.render('index');
  });

app.get('/links', restrict,
  function(req, res) {
    // Links.reset().query('where', 'user_id', '=', req.session.userId).fetch().then(function(links) {
    Links.reset().fetch().then(function(links) {
      res.send(200, links.models);
    });
  });



app.post('/links', restrict,
  function(req, res) {
    var uri = req.body.url;

    if (!util.isValidUrl(uri)) {
      console.log('Not a valid url: ', uri);
      return res.send(404);
    }

    new Link({
      url: uri
    }).fetch().then(function(found) {
      if (found) {
        res.send(200, found.attributes);
      } else {
        util.getUrlTitle(uri, function(err, title) {
          if (err) {
            console.log('Error reading URL heading: ', err);
            return res.send(404);
          }

          Links.create({
              url: uri,
              title: title,
              base_url: req.headers.origin,
              user_id: req.session.userId
            }.save())
            // link.save().then
            .then(function(newLink) {
              res.send(200, newLink);
            });
        });
      }
    });
  });

/************************************************************/
// Write your authentication routes here
/************************************************************/

app.get('/signUp', function(req, res) {
  res.render('signup');
});

app.post('/signUp', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  // var user = new User({})
  // user.save().then(function(newUser) {
  //   res.redirect('/login')
  // }) // catch...

  bcrypt.hash(password, null, null, function(err, hash) {
    if (err) {
      console.log(err);
    }
    var user = new User({
      username: username,
      password: hash
    });

    user.save().then(function() {
      return res.redirect('/login');
    });
  });
});

app.get('/logIn', function(req, res) {
  res.render('login');
});

app.post('/logIn', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  new User({
    username: username
  }).fetch().then(function(user) {
    if (!user) {
      console.log("User doesn't exist!");
      res.redirect('/login');
      // console.log("can you see me")
    } else {
      user.comparePassword(password, function(isTrue) {
        if (isTrue) {
          req.session.regenerate(function() {
            req.session.userId = user.id;
            res.redirect('/');
          });
          // req.session.save();
        } else {
          console.log("Password is wrong");
          res.redirect('/login');
        }
      });
    }
  });
  // new User.fetch()
  // user.comparePassword (then)
  // bcrypt.hash(this.get('password', null, null, function(err, hash) {
  //   ...
  //   this.set('password', hash)
  // }))
  // if same
  // req.session.generate(
  // user ID)
  // redirect /
  // else redirect login
});

app.get('/logOut', restrict,function(req, res) {
  req.session.destroy(function() {
    console.log("Logged out successfully!");
    res.redirect('/login');

  });
});
/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res) {
  console.log(req.params);
  new Link({
    code: req.params[0]
  }).fetch().then(function(link) {
    if (!link) {
      res.status(404).send("Not found")
      // res.redirect('/');
    } else {
      var click = new Click({
        link_id: link.get('id')
      });

      click.save().then(function() {
        link.set('visits', link.get('visits') + 1);
        link.save().then(function() {
          return res.redirect(link.get('url'));
        });
      });
    }
  });
});

console.log('Shortly is listening on 4568');
app.listen(4568);
