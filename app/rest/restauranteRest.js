let express = require("express");
let router = express();
// let restauranteService = require("../services/restauranteService").Pg();
router.get("/:id?",function (req,res) {
    let id = req.params.id;
    res.send(id);
});
module.exports = router;