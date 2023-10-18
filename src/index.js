const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//dotenv var.entorno
const dotenv = require("dotenv");
dotenv.config({ path: '../.env' })

//configuracion
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

//var.session
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set this to true on production
    }
}

app.use(session(sessionConfig));

//DB
const conectado = require('./database/mysql');
//const req = require('express/lib/request');

//recursos
app.use(express.static('public'));

//rutas
app.use(require('./routes/routes.js'));

//server
app.listen(process.env.SERVER_PORT, () => {
    console.log("server on : " + process.env.SERVER_PORT);
});
