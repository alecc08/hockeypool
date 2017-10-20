let express = require("express");
let Account = require("../model/Account");
let Pool = require("../model/Pool");
let PoolAccount = require("../model/PoolAccount");
let PoolMessage = require("../model/PoolMessage");
let Player = require("../model/Player");
let Invite = require("../model/Invite");
let WebsiteInfo = require("../model/WebsiteInfo");
let jwt = require("jsonwebtoken");
let config = require("../config");
var apiRoutes = express.Router();
let mongoose = require('mongoose');
let moment = require('moment-timezone');


apiRoutes.post('/authenticate', function(req, res) {
  console.log("Looking for " + req.body.email);
  // find the user
  Account.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        user.password = null;
        // If user chose pool as main page, set their main pool in token
        if(user.mainPage == "pool") {
          PoolAccount.find({'account':mongoose.Types.ObjectId(user._id)})
          .then(function(poolAccounts) {
            let poolAccountIds = [];
            poolAccounts.map(account => poolAccountIds.push(account._id));
            Pool.find({participants:{$in: [...poolAccountIds]}})
            .then(function (participantPools) {

              if(participantPools.length > 0) {
                  user.mainPool = participantPools[0]._id;
                  //user.Prototype.mainPool = participantPools[0]._id;
                  // if user is found and password is right
                  // create a token
                  var token = jwt.sign(user, config.secret, {
                    expiresIn: "7d"
                  });

                  // return the information including token as JSON
                  res.json({
                    success: true,
                    token: token
                  });
              }
            });
          });
        } else {
          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, config.secret, {
            expiresIn: "7d"
          });

          // return the information including token as JSON
          res.json({
            success: true,
            token: token
          });
        }


      }

    }

  });
});

apiRoutes.post('/newuser', function(req, res) {
  if(!req.body.email || !req.body.name || !req.body.password) {
    res.json({success:false, message: "Please fill in all fields"});
    return;
  }
  // create a sample user
  Account.findOne({
    email: req.body.email
  }, function(err, user) {

    if(err) throw err;

    if(!user) {
      var acccount = new Account({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // save the sample user
      acccount.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true, message: "Account created successfully" });
      });
    }
    else {
      res.json({ sucess: false, message: "Account already exists for this email"});
    }
  });


});

apiRoutes.get("/websiteMessage", function(req, res) {
  WebsiteInfo.find({}, function(err, messages) {
    res.send(messages[messages.length-1]);
  });
});

apiRoutes.post("/websiteMessage", function(req, res) {
  if(!req.body.message) {
    return;
  }
  let newMessage = new WebsiteInfo();
  newMessage.message = req.body.message;
  newMessage.time = new moment();
  newMessage.save();
  res.send({});
});



apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['authorization'];
  // decode token
  if (token) {
    token = token.substring(7); //Remove "Bearer"
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        //Update user last login
        Account.findOne({_id:decoded._doc._id}, function(err,user) {
          Account.update({_id:user._id}, {lastLogin: new Date()});
        });
        next();
      }
    });

  } else {
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
});


apiRoutes.put('/pool', function(req, res) {
  if(req.body) {
    let newPool = new Pool();
    newPool.owner = {_id: req.decoded._doc._id};
    newPool.name = req.body.name;
    newPool.password = req.body.password;
    //newPool.participants.push({'teamName': req.decoded._doc.name, 'account':{'_id':req.decoded._doc._id}});
    newPool.pointsPerGoal = req.body.pointsPerGoal;
    newPool.pointsPerAssist= req.body.pointsPerAssist;
    newPool.pointsPerGWG= req.body.pointsPerGWG;
    newPool.pointsPerGoalieWin= req.body.pointsPerGoalieWin;
    newPool.pointsPerGoalieShutout= req.body.pointsPerGoalieShutout;
    newPool.pointsPerGoalieOtl= req.body.pointsPerGoalieOtl;
    newPool.pointsPerGoalieGoal = req.body.pointsPerGoalieGoal;
    newPool.pointsPerGoalieAssist = req.body.pointsPerAssist;
    newPool.save(function(err, pool) {
      if (err) {
        console.log(err);
        throw err;
      }
      let poolAccount = new PoolAccount();
      poolAccount.account = {'_id':req.decoded._doc._id};
      poolAccount.teamName = req.decoded._doc.name;
      newPool.participants.push(poolAccount);
      poolAccount.save();
      newPool.save();

      console.log('Pool saved successfully');

      res.json({ success: true, message: "Pool created successfully" });
    });
  }
});

apiRoutes.put('/account', function(req, res) {
  if(req.body) {
    Account.findOne({_id:req.decoded._doc._id}, function(err,user) {
      if(req.body.mainPage) {
        user.mainPage = req.body.mainPage;
        res.send({success:true,message:"Preference changed. You'll need to logout and log back in for changes to take effect."});
      }
      else if(req.body.password) {
        user.password = req.body.password;
        res.send({success:true,message:"Password changed."});
      }
      user.save();
    });
  }
});

