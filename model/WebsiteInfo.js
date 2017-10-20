"use strict";

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let Schema = mongoose.Schema;

let WebsiteInfo = new Schema({
    message: String,
    time: Date
});

module.exports = mongoose.model("WebsiteInfo", WebsiteInfo);
