const jsonrpc = require('jsonrpc-lite')
const fs = require('fs')
const http = require('http')

const express = require('express')
const app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const { login } = require("./serversidescripts/Login-server")
const { registration } = require("./serversidescripts/Registration-server")
const { getContacts, getContactData, deleteContact, createContact } = require("./serversidescripts/Phonebook-server")
const { exportContacts } = require("./serversidescripts/vcard-server")
const { deletePhone, addPhone } = require("./serversidescripts/Phone-server")

async function download(res, filename, data) {


    res.setHeader("Pragma", "public"); // required
    res.setHeader("Expires", "0");
    res.setHeader("Cache-Control","must-revalidate, post-check=0, pre-check=0");
    res.setHeader("Cache-Control", "private",false); // required for certain browsers
    res.setHeader("Content-Type", "application/binary");

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Transfer-Encoding", "binary");
    res.setHeader("Content-Length", data.length+'');

    res.send(data)
}
app.get('/api/v1.0/exportContacts', async function (req, res) {
    try {
        await download(res, 'contacts.vcf', await exportContacts(req.cookies.userId));
    } catch (e) {
        console.warn('Error: ' + e)
       res.status(500)
        res.end();
    }
});

app.post('/api/v1.0', async function(req, res) {
   try {
       var method = req.body.method;
       var params = req.body.params;
       var id = req.body.id;


       let result;
       if (method === 'person.signin') {
           result = await login(id, params.login, params.password, res)
       } else if(method === 'person.singup') {
           result = await registration(id, params.login, params.password, res);
       } else if(method === 'contact.get') {
           result = await getContacts(id, req.cookies.userId, params.limit, params.offset);
       } else if(method === 'contact.delete') {
           result = await deleteContact(id, params.contactId);
       } else if(method === 'contact.create') {
           result = await createContact(id, req.cookies.userId, params.name, params.surname, params.phones);
       } else if(method === 'contact.getWithPhones') {
           result = await getContactData(id, params.id);
       } else if(method === 'phone.delete') {
           result = await deletePhone(id, params.phoneId);
       } else if(method === 'phone.add') {
           result = await addPhone(id, params.contactId, params.phone);
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
    res.render(__dirname + '/static/index.html');
});



http.createServer({
    /*key: fs.readFileSync(__dirname + '/certs/key.pem'),
    cert: fs.readFileSync(__dirname + '/certs/cert.pem'),*/
}, app).listen(6634);