var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('1_routes');
});

/* GET mongoDB data */
router.get('/mongoDB', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{}, function(e, docs){
    res.render('mongoDB', {
      'userlist' : docs
    });
    console.log(docs)
  });
});

module.exports = router;
