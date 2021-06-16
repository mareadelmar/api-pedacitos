module.exports = (error, req, res, next) => {
    console.error(error);
    console.log(error.name);
    // // con req.path podríamos acceder a los path que entrar al error, si quisiéramos analizar
    // res.status(404).json({
    //     error: "Not found",
    // });
    /* por ahora así, pero podríamos agregar otros errores (además así no cae todo lo demás en error nuestro)
    Generalmente esto se manda a un servicio para catchearlos.
    */
    if (error.name === "CastError") {
        return res.status(400).send({ error: "Invalid Id" });
    } else {
        res.status(404).end();
        // 500 internal server error
    }
};
