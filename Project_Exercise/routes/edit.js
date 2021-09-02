//express
var express = require('express');
var router = express.Router();

// assert
const assert = require('assert')

// mongoDB
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017' // connection URL
const client = new MongoClient(url) // mongodb client
const dbName = 'ProjectDB' // database name
const collectionName = 'sights' // collection name

// define routes

/**
 * GET sights data. 
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
  
      res.render('2_edit', {data: data});

    })
  })
});

router.post('/addSight', function(req, res, next) {
  var sightDataString = req.body.o;
  var sightData = JSON.parse(sightDataString);
  console.log(sightData);

  client.connect(function(err){

    assert.equal(null, err);

    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    collection.insertOne(sightData, function(err, result){
      assert.equal(err, null);
      
      console.log(`Inserted the sight successfully ${result.insertedCount} document into the collection`)
      //res.render('2_edit');
    })
    res.redirect("/edit");
  })
})


module.exports = router;
