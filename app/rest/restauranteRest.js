let express = require("express");
let router = express.Router();
// let restauranteService = require("../services/restauranteService").Pg();
router.get("/:id", async function (req,res) {
    try {
        console.log(req);
    }catch (e) {
        console.log(e)
    }
});
module.exports = router;