const jsonrpc = require('jsonrpc-lite');
const {createContact} = require('./Phonebook-server');
const {Client} = require('pg')

let matchesVcardTags = [
    'VCARD', 'VERSION', 'AGENT', 'BDAY', 'BEGIN', 'END', 'FN', 'FULLNAME', 'GEO', 'MAILER', 'NICKNAME', 'NOTE', 'PRODID', 'REV', 'ROLE', 'TITLE', 'TZ', 'UID', 'URL', 'VERSION', 'CATEGORIES', 'NICKNAME', 'ORG', 'KEY', 'LOGO', 'PHOTO', 'SOUND', 'NAME', 'PROFILE', 'SOURCE', 'ADR', 'EMAIL', 'IMPP', 'LABEL', 'N', 'PHOTO', 'TEL'
];

async function vcard(name, surname, phones, dataObj) {
    dataObj.data += "BEGIN:VCARD\r\nVERSION:3.0\r\n";

    dataObj.data += `N:${surname};${name};;;\r\n`
    dataObj.data += `FN:${name};${surname}\r\n`

    for (let phone of phones) {
        dataObj.data += `TEL;TYPE=CELL:${phone.phone_number}\r\n`
    }
    dataObj.data += "END:VCARD\r\n";
}


/*
    return array of objects
    {
        name: "",
        surname: "",
        phones: []
     }
 */

async function parseVcard(data) {
    const namesAndPhones = data.split('BEGIN:VCARD')
        .map(s => s.split(/(\n|\r\n)/)
            .filter(s => s !== '' && s !== '\n' && s !== '\r\n')
            .map(s => s.split(':'))
            .filter(s => s[0].match(/^(NAME|N)$/) || s[0].match(/^TEL/))
        )
        .filter(s => s.length > 0)


    let contacts = [];
    for (let contact of namesAndPhones) {

        const contactObj ={
            name: "<Unknown>",
            surname: "<Unknown>",
            phones: []
        };

        for(let contactValue of contact) {
            if(contactValue[0].match(/^(NAME|N)$/)) {
                [contactObj.name, contactObj.surname] = contactValue[1].split(';')

            } else {
                contactObj.phones.push(contactValue[1])
            }
        }

        contacts.push(contactObj)
    }


    return contacts;
}

async function getContacts(connection, userId) {
    const result = await connection.query(
        'SELECT id_contact, name, surname FROM "Contact" ' +
        'WHERE id_person = $1',
        [userId]
    );

    if (result) {
        return result.rows;
    }

    return [];
}

async function getPhones(connection, contactId) {
    const result = await connection.query(
        'SELECT phone_number FROM "Phone" ' +
        'WHERE id_contact = $1',
        [contactId]
    );

    if (result) {
        return result.rows;
    }

    return [];
}

async function exportContacts(userId) {
    if (!userId)
        throw new Error("Invalid userId");

    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'phonebook',
        password: '1234',
        port: 5432
    });
    client.connect();


    try {
        const contacts = await getContacts(client, userId);
        if (contacts.length > 0) {
            const dataObj = {data: ''}
            for (let contact of contacts) {
                const phones = await getPhones(client, contact.id_contact);
                await vcard(contact.name, contact.surname, phones, dataObj)
            }

            return dataObj.data;
        }


    } catch (e) {
        console.log(e.stack)
        return 'Error while generate';
    } finally {
        client.end();
    }

}


async function importContacts(id, userId, data) {
    const contacts = await parseVcard(data)

    if(contacts.length < 1)
        return jsonrpc.success(id, false);


    let flagSuccess;

    //TODO create transaction
    for(let contact of contacts) {
        flagSuccess = await createContact(id, userId, contact.name, contact.surname, contact.phones)
        if(!flagSuccess.result)
            return flagSuccess;
    }

    return jsonrpc.success(id, true);
}

async function importContactsProcess(id, userId, data) {
    return await importContacts(id, userId, data);
}

module.exports.importContacts = importContactsProcess;
module.exports.exportContacts = exportContacts;