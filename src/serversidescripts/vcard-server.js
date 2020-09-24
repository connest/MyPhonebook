const {createContact, getContacts, getContactPhones} = require('./Phonebook-server');


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


async function exportContacts(userId) {
    if (!userId)
        throw new Error("Invalid userId");

    const contacts = await getContacts(userId, 0, 0);

    if (contacts.length > 0) {
        const dataObj = {data: ''}
        for (let contact of contacts) {
            const phones = await getContactPhones(contact.id_contact);
            await vcard(contact.name, contact.surname, phones, dataObj)
        }

        return { data: dataObj.data, success: true}
    }

    return { data: [], success: false}
}


async function importContacts(userId, data) {
    const contacts = await parseVcard(data)

    if (contacts.length < 1)
        return {isImported: false}

    let flagSuccess;

    //TODO create transaction
    for (let contact of contacts) {
        flagSuccess = await createContact(userId, contact.name, contact.surname, contact.phones)
        if (!flagSuccess)
            return {isImported: flagSuccess};
    }

    return {isImported: true};
}

module.exports = {
    importContacts,
    exportContacts
}