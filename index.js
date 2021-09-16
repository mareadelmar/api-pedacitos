require("dotenv").config();
require("./mongo");

const express = require("express");
const cors = require("cors");
const app = express();
const Quote = require("./models/Quote");
const notFound = require("./middleware/notFound");
const handleError = require("./middleware/handleError");

// MIDLEWARES
app.use(cors());
app.use(express.json());

// GET
app.get("/api/pedacitos", (req, res) => {
    Quote.find({}).then((data) => {
        res.json(data);
    });
});

app.get("/api/pedacitos/:id", (req, res, next) => {
    const { id } = req.params;

    Quote.findById(id)
        .then((oneQuote) => {
            if (oneQuote) {
                return res.json(oneQuote);
            } else {
                res.status(404).end();
            }
        })
        .catch((error) => {
            next(error);
        });
});

// DELETE
app.delete("/api/pedacitos/:id", (req, res, next) => {
    const { id } = req.params;

    Quote.findByIdAndDelete(id)
        .then(() => {
            res.sendStatus(204).end(); // 204 no content
        })
        .catch((error) => next(error));
});

// PUT
app.put("/api/pedacitos/:id", (req, res, next) => {
    const { id } = req.params;
    const quote = req.body;

    const newQuoteInfo = {
        title: quote.title,
        author: quote.author,
        content: quote.content,
    };

    Quote.findByIdAndUpdate(id, newQuoteInfo, { new: true })
        .then((result) => {
            res.json(result);
        })
        .catch((error) => next(error));
});

// POST
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

app.use(notFound);

app.use(handleError);

// para deploy en heroku
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
});
