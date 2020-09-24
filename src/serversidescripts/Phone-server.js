const { query } = require('./db');


async function deletePhone(phoneId)
{
    const result = await query(
        'DELETE FROM "Phone" WHERE id_phone = $1;',
             [phoneId]);
    return {
        isDeleted: result.rowCount > 0
    }
}
async function addPhone(contactId, phone)
{
    const result = await query(
            'INSERT INTO "Phone" (id_contact, phone_number) ' +
            'VALUES ($1, $2);',
            [contactId, phone]
        );

    return { isAdded: result.rowCount === 1 }
}


module.exports = {
    deletePhone,
    addPhone
}