const jsonrpc = require('jsonrpc-lite');

const { query } = require('./db')

async function loginExists(username) {

        const result = await query(
            'SELECT 1 FROM "Person" WHERE login = $1',
            [username]
        );

         return result.rowCount > 0;
}

async function createPerson(username, password) {

        const result = await query(
            'INSERT INTO "Person" (login, password) VALUES ($1, $2) RETURNING id_person;',
            [username, password]
        );

        return result.rows[0].id_person || -1


}

async function registration(username, password)
{
    if(await loginExists(username)) {
       return -1;
    } else {
        const result = await createPerson( username, password)
        return result;
    }

}

async function registrationProcess(id, username, password, res)
{
    const userId = await registration(username, password)
    if(userId === -1) {
        return jsonrpc.success(id, {isSigned: false})
    } else {
        res.cookie("userId", userId);
        return jsonrpc.success(id, {isSigned: true});
    }
}

module.exports.registration = registrationProcess;