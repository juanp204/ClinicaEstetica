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

router.get('/usuario.html', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    res.sendFile('/views/usuario.html', { root: rootdir })
});

router.get('/usuario.html', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    res.sendFile('/views/usuario.html', { root: rootdir })
});

router.get('/register.html', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    res.sendFile('/views/register.html', { root: rootdir })
});

router.get('/appointment.html', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    res.sendFile('/views/appointment.html', { root: rootdir })
});

router.post('/auth', async (req, res) => {
    const users = req.session.user
    const id = req.session.tipeuser
    const user = req.body.user;
    const pass = req.body.pass;
    console.log(user)
    if (user != "" && pass != "") {
        conectado.query('SELECT * FROM usuario WHERE us_nickname = ? AND tipo_usuario_id_tu <> 6', [user], (error, results) => {
            console.log(results)
            if (error || results.length == 0 || pass != results[0].us_pass) {
                res.render(path.join(route, 'views/init.html'), {
                    us: users,
                    id: id,
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o password incorrecta",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false
                });
            }
            else {
                req.session.loggedin = true;
                req.session.user = results[0].us_nickname;
                req.session.tipeuser = results[0].tipo_usuario_id_tu;
                req.session.userid = results[0].id_usuario;
                res.redirect('/')
            }
        });
    }
    else {
        res.render(path.join(route, 'views/init.html'), {
            us: users,
            id: id,
            alert: true,
            alertTitle: "Error",
            alertMessage: "Campos vacios",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false
        });
    }

});



module.exports = router;
