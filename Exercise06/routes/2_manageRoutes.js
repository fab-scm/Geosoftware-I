// load modules

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


// define routes

/**
 * GET route listing.
 * Connects to the mongoDB and finds all the routes stored in the used collection, renders the pug view
 * and sends information to the pug-view where they get displayed as in a table that shows the name and the id of the routes in the DB.
 * 
 */
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


/**
 * POST to add a route.
 * The POST recieves the upload from the uploadfield 'route' and inserts it into the DB.
 * In the process the file gets validated by various if clauses to check if the map-app can work with it.
 * It gets tested on the file-extension, which must be of type geojson, on the form of the file and if it is a valid geojson
 * and last but not least on the specific form that is required for the map-app.
 */
router.post('/addRoute', upload.single('route'), function(req, res) {

  // Set our internal DB variable
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Get our form values. These rely on the "name" attributes
  var multerObject = req.file;
  if (req.file != undefined) {
    if (checkFileExtension(multerObject.originalname)) {

      try {
        console.log(multerObject);
        var inputRouteJSON = JSON.parse(multerObject.buffer);
        console.log(inputRouteJSON);
      }
      catch {
        res.send("Invalid GeoJSON file. Please validate your file.")
      }

      if (inputRouteJSON.type == "Feature" && inputRouteJSON.hasOwnProperty('geometry')) {
        if (inputRouteJSON.geometry.type == "LineString") {
          // Submit to the DB
          collection.insertOne(inputRouteJSON, function (err, doc) {

            if (err) {
              // If it failed, return error
              res.send("There was a problem adding the information to the database.");
            }
            else {
              res.redirect("/manageRoutes");
            }
          })
        }
        else {
          res.send("Uploaded GeoJSON is not of type 'LineString'. Please Check your GeoJSON. MultiLineString is not valid. You can get further information in the 'Valid Files' section")
        }
        
      }
      else {
        res.send("Uploaded file does not have the form: { 'type' : 'Feature', 'properties' : { 'name' : '...', 'desc' : 'Generated by...' }, 'geometry' : {'type' : 'LineString', 'coordinates' : [ [ 7.59579, 51.96918 ], [ 7.59567, 51.96886 ], ...]}");
      }
    }
    else {
      res.send("Uploaded file is not of type .geojson");
    }
  }
  else {
    res.redirect("/manageRoutes");
  }
  
  

});



/**
 * POST to delete route.
 * The Post recieves an object with the ids of all checked routes that should be deleted from the database.
 * It then iterates over the array and sends a delete query to DB with the specific id to delete.
 * 
 *  */ 
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


/** 
 * POST to rename a route.
 * The Post recieves an object with the id, index and name of a route that should be renamed in the database.
 * It then filters the right object from the database and sets the name to newname with $set.
 * 
 */
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
      $set: { "properties.name": routesObj.newname }
    }
  )
});


/**
 * The function checks if the type of the uploaded file is .geojson and returns true if it is
 * and false if not.
 * 
 * @param {String} fileName - filename with extension
 * @returns Boolean - true if type geojson and false if not
 */
function checkFileExtension(fileName) {
  let extension = fileName.split('.').pop();
  if (extension == "geojson"){
      return true;
  }
  else{
      return false;
  }
};

module.exports = router;
