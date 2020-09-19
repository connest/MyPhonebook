const jsonrpc = require('jsonrpc-lite');

const { Client } = require('pg')


async function login(username, password)
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
            'SELECT "id_person" AS "id_person" FROM "Person" WHERE login = $1 AND password = $2',
            [username, password]
        );
        client.end();

        if(result) {
            if(result.rowCount === 0)
                return -1;

            console.log(result.rows[0])

            return result.rows[0];
        }

        return -1;
    } catch (err) {
        console.log(err.stack)
        return -1;
    }

}

async function loginProcess(id, username, password, res)
{
    const userId = await login(username, password)
    if(userId === -1) {
        return jsonrpc.success(id, {isLogined: false})
    } else {
        res.cookie("userId", userId);
        return jsonrpc.success(id, {isLogined: true});
    }
}

module.exports.login = loginProcess;