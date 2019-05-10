let express = require("express");
let app = express();
const vs = "/api/v1";
//REST Restaurantes
app.use(vs+"/restaurante", require("./restauranteRest"));
// // REST Lugares
// app.use(vs+"/lugar/", require("./lugarRest"));
// //REST Reserva
// app.use(vs+"/reserva/", require("./reservaRest"));
module.exports = app;
