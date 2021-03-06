#!/usr/bin/env nodejs
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

//init

var app = express();

// support cors
app.use(cors());
// support parsing of application/json type post data
app.use(bodyParser.json({ limit: "50mb" }));
//support parsing of application/x-www-form-urlencoded post data
app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: "50mb",
        parameterLimit: 50000
    })
);

//routes
app.use("/", require("./app/rest/_indexv1"));

//errors
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({ success: false, message: "Endpoint no encontrado. :(" });
});

let port = process.env.PORT || 3005;
app.listen(port, function() {
  console.log(`API- Runing: http://localhost:${port}`);
});
