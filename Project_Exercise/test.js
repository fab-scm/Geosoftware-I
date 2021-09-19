const got = require("got");

let port = 3000

let urlHome = `http://localhost:${port}/home`

async function routeLog(url) 
{
    const response = await got(url);
    console.log(response.statusCode);
}

routeLog(urlHome);