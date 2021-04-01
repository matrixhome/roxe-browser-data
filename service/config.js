// const rpcurl = 'http://47.75.253.127:8888/v1/chain'
const rpcurl = 'http://127.0.0.1:8888/v1/chain'
// const rpcurl = 'http://api.main.alohaeos.com/v1/chain'

const pgsqlOptions = {
  user: 'root',
  host: '172.17.3.161',
  database: 'root',
  password: '123456',
  port: 5432,
}

// const pgsqlOptions = {
//   user: 'test',
//   host: '172.22.1.179',
//   database: 'test',
//   password: 'Lln6I44V#test',
//   port: 5432,
// }


module.exports = {
    pgsqlOptions : pgsqlOptions,
    rpcurl: rpcurl
  }