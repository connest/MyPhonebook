const {query} = require('./db');

async function loginProcess(username, password) {

    const result = await query(
        'SELECT "id_person" AS "id_person" FROM "Person" ' +
        'WHERE login = $1 AND password = $2',
        [username, password]);

    return result.rows[0] || {id_person: -1}

}

async function login(username, password, res) {
    const userId = await loginProcess(username, password)
    if (userId.id_person == -1) {
        return {
            isLogined: false
        }
    }
    //TODO JWT
    res.cookie("userId", userId.id_person);
    return {
        isLogined: true
    }
}

module.exports = {
    login
};