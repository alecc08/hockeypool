"use strict";

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let Schema = mongoose.Schema;

let PoolMessage = new Schema({
    message: String,
    posterName: String,
    time: Date,
    pool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pool'
    }
});

module.exports = mongoose.model("PoolMessage", PoolMessage);
