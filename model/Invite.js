"use strict";

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let Schema = mongoose.Schema;

let InviteSchema = new Schema({
    invitedEmail: String,
    inviterName: String,
    pool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pool'
    }
});

module.exports = mongoose.model("Invite", InviteSchema);
