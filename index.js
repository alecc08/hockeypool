"use strict";

let express = require("express");
const path = require('path');
let app = express();
let config = require("./config")
let bodyparser = require("body-parser")
let Account = require("./model/Account");
let mongoose = require("mongoose");
let apiRoutes = require('./routes/apiRoutes');
let compression = require('compression');

mongoose.connect(config.db);

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(compression());

app.use(function(req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(express.static('.'));
app.use("/node_modules",express.static('node_modules'));


app.use('/api', apiRoutes);

app.all('*', function(req, res)  {
  console.log(`[TRACE] Server 404 request: ${req.originalUrl}`);
  res.status(302).redirect("/");
});


let port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on port " + port);
});
