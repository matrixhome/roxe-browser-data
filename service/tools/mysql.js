var mysql = require('promise-mysql');

MysqlPool = mysql.createPool({
    host: '127.0.0.1',
    user: 'exone',
    password: '123456',
    database: 'roxe',
    connectionLimit: 30
});

exports.MysqlPool = MysqlPool;