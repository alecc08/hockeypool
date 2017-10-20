"use strict";

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let Schema = mongoose.Schema;

let AccountSchema = new Schema({
    name: String,
    email: String,
    password: String,
    mainPage: String,
    mainPool: String,
    lastLogin: Date


});

module.exports = mongoose.model("Account", AccountSchema);