apiRoutes.get('/pool', function(req,res) {
  Pool.find({'owner': mongoose.Types.ObjectId(req.decoded._doc._id)}, function(err, pools) {

    if(err) throw err;

    if(!pools) {
      pools = [];
    }
    PoolAccount.find({'account':mongoose.Types.ObjectId(req.decoded._doc._id)})
    .then(function(poolAccounts) {
      let poolAccountIds = [];
      poolAccounts.map(account => poolAccountIds.push(account._id));
      Pool.find({participants:{$in: [...poolAccountIds]}})
      .then(function (participantPools) {
        for(let i=0;i<participantPools.length;i++) {
          let poolFound = false;
          for(let j=0;j<pools.length;j++) {
            if(participantPools[i]._id.toString() == pools[j]._id.toString()) {
              poolFound = true;
            }
          }
          if(!poolFound) {
            pools.push(participantPools[i]);
          }
        }
        if(pools.length > 0) {
            res.json({ success: true, pools: pools });
        }
        else {
          res.json({ sucess: false, message: "No pools found"});
        }
      });
    });
  });
});

apiRoutes.get('/pool/:id', function(req,res) {

  Pool.findOne({'_id': req.params.id})
    .populate({
      path: 'participants',
      populate: {
        path: 'players'
      }
  }).populate('owner')
  .exec(function(err, pool) {
    if(err) throw err;

    if(!pool) {
      res.json({success:false, message:"Failed to find pool"});
    } else {
      res.json(pool);
    }
  });

});

apiRoutes.delete('/pool/:id', function(req,res) {
  Pool.findOne({'_id': req.params.id}).populate(['owner', 'participants'])
  .then(function(pool) {
    if(!pool || pool.owner._id != req.decoded._doc._id) {
      res.json({success:false, message:"Failed to delete pool"});
    } else {
      for(let i=0;i<pool.participants.length;i++) {
        pool.participants[i].remove();
      }
      pool.remove();
      res.json({success:true});
    }
  })
  .catch(function(err) {
    res.json({success:false, message:err});
  });
});

apiRoutes.get('/invite', function(req, res) {
  Invite.find({invitedEmail:req.decoded._doc.email}).populate('pool')
  .then(function(invites) {
    if(invites && invites.length > 0) {
      res.json({success:true, invites:invites});
    } else {
      res.json({success:false, message:"No invites found"});
    }
  });
});

apiRoutes.post('/invite', function(req, res) {
  if(!req.body.poolId || !req.body.inviteEmail) {
    console.log(JSON.stringify(req.body));
    res.json({success:false});
    return;
  }
  Pool.findOne({_id:req.body.poolId}).populate('participants')
  .then(function(pool) {
    //Make sure the person isnt already invited
  });
  let invite = new Invite();
  invite.inviter = req.decoded._doc.name;
  Account.findOne({email: req.body.inviteEmail})
  .then(function(person) {
    invite.invitedEmail = req.body.inviteEmail;
    invite.pool = {_id: req.body.poolId};
    invite.save();
    res.json({success:true, message:"Invite sent."});
  })
  .catch(function(err) {
    console.log(err);
    res.json({success:false, message:"Failed to send invite", id: req.params.id});
  });

});

apiRoutes.delete('/invite/:id', function(req,res) {
  if(req.params.id) {
    Invite.findOne({_id:req.params.id})
    .then(function(invite) {
      invite.remove();
      res.json({success:true, message:"Deleted invite", inviteId: req.params.id});
    })
    .catch(function(err) {
      res.json({success:"false", message:"Failed to delete invite", inviteId: req.params.id});
    });
  }
});

apiRoutes.get('/invite/:id/accept', function(req,res) {
  if(req.params.id) {
    Invite.findOne({_id:req.params.id})
    .then(function(invite) {
      Pool.findOne({_id:invite.pool}).populate('participants')
      .then(function(pool) {
        var poolAccount = new PoolAccount();
        poolAccount.teamName = ""+ req.decoded._doc.name + "'s Team";
        poolAccount.account = {_id:req.decoded._doc._id};
        poolAccount.players = [];
        poolAccount.save();
        pool.participants.push(poolAccount);
        pool.save();
        invite.remove();
        res.json({success:true, message:"Accepted invite", inviteId: req.params.id, pool: pool});
      });
    })
    .catch(function(err) {
      console.log("Failed to accept invite: " + err);
      res.json({success:"false", message:"Failed to accept invite"});
    });
  }
});


apiRoutes.get('/pool/:id/poolAccount/:accountId', function(req,res) {
  if(!req.params.id || !req.params.accountId) {
    res.json({success:false, message:"Missing id or accountId"});
    return;
  }
  Pool.findOne({'_id': req.params.id})
    .exec(function(err, pool) {

    if(err) throw err;

    if(!pool) {
      res.json({success:false, message:"Failed to find pool account"});
    } else {
      PoolAccount.findOne({'_id': req.params.accountId})
        .populate('players')
        .populate('account')
        .exec(function(err, poolAccount) {
          res.json({pool:pool,poolAccount:poolAccount});
        });
    }
  });

});

