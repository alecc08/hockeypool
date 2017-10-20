"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PoolAccountSchema = new Schema({
    teamName: String,
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
    },
    players: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    }]
});

module.exports = mongoose.model("PoolAccount", PoolAccountSchema);
