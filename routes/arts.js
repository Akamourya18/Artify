var express = require('express');
var router = express.Router();
var art = require('../models/arts');
var middleware = require('../middleware');

router.get('/', function (req, res) {
  art.find({}, function (err, allarts) {
    if (err) {
      console.log('Oops, error');
      console.log(err);
    } else {
      res.render('arts/index', { arts: allarts });
    }
  });
});
router.post('/', middleware.isLoggedIn, function (req, res) {
  var name = req.body.name;
  var aboutArtist = req.body.aboutArtist;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newart = {
    name: name,
    image: image,
    aboutArtist: aboutArtist,
    description: desc,
    author: author,
  };
  art.create(newart, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/arts');
    }
  });
});

router.get('/new', middleware.isLoggedIn, function (req, res) {
  res.render('arts/new');
});
router.get('/:id', function (req, res) {
  art
    .findById(req.params.id)
    .populate('comments')
    .exec(function (err, foundart) {
      if (err || !foundart) {
        req.flash('error', 'art not found!!');
        res.redirect('back');
      } else {
        res.render('arts/show', { art: foundart });
      }
    });
});

//Edit art route
router.get('/:id/edit', middleware.checkartOwnership, function (req, res) {
  art.findById(req.params.id, function (err, foundart) {
    res.render('arts/edit', { art: foundart });
  });
});

router.put('/:id', middleware.checkartOwnership, function (req, res) {
  art.findByIdAndUpdate(req.params.id, req.body.art, function (err, updateart) {
    if (err) {
      res.redirect('/arts');
    } else {
      res.redirect('/arts/' + req.params.id);
    }
  });
});

router.delete('/:id', middleware.checkartOwnership, function (req, res) {
  art.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect('/arts');
    } else {
      res.redirect('/arts');
    }
  });
});
module.exports = router;
