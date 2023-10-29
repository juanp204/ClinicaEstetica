const express = require('express');
const router = express.Router();
const path = require('path');
const conectado = require('../database/mysql');
const session = require('express-session');
const multer = require('multer');

const route = __dirname.slice(0, -6);
console.log(route);

// ------- html
const rootdir = __dirname.slice(0, -6)
console.log(rootdir)

function generateCalendar() {
    const calendarData = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let currentDay = 1;
    let week = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
        if (dayOfWeek === 0 && day !== 1) {
            calendarData.push(week);
            week = [];
        }
        week.push({ date: day, month: currentMonth });
        currentDay++;
    }

    if (week.length > 0) {
        calendarData.push(week);
    }

    return calendarData;
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(rootdir, 'public/images/')); // Directorio donde se almacenarán los archivos subidos
    },
    filename: (req, file, cb) => {
        // Personaliza el nombre del archivo aquí
        const customFileName = req.body.titulo.replaceAll(' ', '_') + '.jpg'; // El nombre personalizado que proporcionas desde el formulario

        // Utiliza el nombre personalizado o un nombre predeterminado si no se proporciona
        const fileName = customFileName || file.originalname;

        cb(null, fileName);
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Personaliza la lógica de filtrado aquí
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jgp') {
            // Acepta solo archivos JPEG y PNG
            cb(null, true); // Acepta el archivo
        } else {
            cb(null, false); // Rechaza el archivo
        }
    },
    overwrite: true // Habilita la opción de sobrescritura de archivos
});


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

router.get('/editar/:id', async (req, res) => {

    conectado.query('SELECT * FROM servicios where idtipocita = ?', [req.params.id], (error, results) => {
        if (error || results.length == 0) {

            res.redirect('/admin.html')

        }
        else {
            res.render(path.join(rootdir, 'views/editar.html'), {
                servicio: results
            });
        }
    });


});

router.get('/editar', async (req, res) => {


    res.render(path.join(rootdir, 'views/editar.html'), {
        servicio: [{
            idtipocita: 0,
            titulo: '',
            descripcion: '',
            imagen: ''
        }]
    });


});

router.post('/editar', upload.single('file'), async (req, res) => {

    console.log(req.body.id);

    if (req.body.id > 0 && req.body.titulo.length > 0) {
        conectado.query(`UPDATE SERVICIOS SET titulo = ?, descripcion = ?, imagen = ? WHERE idtipocita = ${req.body.id}`, [req.body.titulo, req.body.desc, `/images/${req.body.titulo.replaceAll(' ', '_')}.jpg`], (error, results) => {
            if (error) {
                console.error(error);
            }
            res.redirect('/admin.html');
        });

    }
    else if (req.body.id == 0 && req.body.titulo.length > 0) {
        conectado.query('INSERT INTO servicios (titulo, descripcion, imagen) VALUES (?, ?, ?)', [req.body.titulo, req.body.desc, `/images/${req.body.titulo.replaceAll(' ', '_')}.jpg`], (error, results) => {
            if (error) {
                console.error(error);
            }
            res.redirect('/admin.html');
        }
        );

    }
    else {
        res.redirect('/admin.html')
    }
});

router.get('/eliminar', async (req, res) => {

    conectado.query('DELETE FROM servicios WHERE idtipocita = ?', [req.query.idser], (error, results) => {
        if (error) {
            console.log(error)
        }
        res.redirect('/admin.html')
    });


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

    conectado.query('SELECT * FROM servicios', (error, results) => {
        if (error || results.length == 0) {
            console.log('error')
            res.render(path.join(rootdir, 'views/admin.html'), {
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
                servicios: results
            });
        }
    });

    //res.render(path.join(rootdir, 'views/Servicios.html'))

});

router.get('/admin', async (req, res) => {

    res.redirect('/admin.html')

});

