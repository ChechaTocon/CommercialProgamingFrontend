//todas las librarias y paquetes que se requieren
const express = require('express');
const bodyParser = require('body-parser');
const puerto = process.env.PORT || 8080
const cors = require("cors")

//instancia del servidor de express
const app = express();

app.use(cors())
app.options('*', cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(process.cwd() + "/prod-build/frontend/movies/dist/movies/"));
//le indicamos que si la dirección lleva /api, que el encargado de llevar esas rutas se encuntra en
// la carpeta de rutas y es el archivo api.js, el apiRouter.

app.get('/*', (req, res) => {
    res.sendFile(process.cwd() + "/prod-build/frontend/movies/dist/movies/index.html")
});

app.listen(puerto, () => {
    console.log("Servidor Iniciado en el puerto"+puerto);
});   