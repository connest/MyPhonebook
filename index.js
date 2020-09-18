
const fs = require('fs')
const http = require('http')
const express = require('express')
const app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


const { Client } = require('pg')
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'phonebook',
    password: '1234',
    port: 5432
});
client.connect()
client.query('SELECT * FROM "Phone"', [], (err, res) => {
    console.log(err ? err.stack : res) // Hello World!
    client.end()
})




app.use('/', express.static(__dirname + '/static'))



app.post('/api/books', function(req, res) {
    var method  = req.body.method;
    var params  = req.body.params;
    var id      = req.body.id;



    res.send()

});


app.get('/', function (req, res) {
    console.log("Started at ");
   // res.header('Content-type', 'text/html');
    res.end('<h1>Hello, just World!</h1>');
});



http.createServer({
    /*key: fs.readFileSync(__dirname + '/certs/key.pem'),
    cert: fs.readFileSync(__dirname + '/certs/cert.pem'),*/
}, app).listen(6634);