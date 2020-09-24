const jsonrpc = require('jsonrpc-lite');
const {query} = require('./db');

async function loginProcess(username, password) {
    // const client = await getClient();
    // try {
    //     const result = await client.query(
    //         'SELECT "id_person" AS "id_person" FROM "Person" ' +
    //         'WHERE login = $1 AND password = $2',
    //         [username, password]
    //     );
    //     return result.rows[0];
    // } catch (err) {
    //     console.log(err.stack)
    //     return [];
    // } finally {
    //     client.release();
    // }
    const result = await query(
        'SELECT "id_person" AS "id_person" FROM "Person" ' +
        'WHERE login = $1 AND password = $2',
        [username, password]);

    return result.rows[0] || {id_person: -1}

}

async function login(id, username, password, res) {
    const userId = await loginProcess(username, password)
    if (userId.id_person == -1) {
        return jsonrpc.success(id, {isLogined: false})
    } else {
        //TODO JWT
        res.cookie("userId", userId.id_person);
        return jsonrpc.success(id, {isLogined: true});
    }
}

module.exports.login = login;