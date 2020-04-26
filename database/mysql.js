// ----- Required Modules -----

const mysql = require('mysql2/promise');


// ----- MYSQL -----

const pool = mysql.createPool
({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.query("SELECT ID FROM atable", function(err, rows, fields)
{
    
})