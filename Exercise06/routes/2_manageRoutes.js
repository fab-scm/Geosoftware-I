// express
const express = require('express');
const router = express.Router();

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
      // console.log(data);
      res.render('2_manageRoutes', {title: 'Manage Routes:', tableData: data});
    })
  })
});


/* POST to Add User Service */
router.post('/addRoute', upload.single('route'), function(req, res) {

  // Set our internal DB variable
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Get our form values. These rely on the "name" attributes
  var multerObject = req.file;
  var inputRouteJSON = JSON.parse(multerObject.buffer);
  console.log(inputRouteJSON);

  // Submit to the DB
  collection.insertOne(inputRouteJSON, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          res.redirect("/manageRoutes");
      }
  });

});



/* POST to delete Route Service */
router.post('/delete', function(req, res) {
  var routesObj = JSON.parse(req.body.o);
  console.log(routesObj.routesChecked);


  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  if (routesObj.routesChecked.length > 0) {
    for (var i=0; i<routesObj.routesChecked.length; i++) {
      console.log(routesObj.routesChecked[i]);  
      
      var myquery = {"_id": mongodb.ObjectId(routesObj.routesChecked[i])}
      console.log(myquery);
      collection.deleteOne(myquery, function(err, data)
      {
          if (err) throw err;
          console.log('One document deleted');
      })
    }
  }
  
});


/* POST to delete Route Service */
router.post('/rename', function(req, res) {
  var routesObj = JSON.parse(req.body.o);
  console.log(routesObj);


  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  var myfilter = {"_id": mongodb.ObjectId(routesObj.id)}
  console.log(myfilter);

  collection.updateOne(
    myfilter, 
    {
      $set: { "features.0.properties.name": routesObj.newname }
    }
  )
});

module.exports = router;
