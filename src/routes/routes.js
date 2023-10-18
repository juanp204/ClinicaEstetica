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

    let login, hreflog;

    if (req.session.loggedin) {
        login = 'Perfil';
        hreflog = '/usuario.html';
    } else {
        login = 'Login';
        hreflog = '/login.html';
    }

    res.render(path.join(rootdir, 'views/index.html'), { login, hreflog });
});
router.get('/login.html', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    res.render(path.join(rootdir, 'views/Login.html'))
});

router.get('/editar', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    res.render(path.join(rootdir, 'views/editar.html'))
});



router.get('/inicio.html', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    //res.sendFile('/views/inicio.html', { root: rootdir })
    res.redirect('/')
});

router.get('/cerrarsesion', async (req, res) => {
    req.session.destroy()
    res.redirect('/')
});

router.get('/admin.html', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    //res.sendFile('/views/servicios.html', { root: rootdir })

    let login, hreflog;

    if (req.session.loggedin) {
        login = 'admin';
        hreflog = '/admin.html';
    } else {
        login = 'Login';
        hreflog = '/login.html';
    }

    conectado.query('SELECT * FROM servicios', (error, results) => {
        console.log(results)
        if (error || results.length == 0) {
            console.log('error')
            res.render(path.join(rootdir, 'views/admin.html'), {
                login,
                hreflog,
                servicios: results,
                alert: true,
                alertTitle: "Sin Servicios",
                alertMessage: "no hay servicios por el momento",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false
            });

        }
        else {
            res.render(path.join(rootdir, 'views/admin.html'), {
                login,
                hreflog,
                servicios: results
            });
        }
    });

    //res.render(path.join(rootdir, 'views/Servicios.html'))

});


router.get('/servicios.html', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    //res.sendFile('/views/servicios.html', { root: rootdir })

    let login, hreflog;

    if (req.session.loggedin) {
        login = 'Perfil';
        hreflog = '/usuario.html';
    } else {
        login = 'Login';
        hreflog = '/login.html';
    }

    conectado.query('SELECT * FROM servicios', (error, results) => {
        console.log(results)
        if (error || results.length == 0) {

            res.render(path.join(rootdir, 'views/servicios.html'), {
                login,
                hreflog,
                servicios: results,
                alert: true,
                alertTitle: "Sin Servicios",
                alertMessage: "no hay servicios por el momento",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false
            });

        }
        else {
            res.render(path.join(rootdir, 'views/servicios.html'), {
                login,
                hreflog,
                servicios: results
            });
        }
    });

    //res.render(path.join(rootdir, 'views/Servicios.html'))

});


router.get('/usuario.html', async (req, res) => {
    console.log(req.session)

    let login, hreflog;

    if (req.session.tipeuser == '1') {
        login = 'admin';
        hreflog = '/admin.html';
    }
    else if (req.session.tipeuser == '2') {
        login = 'perfil';
        hreflog = '/usuario.html';
    }

    console.log(login, hreflog)
    if (req.session.loggedin) {
        res.render(path.join(rootdir, 'views/usuario.html'), {
            login,
            hreflog,
            nombre: req.session.name
        })
    }
    else {
        res.redirect('/')
    }
    //res.render(path.join(route,'views/index.html'));
});

router.get('/register.html', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    res.render(path.join(rootdir, 'views/register.html'))



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
                conectado.query('INSERT INTO usuarios SET ?', { correo: email, nombres: name, apellidos: lastn, passwd: pass, tipousuario_idtipousuario: 2 }, async (error, result) => {
                    if (error) {
                        console.log(error)
                        res.render(path.join(rootdir, 'views/register.html'), {
                            alert: true,
                            alertTitle: "Error",
                            alertMessage: "ocurrio un error inesperado",
                            alertIcon: "error",
                            showConfirmButton: true,
                            timer: false
                        });
                    }
                    else {
                        res.redirect('/login.html');
                    }
                })
            }
            else {
                res.render(path.join(rootdir, 'views/register.html'), {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "email ya ocupado",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false
                });
            }
        })
    }
    else {
        res.render(path.join(rootdir, 'views/register.html'), {
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
    const user_CK = req.session.user;
    const id = req.session.tipeuser;
    const user = req.body.username;
    const pass = req.body.password;
    const rem = req.body.remember;
    console.log(user)
    if (user != "" && pass != "") {
        conectado.query('SELECT correo,passwd,tipousuario_idtipousuario,nombres,apellidos FROM usuarios WHERE correo = ? ', [user], (error, results) => {
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
                req.session.name = results[0].nombres;
                req.session.apellido = results[0].apellidos;
                req.session.tipeuser = results[0].tipousuario_idtipousuario;

                // if (rem != 'On') {
                //     req.session.cookie.expires = false;
                // }
                res.redirect('/usuario.html')
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
