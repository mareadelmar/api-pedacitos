module.exports = (error, req, res, next) => {
    console.error(error);
    console.log(error.name);

    //podríamos agregar otros errores (además así no cae todo lo demás en error nuestro)
    if (error.name === "CastError") {
        return res.status(400).send({ error: "Invalid Id" });
    } else {
        res.status(404).end();
        // 500 internal server error
    }
};
