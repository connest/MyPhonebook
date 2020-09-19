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
            'SELECT id_contact, name, surname FROM "Contact"\n' +
            'WHERE id_person = $1\n' +
            'LIMIT $2\n' +
            'OFFSET $3\n',
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
        const result = await client.query(
            'DELETE FROM "Contact"\n' +
            'WHERE id_contact = $1;'
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

async function getContactsProcess(id, userId, limit, offset)
{
    const contacts = await getContacts(userId.id_person, limit, offset);
    return jsonrpc.success(id, contacts);
}

async function deleteContactsProcess(id, contactId)
{
    const isDeleted = await deleteContact(contactId);
    return jsonrpc.success(id, {isDeleted: isDeleted});
}

module.exports.getContacts = getContactsProcess;
module.exports.deleteContact = deleteContactsProcess;