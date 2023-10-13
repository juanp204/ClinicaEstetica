const express = require('express');
const router = express.Router();
const path = require('path');
const conectado = require('../database/mysql');
const session = require('express-session');

const route = __dirname.slice(0, -6);
console.log(route);

// ------- html
rootdir = __dirname.slice(0, -6)
console.log(rootdir)

router.get('/', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    res.sendFile('/views/index.html', { root: rootdir })
});
router.get('/login.html', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    res.sendFile('/views/login.html', { root: rootdir })
});
router.get('/inicio.html', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    res.sendFile('/views/inicio.html', { root: rootdir })
});
router.get('/servicios.html', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    res.sendFile('/views/servicios.html', { root: rootdir })
});





module.exports = router;
