let express = require("express");
let router = express();
let lugaresService = require("../services/lugarService").Pg();

router.get("",async function(req,res) {
    try {
        res.status(200).send({
            message: id
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error al consultar!",
            info: error
        });
    }
});
module.exports = router;