let express = require("express");
let googleTrends = require('google-trends-api');
let router = express();
let restauranteService = require("../services/restauranteService").Pg();

router.get("/top/", async function (req, res) {
    let result = (await restauranteService.getRestaurante("get-toprestaurante.sql")).rows;
    if(result !== undefined){
        let googleData = await googleTrends.interestOverTime({keyword: result[0].nombre_local});
        res.status(200).send({
            restaurante: result,
            googleData: JSON.parse(googleData)
        });
    }
});

router.get("/restaurante/:id?/", async function (req, res) {
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