// express
const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

// querystring
const querystring = require('query-string');

// assert
const assert = require('assert')

// multer
const multer = require ('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

// mongoDB
const mongodb = require('mongodb');
const { URLSearchParams } = require('url');
const { start } = require('repl');
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

router.post('/selectRoute', function(req, res) {
  const postObj = req.body;
  console.log(postObj.id);

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // find some documents
  var myfilter = {"_id": mongodb.ObjectId(postObj.id)};
  console.log(myfilter);
  
  collection.find(myfilter).toArray(function(err, data)
  {
    assert.equal(err, null);
    console.log(data[0]);
    var routeJSONString = JSON.stringify(data[0]);

    var filepath = path.resolve(__dirname, '../public/javascripts/routeDB.geojson');

    fs.writeFile(filepath, `var routeDB = ${routeJSONString}`, function(err) {
      if (err) throw err;
      console.log('Replaced');
    })

  });
  // console.log(route);
  /*{
    assert.equal(err, null);
    console.log('Found the following records...');
    console.log(data);
    //res.send(data[0]);
    //res.redirect('/');
  })*/
})

module.exports = router;