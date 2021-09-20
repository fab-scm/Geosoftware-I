# Project_Exercise #

Link to the image of the node part of the application:
https://hub.docker.com/r/fabscm/stadtfuehrer-muenster

To run the application locally on your machine, you just need execute the "docker-compose.yml"
in this directory. The file uses the uploaded image of the node part, an existing image of the mongodb and mongo-express service. Anyone who has Docker installed on their PC just needs to download the "docker-compose.yml" file to run this application by the following command:

Command (from the directory where the file is stored):
docker-compose up

It is necessary to wait until the app started complete which means that you have to ignore that the mongo-express service exises several times with exit code 0 and restarts every time until everything is loaded successfully. After this, everything should work properly.

- The app is listening at http://localhost:4000
- The mongo-express service is listening at http://localhost:8081


The wikipedia-urls used on the website must be in the form "https://de.wikipedia.org/wiki/sightName" to make the api calls work properly.