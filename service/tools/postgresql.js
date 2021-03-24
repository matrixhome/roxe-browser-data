const { Pool, Client } = require('pg')
const { pgsqlOptions } = require('../config')

// const pgsqlPool = new Pool({
//   user: 'test',
//   host: '172.22.1.179',
//   database: 'test',
//   password: 'Lln6I44V#test',
//   port: 5432,
  // max: 77,
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
// })

//test
const pgsqlPool = new Pool({
  user: pgsqlOptions.user,
  host: pgsqlOptions.host,
  database: pgsqlOptions.database,
  password: pgsqlOptions.password,
  port: pgsqlOptions.port,
  max: 77,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// pgsqlPool.query('SELECT * FROM "chain".block_info order by timestamp desc LIMIT 1', (err, res) => {
//   console.log(err, res)
//   pgsqlPool.end()
// })
// const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [1])

module.exports = {
  pgsqlPool: pgsqlPool
}