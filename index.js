// podríamos tmb importarlo como función y ejecutarla, pero así funciona xq los módulos se importan una vez y luego se catchean
require("./mongo");

const express = require("express");
const cors = require("cors");
const app = express();

const Quote = require("./models/Quote");
const notFound = require("./middleware/notFound");
const handleError = require("./middleware/handleError");

// MIDLEWARES
// cors: accesible desde cualquier origen
app.use(cors());
// modulo body parser de express
app.use(express.json());

let quotes = [];

// al createServer se le pasa un callback: se va a ejecutar cada vez que reciba una request
// const app = http.createServer((request, response) => {
//     response.writeHead(200, { "Content-Type": "application/json" });
//     response.end(JSON.stringify(pedacitos));
// });

// método json() de express para parsear
app.get("/api/pedacitos", (req, res) => {
    Quote.find({}).then((data) => {
        res.json(data);
    });
});

// ruta dinámica
app.get("/api/pedacitos/:id", (req, res, next) => {
    // sacamos la id de los params del path
    const { id } = req.params;

    /*
    faltarían más validaciones?
    */

    Quote.findById(id)
        .then((oneQuote) => {
            if (oneQuote) {
                return res.json(oneQuote);
            } else {
                res.status(404).end();
            }
        })
        .catch((error) => {
            // este error podría venirde distintos lugares. usamos los middleware para manejar todos los errores
            next(error);
            // console.error(err);
            // res.sendStatus(400).end();
        });
});

app.delete("/api/pedacitos/:id", (req, res, next) => {
    const { id } = req.params;

    // guardamos de nuevo todos menos el id seleccionado
    // findByIdAndRemove??
    Quote.findByIdAndDelete(id)
        .then(() => {
            res.sendStatus(204).end(); // 204 no content
        })
        .catch((error) => next(error));
});

app.put("/api/pedacitos/:id", (req, res, next) => {
    const { id } = req.params;
    const quote = req.body;

    const newQuoteInfo = {
        title: quote.title,
        author: quote.author,
        content: quote.content,
    };

    // con este método mongoose nos evita un error común: que se creen dos distintas
    // tercer parámetro: para que devuelva su versión modificada (si no devuelve la anterior)
    Quote.findByIdAndUpdate(id, newQuoteInfo, { new: true })
        .then((result) => {
            // NO ME DEVUELVE NADA --> solucionado: estaba mandand un status antes
            res.json(result);
        })
        .catch((error) => next(error));
});

/*
POST
le vamos a pasar: 
- title
- author
- content

+ id y date van a ser generados después --> resolvemos así los ids porque dsp se hace con mongo
+ para esto el body parser: permite que tengamos en request.body el recurso que queremos mandar.
*/

app.post("/api/pedacitos", (req, res) => {
    const quote = req.body;
    console.log(quote);

    // esta validación podría pasarse al schema
    if (!quote.content || !quote.title || !quote.author) {
        return res.status(400).json({
            // 400 bad request
            error: "missing data",
        });
    }

    const newQuote = new Quote({
        title: quote.title,
        author: quote.author,
        content: quote.content,
        date: new Date().toISOString(),
    });

    // guardar nota
    newQuote.save().then((savedQuote) => {
        res.status(201).json(savedQuote);
    });
});

// si no encuentra la ruta, entraría acá
app.use(notFound);

// agregamos un middleware especial para que intercepte errores: primer parámetro los errores
app.use(handleError);

// para deploy en heroku: lo saca de una variable de entorno
const PORT = process.env.PORT;

//app.listen(PORT);
// con express esta llamada es asíncrona: cuando el servidor esté levantado ejecuta la función
app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
});
