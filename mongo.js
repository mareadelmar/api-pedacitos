require("dotenv").config();
const mongoose = require("mongoose");

const connectionData = process.env.MONGODB_URI;

// conexión con mongo: le pasamos un objeto de configuración porque nos aparecen warnings de deprecados
// useCreateIndex para que genere el índice automáticamente (para dsp encotrar los documentos).

mongoose
    .connect(connectionData, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("conectados"))
    .catch((err) => console.error(err));

// creamos una instancia de la clase
// const quote = new Quote({
//     title: "Sr. Presidente",
//     author: "ASTURIAS, miguel ángel",
//     content:
//         "El peso de los muertos hace girar la tierra de noche y de día el peso de los vivos... Cuando sean más los muertos que los vivos, la noche será eterna, no tendrá fin, faltará para que vuelva el día el peso de los vivos.",
//     date: new Date().toISOString(),
// });

// // ahora podemos acceder a un montón de métodos, como save (para guardar el documento)
// // lo que devuelve la promesa es el objeto creado.
// quote
//     .save()
//     .then((res) => {
//         console.log(res);
//         mongoose.connection.close();
//     })
//     .catch((err) => console.error(err));
