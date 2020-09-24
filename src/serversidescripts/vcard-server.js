const jsonrpc = require('jsonrpc-lite');
const {createContact} = require('./Phonebook-server');
const {query} = require('./db')

const {getPhones} = require('./Phone-server')


async function vcard(name, surname, phones, dataObj) {
    dataObj.data += "BEGIN:VCARD\r\nVERSION:3.0\r\n";

    dataObj.data += `N:${surname};${name};;;\r\n`
    dataObj.data += `FN:${name};${surname}\r\n`

    for (let phone of phones) {
        dataObj.data += `TEL;TYPE=CELL:${phone.phone_number}\r\n`
    }
    dataObj.data += "END:VCARD\r\n";
}


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

        const contactObj = {
            name: "<Unknown>",
            surname: "<Unknown>",
            phones: []
        };

        for (let contactValue of contact) {
            if (contactValue[0].match(/^(NAME|N)$/)) {
                [contactObj.name, contactObj.surname] = contactValue[1].split(';')

            } else {
                contactObj.phones.push(contactValue[1])
            }
        }

        contacts.push(contactObj)
    }


    return contacts;
}

async function getContacts(userId) {
    const result = await query(
        'SELECT id_contact, name, surname FROM "Contact" ' +
        'WHERE id_person = $1',
        [userId]
    );

    return result.rows;
}


async function exportContacts(userId) {
    if (!userId)
        throw new Error("Invalid userId");


    const contacts = await getContacts(userId);
    if (contacts.length > 0) {
        const dataObj = {data: ''}
        for (let contact of contacts) {
            const phones = await getPhones(contact.id_contact);
            await vcard(contact.name, contact.surname, phones, dataObj)
        }

        return dataObj.data;
    }

}


async function importContacts(id, userId, data) {
    const contacts = await parseVcard(data)

    if (contacts.length < 1)
        return jsonrpc.success(id, false);


    let flagSuccess;

    //TODO create transaction
    for (let contact of contacts) {
        flagSuccess = await createContact(id, userId, contact.name, contact.surname, contact.phones)
        if (!flagSuccess.result)
            return flagSuccess;
    }

    return jsonrpc.success(id, {isImported: true});
}

module.exports.importContacts = importContacts;
module.exports.exportContacts = exportContacts;