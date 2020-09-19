const jsonrpc = require('jsonrpc-lite');

const { Client } = require('pg')


async function getContacts(userId, limit, offset)
{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'phonebook',
        password: '1234',
        port: 5432
    });
    client.connect()

    try {
        const result = await client.query(
            'SELECT id_contact, name, surname FROM "Contact" ' +
            'WHERE id_person = $1 ' +
            'LIMIT $2 ' +
            'OFFSET $3',
            [
                userId,
                (limit)? limit : null,
                offset
            ]
        );
        client.end();

        if(result) {
            console.log(result.rows)

            return result.rows;
        }

        return [];
    } catch (err) {
        console.log(err.stack)
        return [];
    }

}
async function deleteContact(contactId)
{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'phonebook',
        password: '1234',
        port: 5432
    });
    client.connect()

    try {
        console.log("contact: " + JSON.stringify(contactId))
        const result = await client.query(
            'DELETE FROM "Contact" WHERE id_contact = $1;',
            [contactId]
        );
        client.end();

        if(result) {
            return result.rowCount === 1;
        }

        return false;
    } catch (err) {
        console.log(err.stack)
        return false;
    }

}

async function addContact(userId, name, surname)
{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'phonebook',
        password: '1234',
        port: 5432
    });
    client.connect()

    try {
        const result = await client.query(
            'Insert into "Contact" (id_person,name,surname) ' +
            'values ($1, $2, $3) ' +
            'RETURNING id_contact;',
            [userId, name, surname]
        );
        client.end();

        if(result) {
            if(result.rowCount === 1)
                return result.rows[0]
        }

        return null;
    } catch (err) {
        console.log(err.stack)
        return null;
    }
}
async function addPhones(contactId, phones)
{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'phonebook',
        password: '1234',
        port: 5432
    });
    client.connect()


    try {
        console.log(phones)
        const result = await client.query(
            'INSERT INTO "Phone" (id_contact, phone_number) SELECT * FROM UNNEST ($1::int[], $2::text[]) AS "ThisPhones"',
            [
                Array(phones.length).fill(contactId),
                phones,
            ]
        );

        client.end();

        if(result) {
            return result.rowCount > 0;
        }

        return false;
    } catch (err) {
        console.log(err.stack)
        return false;
    }
}


async function createContact(userId, name, surname, phones)
{
    const contact = await addContact(userId, name, surname);
    if(!contact)
        return false;

    if(phones.length > 0) {
        const phonesAdded = await addPhones(contact.id_contact, phones)

        return phonesAdded;
    }
    return true
}



async function createContactProcess(id, userId, name, surname, phones)
{
    const contacts = await createContact(userId.id_person, name, surname, phones);
    return jsonrpc.success(id, contacts);
}

async function getContactsProcess(id, userId, limit, offset)
{
    const contacts = await getContacts(userId.id_person, limit, offset);
    return jsonrpc.success(id, contacts);
}

async function deleteContactProcess(id, contactId)
{
    const isDeleted = await deleteContact(contactId);
    return jsonrpc.success(id, {isDeleted: isDeleted});
}

module.exports.getContacts = getContactsProcess;
module.exports.deleteContact = deleteContactProcess;
module.exports.createContact = createContactProcess;