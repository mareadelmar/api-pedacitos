// const http = require("http");
// ahora con express:
const express = require("express");
const cors = require("cors");
const app = express();

// MIDLEWARES
// cors: accesible desde cualquier origen
app.use(cors());
// modulo body parser de express
app.use(express.json());

let allQuotes = [
    {
        id: 1,
        pedacito:
            "Un retrato que contemplaba a hurtadillas, deslizándome (mi infancia me enseñó eso en vez del amor, y me fue útil; la verdad es que, si me hubiese enseñado a amar, no me hubiera sido tan útil).",
        obraautor: "Absalón, absalón – FAULKNER, william",
    },

    {
        id: 2,
        pedacito:
            "Se sentía como un águila, duro, suficiente, poderoso, sin remordimientos y lleno de vigor. Pero aquello no duró mucho tiempo, aunque ignoraba entonces que, para él como para el águila, su propia carne y el espacio entero nunca serían más que una jaula.",
        obraautor: "Luz de agosto – FAULKNER, william",
    },

    {
        id: 3,
        pedacito:
            "No existe muerte natural: nada de lo que sucede al hombre es natural puesto que su sola presencia cuestiona al mundo. Todos los hombres son mortales: pero para todos la muerte es un accidente y, aunque la conozcan y la acepten, es una violencia indebida.",
        obraautor: "Una muerte muy dulce – DE BEAUVOIR, simone",
    },

    {
        id: 4,
        pedacito:
            "Estábamos solos, representando, exprimiendo, tratando de comprender una simple situación humana.",
        obraautor: "La vida breve – ONETTI, juan carlos",
    },
];

// al createServer se le pasa un callback: se va a ejecutar cada vez que reciba una request
// const app = http.createServer((request, response) => {
//     response.writeHead(200, { "Content-Type": "application/json" });
//     response.end(JSON.stringify(pedacitos));
// });

// ahora con express: cuando se haga una petición del tipo get al path "/"
app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
});

// método json() de express para parsear
app.get("/api/pedacitos", (req, res) => {
    res.json(allQuotes);
});

// ruta dinámica
app.get("/api/pedacitos/:id", (req, res) => {
    // sacamos la id de los params del path
    const id = Number(req.params.id);
    const oneQuote = allQuotes.find((item) => item.id === id);
    console.log(id, oneQuote);

    /*
    acá faltarían validaciones
    */

    if (oneQuote) {
        res.json(oneQuote);
    } else {
        res.sendStatus(404).end();
    }
});

app.delete("/api/pedacitos/:id", (req, res) => {
    const id = Number(req.params.id);
    console.log(req.params.id);
    // guardamos de nuevo todos menos el id seleccionado
    allQuotes = allQuotes.filter((item) => item.id !== id);
    res.sendStatus(204).end();
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

    if (!quote.content || !quote.title || !quote.author) {
        return res.status(400).json({
            error: "missing data",
        });
    }

    const ids = allQuotes.map((item) => item.id);
    const maxId = Math.max(...ids);

    const newQuote = {
        id: maxId + 1,
        title: quote.title,
        author: quote.author,
        content: quote.content,
        date: new Date().toISOString(),
    };
    allQuotes = [...allQuotes, newQuote]; // allQuotes.concat(newQuote)
    res.status(201).json(newQuote);
});

// agregamos un middleware al final para que intercepte errores
app.use((req, res) => {
    // con req.path podríamos acceder a los path que entrar al error, si quisiéramos analizar
    res.status(404).json({
        error: "Not found",
    });
});

// para deploy en heroku: lo saca de una variable de entorno
const PORT = process.env.PORT;

//app.listen(PORT);
// con express esta llamada es asíncrona: cuando el servidor esté levantado ejecuta la función
app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
});
