const { Schema, model } = require("mongoose");

// creamos el schema que vamos a utilizar
const quotesSchema = new Schema({
    title: String,
    author: String,
    content: String,
    date: Date,
});

// cambiamos como funciona el toJSON que hace el schema (esto está en la docu). va a funcionar en todas las peticiones
// antes de hacerlo, se va a ejecutar la función: (o sea, este es el toJSON que queremos que haga)
quotesSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id; // capaz no es la mejor forma
        delete returnedObject.__v;
    },
});

// creamos un modelo en base al schema: nos va a permitir crear instancias de este objeto
//(o sea, lo que creamos es una clase en realidad)
const Quote = new model("Quote", quotesSchema);

module.exports = Quote;
