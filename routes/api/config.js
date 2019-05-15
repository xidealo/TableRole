const mysql = require("mysql");

var pool = mysql.createPool({
connectionLimit: 100,
host: 'unidb.ru',
port: 6606,
user: '2BTeam',
password: 'rolesSeparation',
database: '2BTeam'
})

module.exports = pool