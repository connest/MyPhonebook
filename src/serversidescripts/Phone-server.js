const jsonrpc = require('jsonrpc-lite');

const { query } = require('./db');

async function getPhones(contactId) {
    const result = await query(
        'SELECT phone_number FROM "Phone" ' +
        'WHERE id_contact = $1',
        [contactId]
    );

        return result.rows;
}

async function deletePhoneProcess(phoneId)
{
    const result = await query(
        'DELETE FROM "Phone" WHERE id_phone = $1;',
             [phoneId]);
    return result.rowCount > 0
}
async function addPhoneProcess(contactId, phone)
{
    const result = await query(
            'INSERT INTO "Phone" (id_contact, phone_number) ' +
            'VALUES ($1, $2);',
            [contactId, phone]
        );

    return result.rowCount === 1;
}

async function deletePhone(id, phoneId)
{
    const deleted = await deletePhoneProcess(phoneId);
    console.log(deleted)
    return jsonrpc.success(id, {isDeleted: deleted});
}
async function addPhone(id, contactId, phone)
{
    const added = await addPhoneProcess(contactId, phone);
    return jsonrpc.success(id, {isAdded: added});
}

module.exports.getPhones = getPhones;
module.exports.deletePhone = deletePhone;
module.exports.addPhone = addPhone;