apiRoutes.put('/pool/:id/poolAccount/:accountId', function(req,res) {
  if(!req.params.id || !req.params.accountId) {
    res.json({success:false, message:"Missing id or accountId"});
    return;
  }
  Pool.findOne({'_id': req.params.id})
  .then(function(pool) {
      PoolAccount.findOne({'_id': req.params.accountId})
      .then(function(poolAccount) {
          if(req.body.teamName) {
            poolAccount.teamName = req.body.teamName;
          }
          poolAccount.save();
          res.json({success:true});
      })
      .catch(function(err) {
        res.json({success:false});
      });
  })
  .catch(function(err) {
    res.json({success:false});
  });

});


apiRoutes.delete('/pool/:id/poolAccount/:accountId', function(req,res) {
  if(!req.params.id || !req.params.accountId) {
    res.json({success:false, message:"Missing id or accountId"});
    return;
  }
  Pool.findOne({_id:req.params.id}).populate('participants')
  .then(function(pool) {
    for(let i=0;i<pool.participants.length;i++) {
      if(pool.participants[i]._id == req.params.accountId) {
        pool.participants.splice(i,1);
        break;
      }
    }
    pool.save();
  });
  PoolAccount.findOne({'_id': req.params.accountId})
  .then(function(poolAccount) {
    if(!poolAccount) {
      res.json({success:false, message:"Failed to find pool account"});
    } else {
      poolAccount.remove();
      res.json({success:true});
    }
  });

});

apiRoutes.post('/pool/:id/poolAccount/:accountId/player/:playerName', function(req,res) {
  if(!req.params.id || !req.params.accountId || !req.params.playerName) {
    res.json({success:false, message:"Missing id or accountId or playerName"});
    return;
  }
  PoolAccount.findOne({'_id': req.params.accountId}).populate('players')
  .then(function(poolAccount) {
    Player.findOne({name: {$regex : new RegExp(req.params.playerName, 'i')}})
    .then(function(player) {
      poolAccount.players.push(player);
      poolAccount.save();
      res.json({success:true, player:player});
    });

  })
  .catch(function(err) {
    console.log(err);
    res.json({success:false, message: err});
  });

});

apiRoutes.delete('/pool/:id/poolAccount/:accountId/player/:playerName', function(req,res) {
  if(!req.params.id || !req.params.accountId || !req.params.playerName) {
    res.json({success:false, message:"Missing id or accountId or playerName"});
    return;
  }
  PoolAccount.findOne({'_id': req.params.accountId}).populate('players')
  .then(function(poolAccount) {
    let index = -1;
    for(let i=0;i<poolAccount.players.length;i++) {
      if(poolAccount.players[i].name == req.params.playerName) {
        index = i;
        break;
      }
    }
    if(index >= 0) {
      poolAccount.players.splice(index,1);
      poolAccount.save();
    }

    res.json({success:true, player:{name:req.params.playerName}});

  })
  .catch(function(err) {
    console.log(err);
    res.json({success:false, message: err});
  });

});


apiRoutes.get('/accounts', function(req, res) {
  Account.find({}, function(err, users) {
    for(let i=0;i<users.length;i++) {
      users[i].password = "****";
    }
    res.json(users);
  });
});

apiRoutes.get("/players", function(req, res) {
  let query;
  if(req.query.type) {
    query = Player.find({"position":req.query.type});
  } else if (req.query.team){
    query = Player.find({"team":req.query.tean});
  } else {
    query = Player.find();
  }

  if(!req.query.sort) {
    query = query.sort({"points": -1})
  } else {
    let order = req.query.order || -1; //Ascending or descending? (Default: desc)
    query = query.sort(JSON.parse('{"'+req.query.sort+'": '+order+'}'))
  }
  if(req.query.limit) {
    query = query.limit(Number(req.query.limit));
  }
  query.exec(function(err, players) {
    res.send(players);
  });

});

apiRoutes.get("/players/:name", function(req, res) {
  console.log("Looking for " + req.params.name);
  Player.find({name: req.params.name}, function(err, players) {
    res.send(players);
  });
});

apiRoutes.post('/messages', function(req, res) {
  if(!req.body.poolId || !req.body.message) {
    console.log(JSON.stringify(req.body));
    res.json({success:false});
    return;
  }
  var poolMessage = new PoolMessage();
  poolMessage.posterName = req.decoded._doc.name;
  poolMessage.message = req.body.message;
  poolMessage.time = new moment().tz("America/New_York");
  poolMessage.pool = {_id:req.body.poolId};
  poolMessage.save();
  res.send({success:true});
});

apiRoutes.get("/pool/:poolId/messages", function(req, res) {
  PoolMessage.find({pool: {_id : req.params.poolId}}).sort({'time':-1}).limit(50).exec(function(err, messages) {
    res.send(messages.reverse());
  });
});


module.exports = apiRoutes;
