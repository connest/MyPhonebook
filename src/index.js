const jsonrpc = require('jsonrpc-lite')
const fs = require('fs')
const https = require('https')
const http = require('http')

const express = require('express')
const app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const {login} = require("./serversidescripts/Login-server")
const {registration} = require("./serversidescripts/Registration-server")
const {getContacts, getContactData, deleteContact, createContact} = require("./serversidescripts/Phonebook-server")
const {exportContacts, importContacts} = require("./serversidescripts/vcard-server")
const {deletePhone, addPhone} = require("./serversidescripts/Phone-server")

async function download(res, filename, data) {


    res.setHeader("Pragma", "public"); // required
    res.setHeader("Expires", "0");
    res.setHeader("Cache-Control", "must-revalidate, post-check=0, pre-check=0");
    res.setHeader("Cache-Control", "private", false); // required for certain browsers
    res.setHeader("Content-Type", "application/binary");

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Transfer-Encoding", "binary");
    res.setHeader("Content-Length", data.length + '');

    res.send(data)
}

app.get('/api/v1.0/exportContacts', async function (req, res) {
    try {
        const contacts = await exportContacts(req.cookies.userId)
        if (contacts.success && contacts.data.length) {
            await download(res, 'contacts.vcf', contacts.data);
        } else {
            res.sendStatus(404)
        }
    } catch (e) {
        console.warn('Error: ' + e)
        console.warn(e.stack)
        res.sendStatus(500)
        res.end();
    }
});

app.post('/api/v1.0', async function (req, res) {
    try {
        var method = req.body.method;
        var params = req.body.params;
        var id = req.body.id;


        res.header("Content-type", 'application/json')

        let result;
        if (method === 'person.signin') {
            result = await login(params.login, params.password, res)
        } else if (method === 'person.singup') {
            result = await registration(params.login, params.password, res);
        } else if (method === 'contact.get') {
            result = await getContacts(req.cookies.userId, params.limit, params.offset);
        } else if (method === 'contact.delete') {
            result = await deleteContact(params.contactId);
        } else if (method === 'contact.create') {
            result = await createContact(req.cookies.userId, params.name, params.surname, params.phones);
        } else if (method === 'contact.getWithPhones') {
            result = await getContactData(params.id);
        } else if (method === 'contact.import') {
            result = await importContacts(req.cookies.userId, params.data);
        } else if (method === 'phone.delete') {
            result = await deletePhone(params.phoneId);
        } else if (method === 'phone.add') {
            result = await addPhone(params.contactId, params.phone);
        } else {
            res.send(jsonrpc.error(id, jsonrpc.JsonRpcError.methodNotFound('Method not found')).serialize());
            return;
        }

        const responseObject = jsonrpc.success(id, result);
        res.send(responseObject.serialize())

    } catch (e) {
        res.sendStatus(500)
        console.log(e);
    }
});


app.use('/', express.static(__dirname + '/static'))

app.get('/', function (req, res) {
    res.render(__dirname + '/static/index.html');
});


let port = Number(process.argv[2]) || 6634
if (process.argv[3] === 'https') {
    console.log(`Started at https://localhost:${port}`);
    https.createServer({
        key: fs.readFileSync(__dirname + '/certs/device.key'),
        cert: fs.readFileSync(__dirname + '/certs/device.crt'),
    }, app).listen(port);
} else {
    console.log(`Started at http://localhost:${port}`);
    http.createServer(app).listen(port);
}