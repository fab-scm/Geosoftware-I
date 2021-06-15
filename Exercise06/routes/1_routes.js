// express
const express = require('express');
const router = express.Router();

// querystring
const querystring = require('querystring');

// assert
const assert = require('assert')

// multer
const multer = require ('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

// mongoDB
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017' // connection URL
const client = new MongoClient(url) // mongodb client
const dbName = 'Exercise06DB' // database name
const collectionName = 'routes' // collection name

/* GET route listing. */
router.get('/', function(req, res, next) {

  // connect to the mongodb database and retrieve all routes
  client.connect(function(err)
  {
    assert.equal(null, err);

    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // find some documents
    collection.find({}).toArray(function(err, data)
    {
      assert.equal(err, null);
      console.log('Found the following records...');
      console.log(data);
      res.render('1_routes', {title: 'Available Routes:', routes: data});
    })
  })
});

router.get('/selectRoute', function(req, res) {
  const idObj = querystring.parse(req.url);
  //var id = urlParams.has('id');
  console.log(idObj);
  res.send('/');
})

module.exports = router;