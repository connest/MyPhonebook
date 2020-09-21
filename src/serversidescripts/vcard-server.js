const {Client} = require('pg')


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
async function vcard(name, surname, phones, dataObj) {
    dataObj.data += "BEGIN:VCARD\r\nVERSION:3.0\r\n";

    dataObj.data += `N:${surname};${name};;;\r\n`
    dataObj.data += `FN:${name};${surname}\r\n`

    for(let phone of phones) {
        dataObj.data += `TEL;TYPE=CELL:${phone.phone_number}\r\n`
    }
    dataObj.data += "END:VCARD\r\n";
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
        if(contacts.length > 0)
        {
            const dataObj = {data: ''}
            for(let contact of contacts) {
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

module.exports.exportContacts = exportContacts;