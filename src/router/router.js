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
    res.send('');
});

//.Devuelve  todos los cursos
router.get('/cursos', verificarToken, (req, res)=>{
    jwt.verify(req.token, 'siliconKey', (error, valido)=>{
        if(error){
            res.sendStatus(403);
        }else{
        mysqlConeccion.query('select * from curso order by estado, nombre', (err, registro)=>{
            if(!err){
                res.json(registro);
            }else{
                console.log(err)
            }
        })
        }
    })
});


router.put('/cambioestadoalumno/:id', (req, res)=>{
     let id  = req.params.id;
     let estado=req.body.estado  
     
     let query=`UPDATE alumnos SET estado='${estado}' WHERE id_alumno='${id}'`;
     mysqlConeccion.query(query, (err, registros)=>{
        if(!err){
            res.json({
                status: true,
                mensaje:"El estado del alumno se cambio correctamente"
            });
        }else{
            res.json({
                status: false,
                mensaje:"Hubo un error"
            });
        }
    })
    
});

router.put('/altacurso/:id', (req, res)=>{
    let id  = req.params.id;
    let query=`UPDATE curso SET estado='A' WHERE id_curso='${id}'`;

     mysqlConeccion.query(query, (err, registros)=>{
        if(!err){
            res.json({
                status: true,
                mensaje:"El curso se dio de Alta correctamente"
            });
        }else{
           res.json({
                status: false,
                mensaje:"Hubo un error"
            });
        }
    })
    
});

router.get('/cursos/:id_curso',(req, res)=>{

        const  { id_curso } = req.params;
                mysqlConeccion.query('select * from curso where id_curso=?',[id_curso], (err, registros)=>{
                    if(!err){
                        res.json(registros);
                    }else{
                        console.log(err)
                    }
                })
       
    });

router.post('/cursos', (req, res)=>{
    const { nombre } =req.body
     console.log(req.body);
            let query=`INSERT INTO curso (nombre, estado) VALUES ('${nombre}', 'A')`;
            mysqlConeccion.query(query, (err, registros)=>{
                if(!err){
                    res.json({
                        status: true,
                        mensaje:"El curso se dio de Alta correctamente"
                    });
                    // res.send('Se inserto correctamente nuestro dato: '+nombre);
                }else{
                    console.log(err)
                }
            })
      
    
});

//metodo para buscar un cursos por su descripcion
router.get('/busqueda_cursos', (req, res)=>{
    const nombre =req.body.nombre
    console.log(nombre)
    let query;
    if(nombre){
         console.log('hola ingresa a la primer  condicion')
        query=`SELECT concat_ws(' ', a.apellido, a.nombre) alumno, c.nombre curso 
        FROM proyecto_silicon.alumnos a 
        inner join alumno_curso ac on ac.id_alumno=a.id_alumno 
        inner join curso c on c.id_curso=ac.id_curso  where c.nombre like '%${nombre}%'`;
    }else{
        console.log('hola ingresa en la segunda condicion')
        query=`SELECT concat_ws(' ', a.apellido, a.nombre) alumno, c.nombre curso 
        FROM proyecto_silicon.alumnos a 
        inner join alumno_curso ac on ac.id_alumno=a.id_alumno 
        inner join curso c on c.id_curso=ac.id_curso `;
    }
   

    mysqlConeccion.query(query, (err, registros)=>{
        if(!err){
            res.json(
                {
                    status: true,
                    registros:registros
                });
           
        }else{
            // console.log(err)
            res.send('Hubo un error en el servidor');
        }
    })
        
    
});

