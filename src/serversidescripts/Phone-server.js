const jsonrpc = require('jsonrpc-lite');

const { Client } = require('pg')


async function deletePhone(phoneId)
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
            'DELETE FROM "Phone" WHERE id_phone = $1;',
            [phoneId]
        );
        client.end();

        if(result)
            return result.rowCount > 0;

        return false;
    } catch (err) {
        console.log(err.stack)
        client.end();
        return false;
    }
}
async function addPhone(contactId, phone)
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
            'INSERT INTO "Phone" (id_contact, phone_number) ' +
            'VALUES ($1, $2);',
            [contactId, phone]
        );
        client.end();

        if(result)
            return result.rowCount === 1;

        return false;
    } catch (err) {
        console.log(err.stack)
        client.end();
        return false;
    }
}

async function deletePhoneProcess(id, phoneId)
{
    const deleted = await deletePhone(phoneId);
    return jsonrpc.success(id, {isDeleted: deleted});
}
async function addPhoneProcess(id, contactId, phone)
{
    const added = await addPhone(contactId, phone);
    return jsonrpc.success(id, {isAdded: added});
}

module.exports.deletePhone = deletePhoneProcess;
module.exports.addPhone = addPhoneProcess;