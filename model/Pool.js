"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PoolSchema = new Schema({
    name: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PoolAccount'
    }],
    pointsPerGoal: Number,
    pointsPerAssist: Number,
    pointsPerGWG: Number,
    pointsPerOTG: Number,
    pointsPerGoalieWin: Number,
    pointsPerGoalieShutout: Number,
    pointsPerGoalieOtl: Number,
    pointsPerGoalieGoal: Number,
    pointsPerGoalieAssist: Number,
    numSkaters: Number,
    numGoalies: Number

});

module.exports = mongoose.model("Pool", PoolSchema);
