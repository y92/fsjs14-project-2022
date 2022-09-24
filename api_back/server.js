const express = require('express');
const app = express();
const mysql = require('promise-mysql');
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
let config;
console.log("process.env.HOST_DB", process.env.HOST_DB);
config = require(process.env.HOST_DB ? './config_example' : './config');

// My API routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const advertRoutes = require('./routes/advertRoutes');
const orderRoutes = require('./routes/orderRoutes');
// const libraryRoutes = require('./routes/libraryRoutes);
// const documentRoutes = require('./routes/documentRoutes);

const dbIdents = {
    host: process.env.HOST_DB || config.db.host,
    database: process.env.DATABASE_DB || config.db.database,
    user: process.env.USER_DB || config.db.user,
    password: process.env.PASSWORD_DB || config.db.password
}

console.log(dbIdents);

mysql.createConnection(dbIdents).then((db) => {
    console.log("Connected to DB "+dbIdents.database);
    setInterval(async function() {
        let res = await db.query("SELECT 1 as test");
    }, 5000);

    app.get('/', async (req, res, next) => {
        res.json({ status: 200, result: "Welcome to API back"})
    })

    // Call routes
    authRoutes(app, db);
    userRoutes(app, db);
    advertRoutes(app, db);
    orderRoutes(app, db);
    // libraryRoutes(app, db);
    // documentRoutes(app, db);

}).catch(err => console.error(err));

const PORT = process.env.port || 9500;
app.listen(PORT, () => {
    console.log("Listening port "+PORT)
})