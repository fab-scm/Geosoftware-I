var express = require('express');
var router = express.Router()

// assert
const assert = require('assert')

// mongoDB
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017' // connection URL
const client = new MongoClient(url) // mongodb client
const dbName = 'ProjectDB' // database name
const collectionName = 'sights' // collection name

/**
 * GET sights for listing.
 * Connects to the mongoDB and finds all the routes stored in the used collection, renders the pug view
 * and sends information to the pug-view where they get displayed as options in select tag.
 */
router.get('/', function(req, res, next) {
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
  
      res.render('1_home', {sightData: data});

    })
  })
});

module.exports = router;
