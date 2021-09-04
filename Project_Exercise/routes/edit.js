//express
var express = require('express');
var router = express.Router();

// assert
const assert = require('assert')

// axios
const axios = require('axios');

// got
const got = require('got');

// multer
const multer = require ('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

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
  
      res.render('2_edit', {sightData: data});

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
      
    })
    //res.render('2_edit');
    res.redirect("/edit");
  })
})


/**
 * POST to add a route.
 * The POST recieves the upload from the uploadfield 'route' and inserts it into the DB.
 * In the process the file gets validated by various if clauses to check if the map-app can work with it.
 * It gets tested on the file-extension, which must be of type geojson, on the form of the file and if it is a valid geojson
 * and last but not least on the specific form that is required for the map-app.
 */
 router.post('/addSightInputFile', upload.single('sightInputFile'), function(req, res) {

  // Set our internal DB variable
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Get our form values. These rely on the "name" attributes
  var multerObject = req.file;
  if (req.file != undefined) {
    if (checkFileExtension(multerObject.originalname)) {

      try {
        console.log(multerObject);
        var inputFileJSON = JSON.parse(multerObject.buffer);
        console.log(inputFileJSON);
      }
      catch {
        res.send("Invalid GeoJSON file. Please validate your file.")
      }

      if (inputFileJSON.type == "FeatureCollection") {
        if (inputFileJSON.features[0].geometry.type == "Point" || inputFileJSON.features[0].geometry.type == "Polygon") {
          

          (async () => {
            try {
              
              if (inputFileJSON.features[0].properties.URL.includes('wikipedia')) {
                var wikiSightName = getSightNameFromURL(inputFileJSON.features[0].properties.URL);
                const response = await axios.get('http://de.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=true&exsentences=3&explaintext=true&titles=' + wikiSightName + '&origin=*', { json: true });
                console.log(response.data);
                var key = Object.keys(response.data.query.pages)[0];
                var article = response.data.query.pages[key].extract;
                console.log(article);
                inputFileJSON.features[0].properties.Beschreibung = article;
                console.log(inputFileJSON.features[0].properties);
              }
              else if (inputFileJSON.features[0].properties.Beschreibung == "") {
                  inputFileJSON.features[0].properties.Beschreibung = "Keine Informationen vorhanden"
              }
              


              // Submit to the DB
              collection.insertOne(inputFileJSON, function (err, doc) {

                if (err) {
                  // If it failed, return error
                  res.send("There was a problem adding the information to the database.");
                }
                else {
                  res.redirect("/edit");
                }
              })


            } catch (error) {
              console.log(error.response.body);
            }
          })();

          
        }
        else {
          res.send("Uploaded GeoJSON is not of type 'Point' or 'Polygon'. Please Check your GeoJSON. You can get further information in the 'Valid Files' section")
        }
        
      }
      else {
        res.send("Uploaded file is not of type 'FeatureCollection' ");
      }
    }
    else {
      res.send("Uploaded file is not of type .geojson");
    }
  }
  else {
    res.redirect("/edit");
  }
});




/**
 * POST to add a route.
 * The POST recieves the upload from the uploadfield 'route' and inserts it into the DB.
 * In the process the file gets validated by various if clauses to check if the map-app can work with it.
 * It gets tested on the file-extension, which must be of type geojson, on the form of the file and if it is a valid geojson
 * and last but not least on the specific form that is required for the map-app.
 */
 router.post('/addSightInputText', upload.none('sightInputText'), function(req, res) {

  // Set our internal DB variable
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Get our form values. These rely on the "name" attributes
  var multerObject = req.body;
  console.log(multerObject.sightInputText);
  if (multerObject.sightInputText != undefined) {
      try {
        //console.log(multerObject);
        var inputTextJSON = JSON.parse(multerObject.sightInputText);
        console.log(inputTextJSON);
      }
      catch {
        res.send("Invalid GeoJSON file. Please validate your file.")
      }

      if (inputTextJSON.type == "FeatureCollection") {
        if (inputTextJSON.features[0].geometry.type == "Point" || inputTextJSON.features[0].geometry.type == "Polygon") {
          // Submit to the DB

          (async () => {
            try {
              
              if (inputTextJSON.features[0].properties.URL.includes('wikipedia')) {
                var wikiSightName = getSightNameFromURL(inputTextJSON.features[0].properties.URL);
                const response = await axios.get('http://de.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=true&exsentences=3&explaintext=true&titles=' + wikiSightName + '&origin=*', { json: true });
                console.log(response.data);
                var key = Object.keys(response.data.query.pages)[0];
                var article = response.data.query.pages[key].extract;
                console.log(article);
                inputTextJSON.features[0].properties.Beschreibung = article;
                console.log(inputTextJSON.features[0].properties);
              }
              else if (inputTextJSON.features[0].properties.Beschreibung == "") {
                  inputTextJSON.features[0].properties.Beschreibung = "Keine Informationen vorhanden"
              }
              


              // Submit to the DB
              collection.insertOne(inputTextJSON, function (err, doc) {

                if (err) {
                  // If it failed, return error
                  res.send("There was a problem adding the information to the database.");
                }
                else {
                  res.redirect("/edit");
                }
              })


            } catch (error) {
              console.log(error.response.body);
            }
          })();

        }
        else {
          res.send("Uploaded GeoJSON is not of type 'Point' or 'Polygon'. Please Check your GeoJSON. You can get further information in the 'Valid Files' section")
        }
        
      }
      else {
        res.send("Uploaded file is not of type 'FeatureCollection' ");
      }
  }
  else {
    res.redirect("/edit");
  }
});


/**
 * POST to delete route.
 * The Post recieves an object with the ids of all checked routes that should be deleted from the database.
 * It then iterates over the array and sends a delete query to DB with the specific id to delete.
 * 
 *  */ 
 router.post('/delete', function(req, res) {
  var sightsObj = JSON.parse(req.body.o);
  console.log(sightsObj.sightsChecked);


  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  if (sightsObj.sightsChecked.length > 0) {
    for (var i=0; i<sightsObj.sightsChecked.length; i++) {
      console.log(sightsObj.sightsChecked[i]);  
      
      var myquery = {"_id": mongodb.ObjectId(sightsObj.sightsChecked[i])}
      console.log(myquery);
      collection.deleteOne(myquery, function(err, data)
      {
          assert.equal(err, null);
          //if (err) throw err;
          console.log('One document deleted');
          
      })
      res.redirect("/edit");
    }  
  }
});


function getSightNameFromURL(url) {
  var urlArray = url.split('/');
  var sightName = urlArray[4];
  console.log(sightName);
  return sightName;
}



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
