const express = require('express')

const app = express()
const port = 3000

app.get('/', (req, res) => 
{
    res.sendFile(__dirname + "/public/index.html");
})

app.get('/routes', (req, res) => 
{
    res.sendFile(__dirname + "/public/index.html");
})

app.get('/changeRoutes', (req, res) =>
{
    res.send('Hier kann die Route verändert werden')
})

app.use(express.static('public'))


app.listen(port, () => 
{
  console.log(`App listening at http://localhost:${port}`)
})