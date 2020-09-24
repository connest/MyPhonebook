
const {query} = require('./db')


async function getContacts(userId, limit, offset) {
    const result = await query(
        'SELECT id_contact, name, surname FROM "Contact" ' +
        'WHERE id_person = $1 ' +
        'LIMIT $2 ' +
        'OFFSET $3',
        [
            userId,
            (limit) ? limit : null,
            offset
        ]
    );
    return result.rows;

}

async function deleteContact(contactId) {
    const result = await query(
        'DELETE FROM "Contact" WHERE id_contact = $1;',
        [contactId]
    );
    return {isDeleted: result.rowCount === 1};

}

async function addContact(userId, name, surname) {
    const result = await query(
        'INSERT INTO "Contact" (id_person,name,surname) ' +
        'VALUES ($1, $2, $3) ' +
        'RETURNING id_contact;',
        [userId, name, surname]
    );

    return result.rows[0]


}

async function addPhones(contactId, phones) {
    const result = await query(
        'INSERT INTO "Phone" (id_contact, phone_number) ' +
        'SELECT * FROM UNNEST ($1::int[], $2::text[]) AS "ThisPhones"',
        [
            Array(phones.length).fill(contactId),
            phones,
        ]
    );

    return result.rowCount > 0;
}


async function createContact(userId, name, surname, phones) {
    const contact = await addContact(userId, name, surname);
    if (!contact)
        return false;

    if (phones.length > 0) {
        const phonesAdded = await addPhones(contact.id_contact, phones)

        return phonesAdded;
    }
    return true
}


async function getContactDataName(contactId) {


    const result = await query(
        'SELECT name, surname FROM "Contact" ' +
        'WHERE id_contact = $1;',
        [contactId]
    )
    return result.rows[0]

}

async function getContactPhones(contactId) {

    const result = await query(
        'SELECT id_phone, phone_number FROM "Phone" ' +
        'WHERE id_contact = $1;',
        [contactId]
    )
    return result.rows;

}

async function getContactDataProcess(contactId) {
    const contactParams = await getContactDataName(contactId);
    if (!contactParams)
        return null;


    const contactPhones = await getContactPhones(contactId);

    return {
        name: contactParams.name,
        surname: contactParams.surname,
        phones: contactPhones
    }

}





async function getContactData(contactId) {
    const contactData = await getContactDataProcess(contactId);
    if (contactData) {
        return contactData;
    } else {
        return {
            name: '<Unknown>',
            surname: '<Unknown>',
            phones: []
        };
    }
}


module.exports = {
    getContacts,
    deleteContact,
    createContact,
    getContactData,
    getContactPhones
}