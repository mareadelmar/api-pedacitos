const mongoose = require("mongoose");
const connectionData = process.env.MONGODB_URI;

mongoose
    .connect(connectionData, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("conectados"))
    .catch((err) => console.error(err));

/*
si hay un error, que desconecte el servidor.
*/
process.on("uncaughtException", ()=>{
    mongoose.connection.disconnect();
});