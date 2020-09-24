const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'phonebook',
    password: '1234',
    port: 5432,
    max: 20,
    // idleTimeoutMillis: 30000,
    // connectionTimeoutMillis: 2000,
})

const getClient = async function() {
    return pool.connect();
}

const query = async function(query, params) {
    const client = await getClient();
    try {
        const result = await client.query(query, params);
        return {
            rows: result.rows,
            rowCount: result.rowCount

        };
    } catch (err) {
        console.log(err.stack)
        return [];
    } finally {
        client.release();
    }
}


module.exports = {
    getClient,
    query
}