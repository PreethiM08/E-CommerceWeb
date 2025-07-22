require('dotenv').config();

const mysql=require('mysql2/promise');


const pool =  mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
console.log('DB_USER:', process.env.DB_USER);  // should print 'root'
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);  // should print your password

module.exports=pool;