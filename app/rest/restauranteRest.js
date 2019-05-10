let express = require("express");
let router = express();
let restauranteService = require("../services/restauranteService").Pg();
router.get("/:id?", async function (req, res) {
    let id = req.params.id;
    try {
        if (id === undefined) {
            let result = (await restauranteService.getRestaurante("get-restaurantes.sql")).rows;
            res.status(200).send({
                restaurantes: result
            });
        } else {
            let result = (await restauranteService.getRestaurante("get-restaurante.sql", id)).rows;
            res.status(200).send({
                restaurantes: result
            });
        }
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error al consultar!",
            info: error
        });
    }
});
module.exports = router;