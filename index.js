const jsonrpc = require('jsonrpc-lite')
const fs = require('fs')
const http = require('http')

const express = require('express')
const app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


const {login} = require("./scripts/Login-server")




app.post('/api/v1.0', async function(req, res) {
   try {
       var method = req.body.method;
       var params = req.body.params;
       var id = req.body.id;


       let result;
       if (method === 'person.signin') {
           result = await login(id, params.login, params.password, res)
       } else {
           result = jsonrpc.error(id, jsonrpc.JsonRpcError.methodNotFound(''))
       }

       res.header("Content-type", 'application/json')
       res.send(result.serialize())
   } catch (e) {
       console.log(e);
   }
});


app.use('/', express.static(__dirname + '/static'))


app.get('/', function (req, res) {
    console.log("Started at ");
   // res.header('Content-type', 'text/html');
    res.end('<h1>Hello, just World!</h1>');
});



http.createServer({
    /*key: fs.readFileSync(__dirname + '/certs/key.pem'),
    cert: fs.readFileSync(__dirname + '/certs/cert.pem'),*/
}, app).listen(6634);