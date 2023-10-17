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
    const user_CK = req.session.user
    const id = req.session.tipeuser


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


router.post('/register', async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const lastn = req.body.apellido;
    const pass = req.body.pass;
    if (email != "" || name != "" || pass != "") {
        conectado.query('SELECT * FROM usuarios WHERE correo = ?', [email], async (error, results) => {
            if (results.length == 0) {
                conectado.query('INSERT INTO usuarios SET ?', { correo: email, nombres: name, apellidos: lastn, passwd: pass }, async (error, result) => {
                    if (error) {
                        console.log(error)
                        res.render(path.join(rootdir, 'views/registrar.html'), {
                            alert: true,
                            alertTitle: "Error",
                            alertMessage: "ocurrio un error inesperado",
                            alertIcon: "error",
                            showConfirmButton: true,
                            timer: false
                        });
                    }
                    else {
                        res.redirect("/Login.html");
                    }
                })
            }
            else {
                res.render(path.join(rootdir, 'views/registrar.html'), {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "User ya ocupado",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false
                });
            }
        })
    }
    else {
        res.render(path.join(rootdir, 'views/registrar.html'), {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Espacios vacios",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false
        });
    }
})

router.post('/auth', async (req, res) => {
    const user_CK = req.session.user
    const id = req.session.tipeuser
    const user = req.body.user;
    const pass = req.body.pass;
    console.log(user)
    if (user != "" && pass != "") {
        conectado.query('SELECT correo,passwd,tipousuario_idtipousuario FROM usuarios WHERE correo = ? ', [user], (error, results) => {
            console.log(results)
            if (error || results.length == 0 || pass != results[0].passwd) {
                res.render(path.join(rootdir, 'views/Login.html'), {
                    us: user_CK,
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
                req.session.user = results[0].correo;
                req.session.tipeuser = results[0].tipousuario_idtipousuario;
                res.redirect('/')
            }
        });
    }
    else {
        res.render(path.join(rootdir, 'views/Login.html'), {
            us: user_CK,
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