router.get('/agenda', async (req, res) => {

    if (!req.session.loggedin) {
        res.redirect('/')
    }
    else {
        conectado.query('SELECT * FROM cita INNER JOIN servicios ON cita.tipocita_idtipocita = servicios.idtipocita WHERE usuarios_idusuarios = ?', [req.session.iduser], (error, results) => {

            console.log(error)
            if (error || results.length == 0) {
                console.log('error')
                res.render(path.join(rootdir, 'views/agenda.html'), {
                    calendarData: generateCalendar(),
                    servicio: [],
                    alert: true
                });

            }
            else {
                res.render(path.join(rootdir, 'views/agenda.html'), {
                    calendarData: generateCalendar(),
                    servicio: results
                });
            }
        });
    }



});

router.get('/eventos', async (req, res) => {
    const year = req.query.year
    const month = req.query.month
    conectado.query('SELECT * FROM cita WHERE usuarios_idusuarios = ?', [req.session.iduser], (error, results) => {

        if (error || results.length == 0) {
            console.log('error')
            res.render(path.join(rootdir, 'views/agenda.html'), {
                calendarData: generateCalendar(),
                eventos: results,
                alert: true
            });

        }
        else {
            res.render(path.join(rootdir, 'views/admin.html'), {
                calendarData: generateCalendar(),
                eventos: results
            });
        }
    });




});

router.post('/agendar', async (req, res) => {
    const cita = req.body.select;
    const fecha = req.body.time;
    const id = req.session.iduser;
    console.log(fecha)
    const mensaje = req.body.message;
    conectado.query(`INSERT INTO cita(FECHA,tipocita_idtipocita,usuarios_idusuarios,mensaje) VALUES (STR_TO_DATE('${fecha}', '%Y-%m-%dT%H:%i'),${cita},${id},'${mensaje}')`, async (error, results) => {
        console.log(error)
        res.redirect('/usuario.html')
    })
});

router.get('/servicios.html', async (req, res) => {
    var login, hreflog;

    if (req.session.loggedin) {
        login = 'Perfil';
        hreflog = '/usuario.html';

        conectado.query('SELECT * FROM servicios', (error, results) => {

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

    } else {
        login = 'Login';
        hreflog = '/login.html';

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

    }


    //res.render(path.join(rootdir, 'views/Servicios.html'))

});

/* router.get('/agregar', async (req, res) => {
    //res.render(path.join(route,'views/index.html'));
    //res.sendFile('/views/servicios.html', { root: rootdir })

    var login, hreflog;

    if (req.session.loggedin) {
        login = 'Perfil';
        hreflog = '/usuario.html';
    } else {
        login = 'Login';
        hreflog = '/login.html';
    }
    console.log(req.query.id ? true : false)
    if (req.query.id ? true : false) {
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

    }
    else {
        res.redirect('/Servicios.html#sec-9758')
    }


    //res.render(path.join(rootdir, 'views/Servicios.html'))

}); */

router.get('/usuario.html', async (req, res) => {
    console.log(req.session)

    var login, hreflog;

    if (req.session.tipeuser == '1') {
        login = 'admin';
        hreflog = '/admin.html';
    }
    else if (req.session.tipeuser == '2') {
        login = 'perfil';
        hreflog = '/usuario.html';
    }

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
    if (!req.session.loggedin) {
        res.redirect('/')
    }
    else {//if (req.query.id ? true : false) {

        conectado.query('SELECT idtipocita,titulo FROM servicios', async (error, results) => {
            if (results.length == 0) {
                res.render(path.join(rootdir, 'views/appointment.html'), {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "no hay servicios actualmente",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false
                });
            }
            else {
                res.render(path.join(rootdir, 'views/appointment.html'), {
                    servicios: results
                });
            }
        })
    }
    /* else {
        res.render(path.join(rootdir, 'views/Appointment.html')-{

        })
    } */

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
});

router.post('/auth', async (req, res) => {
    const user_CK = req.session.user;
    const id = req.session.tipeuser;
    const user = req.body.username;
    const pass = req.body.password;
    const rem = req.body.remember;
    console.log(user)
    if (user != "" && pass != "") {
        conectado.query('SELECT * FROM usuarios WHERE correo = ? ', [user], (error, results) => {
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
                req.session.iduser = results[0].idusuarios;
                req.session.tipeuser = results[0].tipousuario_idtipousuario;

                if (rem != 'On') {
                    req.session.cookie.expires = false;
                }
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
