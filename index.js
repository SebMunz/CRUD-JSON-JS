"use strict"
// Constantes de uso
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

//middleware de express para usar json
app.use(express.json());

/* leer json
le damos la ruta a leer y la codificación. Luego retorna 'data' (el archivo) como JSON parseado
*/

const getAnimes = () => {
    const data = fs.readFileSync('./assets/anime.json', 'utf-8');
    return JSON.parse(data);
}

/* escribir json
recibe el parámetro animes, lo escribe con fs, usamos stringify para que convierta 'animes' en un string JSON.
Además, le decimos con null que no cambiaremos ningún dato y le damos 2 para la indentación
*/
const saveAnimes = (animes) => {
    fs.writeFileSync('./assets/anime.json', JSON.stringify(animes, null, 2));
}

//CRUD
// listar todos los datos
app.get('/animes', (req,res) => {
    const animes = getAnimes();
    res.json(animes)
})

// listar por ID
app.get('/animes/:id', (req,res) => {
    const animes = getAnimes();
    const anime = animes[req.params.id]; //anime = animes[request parámetro id]; básicamente anime es el ID
    if (anime) {
        res.json(anime);
    } else {
        res.status(404).send('Anime no encontrado por ID');
    }
});

// crear nuevo
app.post('/animes', (req,res) => {
    const animes = getAnimes();
    const newID = (Object.keys(animes).length + 1).toString(); //contamos las llaves en total y le sumamos 1
    animes[newID] = req.body;
    saveAnimes(animes);
    res.status(201).send(`Anime creado con ID ${newID}`);
});

// actualizar por ID
app.put('/animes/:id', (req,res) => {
    const animes = getAnimes();
    const anime = [req.params.id];
    if (anime) {
        animes[req.params.id] = req.body;
        saveAnimes(animes);
        res.send('Anime actualizado');
    } else {
        res.status(404).send('Anime no encontrado');
    }
});

// borrar por ID
app.delete('/animes/:id', (req,res) => {
    const animes = getAnimes();
    if (animes[req.params.id]) {
        delete animes[req.params.id];
        saveAnimes(animes);
        res.send('Anime eliminado exitosamente');
    } else {
        res.status(404).send('Anime no encontrado');
    }
})

//SERVIDOR
app.listen(PORT, () => {
    console.log(`Escuchando en el puerto... ${PORT}`);
})