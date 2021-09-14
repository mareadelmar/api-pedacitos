const { Schema, model } = require("mongoose");

const quotesSchema = new Schema({
    title: String,
    author: String,
    content: String,
    date: Date,
});

quotesSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id; // capaz no es la mejor forma
        delete returnedObject.__v;
    },
});


const Quote = new model("Quote", quotesSchema);

module.exports = Quote;