router.put('/cursos/:id_curso', (req, res)=>{
    //asigna a id_curso el valor que recibe por el parametro 
    let id_curso  = req.params.id_curso;
    //asigna a nombre_nuevo_curso el valor que recibe  en el Body.nombre 
    let nombre_nuevo_curso=req.body.nombre  
        
        let query=`UPDATE curso SET nombre='${nombre_nuevo_curso}' WHERE id_curso='${id_curso}'`;
        mysqlConeccion.query(query, (err, registros)=>{
            if(!err){
                res.send('El Id que editamos es : '+id_curso+' y cambiamos el nombre a : '+nombre_nuevo_curso);
            }else{
                console.log(err)
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
    jwt.verify(req.token, 'siliconKey', (error)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const query='select * from alumnos';
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


router.post('/buscar_alumnos', (req, res)=>{
    
    let {apellido, dni, sexo, nombre }=req.body  

            var query='select * from alumnos where 1 ';
            if(apellido){
                query=query +`AND apellido like '%${apellido}%'`;
            }
            if(nombre){
                query=query +`AND nombre like '%${nombre}%'`;
            }

            if(dni){
                query=query +`AND dni like '%${dni}%'`;
            }

            if(sexo){
                query=query +`AND sexo = '${sexo}'`;
            }
            // console.log(query);

            mysqlConeccion.query(query, (err, rows)=>{
                if(!err){
                    // console.log(rows);
                    res.json(rows);
                }else{
                    console.log(err)
                }
            })
        
        
});

router.get('/alumnos_cantidad_cursos', verificarToken, (req, res)=>{
    // res.send('Listado de alumnos');
    jwt.verify(req.token, 'siliconKey', (error, valido)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const query='SELECT T.id_alumno, T.alumno, T.cantidad_cursos, T.sexo from (SELECT A.id_alumno, CONCAT_WS(" ", A.apellido, A.nombre ) alumno, sexo, COUNT(id_alumno_curso) cantidad_cursos FROM alumnos as A inner join alumno_curso as AC ON AC.id_alumno=A.id_alumno LEFT join curso C ON C.id_curso=AC.id_curso where estado = "A" GROUP by id_alumno) AS T order by T.cantidad_cursos DESC';
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

// // Devolver los datos de un alumno puntual que recibamos el ID
// router.get('/alumnos/:id_alumno', verificarToken, (req, res)=>{
//     const  parametro  = req.params.id_alumno;
//     if(esNumero(parametro)){
//         res.json(
//             {
//                 status: false,
//                 mensaje:"El parametro que se espera tiene ser un numero entero"
//             });
//     }else{
//         jwt.verify(req.token, 'siliconKey', (error, valido)=>{
//             if(error){
//                 // console.log(' entra aca')
//                 res.sendStatus(403);
//             }else{
//                 mysqlConeccion.query('select * from alumnos where id_alumno=?',[parametro], (err, rows)=>{
//                     if(!err){
//                         if(rows.length!=0){
//                             res.json(rows);
//                         }else{
//                             res.json(
//                                 {
//                                     status: false,
//                                     mensaje:"El ID del alumno no existe en la base de datos."
//                                 });
//                         }    
//                     }else{
//                         res.json(
//                         {
//                             status: false,
//                             mensaje:"Error en el servidor."
//                         });
//                     }
//                 });
                
//             }
//         });
//     }
// })

router.get('/alumnos/:id_alumno', (req, res)=>{
    const  parametro  = req.params.id_alumno;
    if(esNumero(parametro)){
        res.json(
            {
                status: false,
                mensaje:"El parametro que se espera tiene ser un numero entero"
            });
    }else{
                mysqlConeccion.query('select *, DATE_FORMAT(fecha_nacimiento, "%Y-%m-%d") as fecha_formateada from alumnos where id_alumno=?',[parametro], (err, rows)=>{
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
})
//metodo para insertar alumnos a travez del metodo POST
router.post('/alumnos', (req, res)=>{
    const { apellido, nombre, dni, fecha_nacimiento, sexo, domicilio , estado_civil } = req.body
    
            let query=`INSERT INTO alumnos (apellido, nombre, dni, sexo,fecha_nacimiento, estado, fecha_creacion, domicilio, estado_civil) VALUES ('${apellido}','${nombre}','${dni}','${sexo}','${fecha_nacimiento}', 'A', NOW(),'${domicilio}','${estado_civil}')`;
            mysqlConeccion.query(query, (err, registros)=>{
                if(!err){
                    res.send('Se inserto correctamente nuestro alumno: '+apellido+' '+nombre);
                }else{
                    console.log(err)
                    res.send('El error es: '+err);
                }
            })
       
    
});



//metodo para insertar alumnos relacionados a un curso
router.post('/alumno_curso', (req, res)=>{
    console.log(req.body);
    const { id_alumno, id_curso } = req.body
    mysqlConeccion.query('select * from alumno_curso where id_alumno=? AND id_curso=?',[id_alumno, id_curso], (err, rows)=>{
        if(!err){
            if(rows.length!=0){
                res.json(
                    {
                        status: false,
                        mensaje:"El alumno ya se encuentra en este curso."
                    });
                
            }else{
                let query=`INSERT INTO alumno_curso (id_alumno, id_curso) VALUES ('${id_alumno}','${id_curso}')`;
                mysqlConeccion.query(query, (err, registros)=>{
                    if(!err){
                        res.send('Se inserto correctamente nuestro alumno: '+id_alumno+'en el curso :'+id_curso);
                    }else{
                        console.log(err)
                        res.send('El error es: '+err);
                    }
                })
            }
        }else{
            res.send('El error es: '+err);
        }
        });  
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
router.put('/alumnos/:id' , (req, res)=>{
    //asigna a id_curso el valor que recibe por el parametro 
    let id_alumno  = req.params.id;
    const { apellido, nombre, dni , fecha_nacimiento, sexo, domicilio, estado_civil } =req.body  
    console.log(req.body)
    let query=`UPDATE alumnos SET apellido='${apellido}', nombre='${nombre}', dni='${dni}', estado_civil='${estado_civil}', sexo='${sexo}', domicilio='${domicilio}', fecha_modificacion=NOW() WHERE id_alumno='${id_alumno}'`;
    mysqlConeccion.query(query, (err, registros)=>{
        if(!err){
            res.send('El Id que editamos es : '+id_alumno+' y cambiamos muchos campos!!');
        }else{
            console.log(err)
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
                        jwt.sign({rows}, 'siliconKey' ,(err, token)=>{
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
    
// aca  consulto si existe ya ese nombre en la bd
    let query=`INSERT INTO usuarios (username, password, email, apellido_nombre, fecha_creacion) VALUES ('${username}','${hash}','${email}','${apellido_nombre}',NOW())`;
    mysqlConeccion.query(query, (err, registros)=>{
        if(!err){
            res.json({
                status: true,
                mensaje:"El usuario se creo correctamente"
            });
        }else{
            res.json({
                status: false,
                mensaje:"Hubo un error en el servidor.La accion no se realizo"
            });
            // res.send('Ocurrio un error desde el servidor'+err);
        }
    })
});

router.put('/resetpassword/:id', (req, res)=>{
    // asigna a id_usuario el valor que recibe por el parametro 
     let id  = req.params.id;
    // //asigna el valor que recibe  en el Body 
     const { password } =req.body 
     let hash = bcrypt.hashSync(password,10); 
    //  generamos la query de modificacion del password
     let query=`UPDATE usuarios SET password='${hash}' WHERE id='${id}'`;
     mysqlConeccion.query(query, (err, registros)=>{
        if(!err){
            res.send('El Id que editamos es : '+id+' y cambiamos el password! Muchas gracias!');
        }else{
            console.log(err)
        }
    })

    
});


router.put('/bajausuario/:id', (req, res)=>{
    // asigna a id_usuario el valor que recibe por el parametro 
     let id  = req.params.id;
     let query=`UPDATE usuarios SET estado='B' WHERE id='${id}'`;
     mysqlConeccion.query(query, (err, registros)=>{
        if(!err){
            res.json({
                status: true,
                mensaje:"El usuario se dio de BAJA correctamente"
            });
        }else{
            console.log(err)
        }
    })
    
});

router.put('/altausuario/:id', (req, res)=>{
    // asigna a id_usuario el valor que recibe por el parametro 
     let id  = req.params.id;
     let query=`UPDATE usuarios SET estado='A' WHERE id='${id}'`;
     mysqlConeccion.query(query, (err, registros)=>{
        if(!err){
            res.json({
                status: true,
                mensaje:"El usuario se dio de Alta correctamente"
            });
        }else{
            console.log(err)
        }
    })
    
});


//////////////////////////////
/////////////inscripciones///
//////////////////////////////

router.get('/inscripciones/:id_alumno', (req, res)=>{
    const  parametro  = req.params.id_alumno;
    if(esNumero(parametro)){
        res.json(
            {
                status: false,
                mensaje:"El parametro que se espera tiene ser un numero entero"
            });
    }else{
                mysqlConeccion.query('select i.*, DATE_FORMAT(i.fecha_hora_creacion, "%d-%m-%Y %H:%i") as fecha_formateada, c.nombre curso FROM inscripciones AS i INNER JOIN curso AS c ON c.id_curso=i.id_curso WHERE id_alumno=?',[parametro], (err, rows)=>{
                    if(!err){
                        if(rows.length!=0){
                            res.json(
                                {
                                    status: true,
                                    registros:rows
                                });
                            
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
})


router.get('/cursosSinAsignar/:id_alumno',(req, res)=>{

    const  { id_alumno } = req.params;
            mysqlConeccion.query('SELECT id_curso, nombre FROM curso WHERE id_curso NOT IN (SELECT id_curso FROM inscripciones WHERE id_alumno = ?)',[id_alumno], (err, registros)=>{
                if(!err){
                    res.json(registros);
                }else{
                    console.log(err)
                }
            })
   
});

router.post('/inscripcion_alumnos', (req, res)=>{
    const { id_alumno, id_curso, descripcion } =req.body
    console.log(req.body)
            let query=`INSERT INTO inscripciones (id_alumno, id_curso, estado, descripcion, fecha_hora_creacion ) VALUES ('${id_alumno}','${id_curso}', 'A','${descripcion}', NOW())`;
            mysqlConeccion.query(query, (err, registros)=>{
                if(!err){
                    res.json({
                        status: true,
                        mensaje:"La inscripcion se realizo correctamente"
                    });
                    // res.send('Se inserto correctamente nuestro dato: '+nombre);
                }else{
                    res.json({
                        status: false,
                        mensaje:"La inscripcion NO se realizo."
                    });
                
                }
            })
      
    
});
// 

//////////////////////////////
/////////////  fin inscripciones///
//////////////////////////////
////////////// /////////////////
// //////////////////////Nuestras funciones /////////
function verificarToken(req, res, next){
    // console.log('controlo lo que llega', req.headers)
    const BearerHeader= req.headers['authorization']
    if(typeof BearerHeader!=='undefined'){
        const bearerToken= BearerHeader.split(" ")[1]
        req.token=bearerToken;
        next();
    }else{
         res.send('Para consultar las apis debe estar autenticado.Gracias');
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

