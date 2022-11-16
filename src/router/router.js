const express= require('express');
const router = express();
// libreria que utilizaremos para la encriptacion de los password
const bcrypt= require('bcrypt');
// libreria que utilizaremos para la generacion de nuesrto token
const jwt= require('jsonwebtoken');
//////archivo de coneccion
const mysqlConeccion = require('../database/database');
//////fin archivo de coneccion

///////ruta raiz
router.get('/', (req, res)=>{
    res.send('Pantalla Inicio de nuestra aplicacion');
});

//.Devuelve  todos los cursos
router.get('/cursos', verificarToken, (req, res)=>{
    jwt.verify(req.token, 'siliconKey', (error, valido)=>{
        if(error){
            res.sendStatus(403);
        }else{
        mysqlConeccion.query('select * from curso', (err, registro)=>{
            if(!err){

                res.json(registro);
            }else{
                console.log(err)
            }
        })
        }
    })
});

//.Devuelve los datos de un curso puntual
router.get('/cursos/:id_curso', verificarToken,(req, res)=>{
    const  { id_curso } = req.params;
    jwt.verify(req.token, 'siliconKey', (error, valido)=>{
        if(error){
            res.sendStatus(403);
        }else{
            mysqlConeccion.query('select * from curso where id_curso=?',[id_curso], (err, registros)=>{
                if(!err){
                    res.json(registros);
                }else{
                    console.log(err)
                }
            })
        }
    })
});

// 
//metodo para insertar cursos por el metodo POST
router.post('/cursos', verificarToken, (req, res)=>{
    const { nombre } =req.body
    jwt.verify(req.token, 'siliconKey', (error, valido)=>{
        if(error){
            res.sendStatus(403);
        }else{
            let query=`INSERT INTO curso (nombre) VALUES ('${nombre}')`;
            mysqlConeccion.query(query, (err, registros)=>{
                if(!err){
                    res.send('Se inserto correctamente nuestro dato: '+nombre);
                }else{
                    console.log(err)
                }
            })
        }
    })
});

//metodo para editar los datos de un curso en particular
router.put('/cursos/:id_curso', verificarToken, (req, res)=>{
    //asigna a id_curso el valor que recibe por el parametro 
    let id_curso  = req.params.id_curso;
    //asigna a nombre_nuevo_curso el valor que recibe  en el Body.nombre 
    let nombre_nuevo_curso=req.body.nombre  
    // res.send('El Id que editamos es : '+id_curso+' y cambiamos el nombre a : '+nombre_nuevo_curso);
    jwt.verify(req.token, 'siliconKey', (error, valido)=>{
        if(error){
            res.sendStatus(403);
        }else{
            let query=`UPDATE curso SET nombre='${nombre_nuevo_curso}' WHERE id_curso='${id_curso}'`;
            mysqlConeccion.query(query, (err, registros)=>{
                if(!err){
                    res.send('El Id que editamos es : '+id_curso+' y cambiamos el nombre a : '+nombre_nuevo_curso);
                }else{
                    console.log(err)
                }
            });
        }
    });
});

//metodo para elimiinar los datos de un curso en particular
router.delete('/cursos/:id_curso', (req, res)=>{
   //asigna a id_curso el valor que recibe por el parametro 
   let id_curso  = req.params.id_curso; 
   jwt.verify(req.token, 'siliconKey', (error, valido)=>{
    if(error){
        res.sendStatus(403);
    }else{
        let query=`DELETE FROM curso WHERE id_curso='${id_curso}'`;
        mysqlConeccion.query(query, (err, registros)=>{
                if(!err){
                    res.send('El Id que ELIMINAMOS es : '+registros);
                }else{
                    res.send('El error  es : '+ err); 
                }
            })
        }
    })
});
////////////// /////////////////
//////////////ALUMNOS //////////
////////////// /////////////////
//Devuelve a todos los alumnos activos de nuestra base de datos 
router.get('/alumnos', verificarToken, (req, res)=>{
    // res.send('Listado de alumnos');
    jwt.verify(req.token, 'siliconKey', (error, valido)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const query='select * from alumnos where estado="A"';
            mysqlConeccion.query(query, (err, rows)=>{
                if(!err){
                    res.json(rows);
                }else{
                    console.log(err)
                }
            })
        }
    });    
});

// Devolver los datos de un alumno puntual que recibamos el ID
router.get('/alumnos/:id_alumno', verificarToken, (req, res)=>{
    const  parametro  = req.params.id_alumno;
    if(esNumero(parametro)){
        res.json(
            {
                status: false,
                mensaje:"El parametro que se espera tiene ser un numero entero"
            });
    }else{
        jwt.verify(req.token, 'siliconKey', (error, valido)=>{
            if(error){
                // console.log(' entra aca')
                res.sendStatus(403);
            }else{
                mysqlConeccion.query('select * from alumnos where id_alumno=?',[parametro], (err, rows)=>{
                    if(!err){
                        if(rows.length!=0){
                            res.json(rows);
                        }else{
                            res.json(
                                {
                                    status: false,
                                    mensaje:"El ID del alumno no existe en la base de datos."
                                });
                        }    
                    }else{
                        res.json(
                        {
                            status: false,
                            mensaje:"Error en el servidor."
                        });
                    }
                });
                
            }
        });
    }
})
//metodo para insertar alumnos a travez del metodo POST
router.post('/alumnos', verificarToken, (req, res)=>{
    console.log(req.body);
    const { apellido, nombre, dni, fecha_nacimiento, sexo } = req.body
    jwt.verify(req.token, 'siliconKey', (error, valido)=>{
        if(error){
            res.sendStatus(403);
        }else{
            let query=`INSERT INTO alumnos (apellido, nombre, dni, sexo,fecha_nacimiento, estado, fecha_creacion) VALUES ('${apellido}','${nombre}','${dni}','${sexo}','${fecha_nacimiento}', 'A', NOW())`;
            mysqlConeccion.query(query, (err, registros)=>{
                if(!err){
                    res.send('Se inserto correctamente nuestro alumno: '+apellido+' '+nombre);
                }else{
                    console.log(err)
                    res.send('El error es: '+err);
                }
            })
        }
    })
    
});

