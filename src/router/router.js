const express= require('express');
const router = express();

//////archivo de coneccion
const mysqlConeccion = require('../database/database');
//////archivo de coneccion
router.get('/', (req, res)=>{
    res.send('Pantalla Inicio de nuestra aplicacion');
});

//.Devuelve  todos los cursos
router.get('/cursos', (req, res)=>{
    mysqlConeccion.query('select * from curso', (err, registro)=>{
        if(!err){
            res.json(registro);
        }else{
            console.log(err)
        }
    })
});

//.Devuelve los datos de un curso puntual
router.get('/cursos/:id_curso', (req, res)=>{
    const  { id_curso } = req.params;
    mysqlConeccion.query('select * from curso where id_curso=?',[id_curso], (err, registros)=>{
        if(!err){
            res.json(registros);
        }else{
            console.log(err)
        }
    })
});

// 
//metodo para insertar cursos por el metodo POST
router.post('/cursos', (req, res)=>{
    const { nombre } =req.body
    let query=`INSERT INTO curso (nombre) VALUES ('${nombre}')`;
    mysqlConeccion.query(query, (err, registros)=>{
        if(!err){
            res.send('Se inserto correctamente nuestro dato: '+nombre);
        }else{
            console.log(err)
        }
    })
});

//metodo para editar los datos de un curso en particular
router.put('/cursos/:id_curso', (req, res)=>{
    //asigna a id_curso el valor que recibe por el parametro 
    let id_curso  = req.params.id_curso;
    //asigna a nombre_nuevo_curso el valor que recibe  en el Body.nombre 
    let nombre_nuevo_curso=req.body.nombre  
    // res.send('El Id que editamos es : '+id_curso+' y cambiamos el nombre a : '+nombre_nuevo_curso);
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
   let query=`DELETE FROM curso WHERE id_curso='${id_curso}'`;
   mysqlConeccion.query(query, (err, registros)=>{
        if(!err){
            res.send('El Id que ELIMINAMOS es : '+registros);
        }else{
            res.send('El error  es : '+ err); 
        }
    })
});
////////////// /////////////////
//////////////ALUMNOS //////////
////////////// /////////////////
//Devuelve a todos los alumnos activos de nuestra base de datos 
router.get('/alumnos', (req, res)=>{
    // res.send('Listado de alumnos');
    const query='select * from alumnos where estado="A"';
    mysqlConeccion.query(query, (err, rows)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err)
        }
    })
});

// Devolver los datos de un alumno puntual que recibamos el ID
router.get('/alumnos/:id_alumno', (req, res)=>{
    const  { id_alumno } = req.params;
    mysqlConeccion.query('select * from alumnos where id_alumno=?',[id_alumno], (err, rows)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err)
        }
    });
})
//metodo para insertar alumnos a travez del metodo POST
router.post('/alumnos', (req, res)=>{
    console.log(req.body);
    const { apellido, nombre, dni, fecha_nacimiento, sexo } = req.body

    let query=`INSERT INTO alumnos (apellido, nombre, dni, sexo,fecha_nacimiento, estado, fecha_creacion) VALUES ('${apellido}','${nombre}','${dni}','${sexo}','${fecha_nacimiento}', 'A', NOW())`;
    mysqlConeccion.query(query, (err, registros)=>{
        if(!err){
            res.send('Se inserto correctamente nuestro alumno: '+apellido+' '+nombre);
        }else{
            console.log(err)
            res.send('El error es: '+err);
        }
    })
    // res.send('Llega el mensaje');
});

//metodo para elimiinar los datos de un alumno en particular
router.delete('/alumnos/:id', (req, res)=>{
    //asigna a id_alumno el valor que recibe por el parametro 
    let id_alumno  = req.params.id; 
    let query=`DELETE FROM alumnos WHERE id_alumno='${id_alumno}'`;
    mysqlConeccion.query(query, (err, registros)=>{
         if(!err){
             res.send('El alumno que ELIMINAMOS es ID : '+id_alumno);
         }else{
             res.send('El error  es : '+ err); 
         }
     })
 });

//metodo para editar los datos de un alumno en particular
router.put('/alumnos/:id', (req, res)=>{
    //asigna a id_curso el valor que recibe por el parametro 
    let id_alumno  = req.params.id;
    //asigna el valor que recibe  en el Body 
    const { apellido, nombre, dni , fecha_nacimiento, sexo, domicilio, estado_civil } =req.body  
    
    let query=`UPDATE alumnos SET apellido='${apellido}', nombre='${nombre}', dni='${dni}', fecha_nacimiento='${fecha_nacimiento}', estado_civil='${estado_civil}', sexo='${sexo}', domicilio='${domicilio}', fecha_modificacion=NOW() WHERE id_alumno='${id_alumno}'`;
    mysqlConeccion.query(query, (err, registros)=>{
        if(!err){
            res.send('El Id que editamos es : '+id_alumno+' y cambiamos muchos campos!!');
        }else{
            console.log(err)
        }
    });
});
////////////// /////////////////
//////////////Usuarios /////////
////////////// /////////////////
router.get('/usuarios',  (req, res)=>{
    mysqlConeccion.query('select * from usuarios', (err, registro)=>{
        if(!err){
            res.json(registro);
        }else{
            console.log(err)
        }
    })
});

module.exports = router;

