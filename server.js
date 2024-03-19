const express = require('express');
const mysql = require('mysql');
const app =  express();
const bodyParser = require("body-parser");


const PORT = 3000; // Define el puerto en el que escuchará el servidor


//Configuracion conexion Mysql
const connection= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'star_wars'
});

//conectar ala base de datos
connection.connect((err)=>{
    if(err) throw err;
        console.log("Conexión a la Base de Datos Exitosa!");
});
//Tabla de Personajes
const dropTable = 'DROP TABLE IF EXISTS personaje';
const createTableQuery = `
CREATE TABLE personaje (
    id INT(11) PRIMARY KEY NOT NULL  AUTO_INCREMENT,
    name VARCHAR(255)  NOT NULL,
    birthyear VARCHAR(255) NOT NULL,
    specie VARCHAR(255) NOT NULL,
    height  VARCHAR(255) NOT NULL,
    mass  VARCHAR(255) NOT NULL,
    gender  VARCHAR(255) NOT NULL,
    haircolor  VARCHAR(255) NOT NULL,
    skincolor  VARCHAR(255) NOT NULL,
    homeworld  VARCHAR(255) NOT NULL,
    color  VARCHAR(255) NOT NULL,
    image  VARCHAR(255) NOT NULL
);
`;
const insertcharter = `
    INSERT INTO personaje (id, name, birthyear, specie, height, mass, gender, haircolor, skincolor, homeworld, color, image) VALUES
    (NULL, 'Luke Skywalker', '19BBY', 'Unknown', '172cm', '77kg', 'Male', 'Blond', 'Fair', 'Tatooine', 'green', 'Luke Skywalker.jpeg'),
    (NULL, 'C-3PO', '112BBY', 'Droid', '167cm', '75kg', 'n/a', 'n/a', 'Gold', 'Tatooine', '', 'C-3PO.jpeg'),
    (NULL, 'R2-D2', '33BBY', 'Droid', '96cm', '32kg', 'n/a', 'n/a', 'White, Blue', 'Naboo', '', 'R2-D2.jpg'),
    (NULL, 'Darth Vader', '41.9BBY', 'Unknown', '202cm', '136kg', 'Male', 'None', 'White', 'Tatooine', 'red', 'Dark-Vader.jpg'),
    (NULL, 'Leia Organa', '19BBY', 'Unknown', '150cm', '49kg', 'Female', 'Brown', 'Light', 'Aleraan', '', 'Leia-Organa.jpeg'),
    (NULL, 'Anakin Skywalker', '41.9BBY', 'Unknown', '188cm', '84kg', 'Male', 'Blond', 'Fair', 'Tatooine', 'blue', 'Anikin.jpeg');
`;

connection.query(dropTable , function(error, results, fields){
    if (error) throw error;
    console.log('Tabla de Personajes eliminada correctamente');
});
connection.query(createTableQuery, function (error, results, fields){
    if (error) throw error;
    console.log('Tabla de personajes creada correctamente');
});
connection.query(insertcharter, function  (error, results, fields){
    if (error) throw error;
    console.log('Datos del persomaje insertados correctamente');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//obtener todos los personajes
app.get( '/personajes', (req, res)=>{
    connection.query(`SELECT * FROM personaje`, function  (error, results, fields){
        if (error) throw error;
        res.json(results);
    });
});
//obtener un personaje personaje
app.get( '/personaje/:id', (req, res)=>{
    const id= req.params.id;

    connection.query(`SELECT * FROM personaje WHERE id = ${id}`, function  (error, results, fields){
        if (error) throw error;
        res.json(results);
    });
});
//Crear un personaje
app.post('/personaje', (req, res) =>{
    let { name, birthyear, species, height, mass, gender, haircolor, skincolor, homeworld, color } =  req.body;

    const insertQuery = `INSERT INTO personaje (name, birthyear, species, height, mass, gender, haircolor, skincolor, homeworld, color)`

    connection.query(insertQuery, (error, results, fields) => {
        if (error) throw error;
        const nuevoId = results.insertId;
        res.json({ mensaje: 'Nuevo personaje insertado correctamente', id: nuevoId});
    });
});
//Actualizar un Personaje
app.put('/personaje', (req, res) =>{
    let { id, name, birthyear, species, height, mass, gender, haircolor, skincolor, homeworld, color } =  req.body
    
    const updateQuery = `
        UPDATE personaje SET 
        name ='${name}',
        birthyear =  '${birthYear}',
        specie = '${specie}',
        height = '${height}',
        mass = '${mass}',
        gender =  '${gender}',
        haircolor =  '${hairColor}',
        skincolor = '${skinColor}',
        homeworld =  '${homeWorld}',
        color = '${color}'
        WHERE id = '${id}';
    `;
    connection.query(updateQuery, (error, results, fields) =>{
        if (error) throw error;
        res.json({ mensaje: 'Personaje actualizado correctamente'})
    });
}); 
//Eliminar Personaje
app.delete('/personaje/:id', (req, res) => {
    const id = req.params.id;

    const deleteQuery = `DELETE FROM personaje WHERE id='${id}'`;

    connection.query(deleteQuery , (err, result) => {
        if (error) throw error;
        console.log('Personaje eliminado correctamente');
        res.json({ mensaje : 'Personaje eliminado correctamente'});
    });
});
// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor API escuchando en el puerto ${PORT}`);
});