//metodo para elimiinar los datos de un alumno en particular
router.delete('/alumnos/:id',verificarToken ,(req, res)=>{
    //asigna a id_alumno el valor que recibe por el parametro 
    let id_alumno  = req.params.id; 
    jwt.verify(req.token, 'siliconKey', (error, valido)=>{
        if(error){
            res.sendStatus(403);
        }else{
            let query=`DELETE FROM alumnos WHERE id_alumno='${id_alumno}'`;
            mysqlConeccion.query(query, (err, registros)=>{
                if(!err){
                    res.send('El alumno que ELIMINAMOS es ID : '+id_alumno);
                }else{
                    res.send('El error  es : '+ err); 
                }
            })
        }
    })
 });

//metodo para editar los datos de un alumno en particular
router.put('/alumnos/:id',verificarToken , (req, res)=>{
    //asigna a id_curso el valor que recibe por el parametro 
    let id_alumno  = req.params.id;
    //asigna el valor que recibe  en el Body 
    const { apellido, nombre, dni , fecha_nacimiento, sexo, domicilio, estado_civil } =req.body  
    jwt.verify(req.token, 'siliconKey', (error, valido)=>{
        if(error){
            
            res.sendStatus(403);
        }else{
            let query=`UPDATE alumnos SET apellido='${apellido}', nombre='${nombre}', dni='${dni}', fecha_nacimiento='${fecha_nacimiento}', estado_civil='${estado_civil}', sexo='${sexo}', domicilio='${domicilio}', fecha_modificacion=NOW() WHERE id_alumno='${id_alumno}'`;
            mysqlConeccion.query(query, (err, registros)=>{
                if(!err){
                    res.send('El Id que editamos es : '+id_alumno+' y cambiamos muchos campos!!');
                }else{
                    console.log(err)
                }
            })
        }
    })
});
////////////// /////////////////
//////////////Usuarios /////////
////////////// /////////////////
router.get('/usuarios', verificarToken, (req, res)=>{

        jwt.verify(req.token, 'siliconKey', (error, valido)=>{
        if(error){
            res.sendStatus(403);
        }else{
            mysqlConeccion.query('select * from usuarios', (err, registro)=>{
        if(!err){
            // console.log(registro.length)
            res.json(registro);
        }else{
            console.log(err)
        }
    })
}

})
    
});

////////////login de usuarios //////////////
router.post('/login', (req, res)=>{
    const {username, password} =req.body
    if(username!=undefined && password!=undefined){
        mysqlConeccion.query('select u.id, u.username,  u.password,  u.email, u.apellido_nombre from usuarios u where u.estado="A" AND username=?',[username], (err, rows)=>{
            if(!err){
                if(rows.length!=0){
                    const bcryptPassword = bcrypt.compareSync(password, rows[0].password);
                    if(bcryptPassword){
                        jwt.sign({rows}, 'siliconKey', {expiresIn:'1200s'},(err, token)=>{
                            res.json(
                                {
                                    status: true,
                                    datos: rows,
                                    token: token
                                });
                        }) 
                    }else{
                        res.json(
                            {
                                status: false,
                                mensaje:"La Contraseña es incorrecta"
                            });
                    }
                }else{
                    res.json(
                        {
                            status: false,
                            mensaje:"El usuario no existe "
                        });
                    
                }
            }else{
                res.json(
                    {
                        status: false,
                        mensaje:"Error en el servidor"
                    });
                
            }
        });
    }else{
        res.json({
            status: false,
            mensaje:"Faltan completar datos"
        });
    }
});

////////////login de usuarios //////////////
router.post('/registro', async(req, res)=>{
    const {username, password, email, apellido_nombre} =req.body
    let hash = bcrypt.hashSync(password,10);
    let query=`INSERT INTO usuarios (username, password, email, apellido_nombre, fecha_creacion) VALUES ('${username}','${hash}','${email}','${apellido_nombre}',NOW())`;
    mysqlConeccion.query(query, (err, registros)=>{
        if(!err){
            res.send('Se inserto correctamente nuestro usuario: '+username);
        }else{
            res.send('Ocurrio un error desde el servidor'+err);
        }
    })
});
// //////////////////////Nuestras funciones /////////
function verificarToken(req, res, next){
    const BearerHeader= req.headers['authorization']
    if(typeof BearerHeader!=='undefined'){
        const bearerToken= BearerHeader.split(" ")[1]
        req.token=bearerToken;
        next();
    }else{
         res.sendStatus(403);
        // console.log('Ocurrio un error')
    }
}

function esNumero(parametro) {
    if(!isNaN(parseInt(parametro))){
        return false
    } else {
        return true
    }
}

module.exports = router;

