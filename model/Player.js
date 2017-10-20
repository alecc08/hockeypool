"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PlayerSchema = new Schema({
    name: String,
    position: String,
    team: String,
    gamesPlayed: Number,
    goals: Number,
    assists: Number,
    points: Number,
    pm: Number,
    gwg: Number,
    otg: Number,
    pim: Number,
    shots: Number,
    ppg: Number,
    ppp: Number,
    shg: Number,
    shp: Number,
    shotPercentage: Number,

    //Goalies
    wins: Number,
    losses: Number,
    otl: Number,
    shutouts: Number,
    shotsAgainst: Number,
    goalsAgainst: Number,
    gaa: Number,
    saves: Number,
    savePercent: Number,

    lastUpdated: Date,

    injury: String,
    active:Boolean,

    //He's on FIRE (1 fire point per point. -2 fire points per day)
    firePoints: Number




});

module.exports = mongoose.model("Player", PlayerSchema);
