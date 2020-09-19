const jsonrpc = require('jsonrpc-lite');

const { Client } = require('pg')

async function loginExists(connection, username) {
    try {
        const result = await connection.query(
            'SELECT 1 FROM "Person" WHERE login = $1',
            [username]
        );

         return result && result.rowCount === 1;
    } catch (err) {
        console.log(err.stack)
        return false;
    }
}

async function createPerson(connection, username, password) {
    try {
        const result = await connection.query(
            'INSERT INTO "Person" (login, password) VALUES ($1, $2);',
            [username, password]
        );

        if(result) {
            if(result.rowCount === 1) {
                console.log(result.rows[0])
                return result.rows[0]
            }
        }
        return -1;
    } catch (err) {
        console.log(err.stack)
        return -1;
    }
}

async function registration(username, password)
{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'phonebook',
        password: '1234',
        port: 5432
    });
    client.connect()

    if(await loginExists(client, username)) {
        client.end();
       return -1;
    } else {
        const result = await createPerson(client, username, password)
        client.end();
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