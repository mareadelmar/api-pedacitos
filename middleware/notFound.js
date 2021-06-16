module.exports = (req, res, next) => {
    // con req.path podríamos acceder a los path que entrar al error, si quisiéramos analizar
    res.status(404).json({
        error: "Not found",
    });
};
