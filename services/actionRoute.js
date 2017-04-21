"use strict";
var express = require('express');
var router = express.Router();
const apn = require('apn');

let token = ['7b3f9bb2c8836269e87cf68de22ae79710bf7fe309cdc43aa70cf0239008035d']

let service = new apn.Provider({
  cert: "cert.pem",
  key: "key.pem"
})

let note = new apn.Notification({
  alert: 'Notification testing'
})

note.topic = "org.reactjs.native.example.PinVuew";

service.send(note, token).then(result => {
  console.log('success: ', result.sent.length);
  console.log('failed: ', result.failed.length);
  console.log(result.failed)
})

service.shutdown()

//model
const User  = require('../models/models').User;
const Activity= require('../models/models').Activity;
const Usernotification= require('../models/models').Usernotification;
const Goal= require('../models/models').Goal;

router.post('/createGoal', function(req, res){
    Goal.findOne({$and: [
          {'user': req.body.user},
          {'activityCategory': req.body.activityCategory},
          {'goalTimeFrame': req.body.goalTimeFrame},
          ]})
     .exec( function(err, goal) {
        if (err) {
            return {err, goal}
        }

      if(!goal){

          var newGoal = new Goal({
            user: req.body.user,
            activityCategory: req.body.activityCategory,
            activityGoal: req.body.activityGoal,
            goalTimeFrame: req.body.goalTimeFrame,
          })

          newGoal.save(function(err,goal){
              if(err){
                console.log(err)
                return err
              }
              console.log('goal created!');
              res.send(goal)
          })

      }else{
        console.log('Stop creating the same daily goal and go do it!')
        res.send(null)
      }
    })
});

router.post('/getMyGoals', function(req, res){
    Goal.find({user: req.body.user})
     .exec( function(err, goals) {
        if (err) {
            return {err, goals}
        }
        console.log(goals);
      if(!goals){
        console.log('you have not goals in life');
        res.send(goals);
      }else{
        console.log('getallofyourgoals: Keep grinding')
        res.send(goals);
      }
    })
});

router.post('/editGoal', function(req, res){
    console.log(req.body)
    Goal.findByIdAndUpdate(req.body.goalID, req.body.goalObject)
     .exec( function(err, goal) {
        if (err) {
            return {err, goal}
        }
      if(goal){
        console.log('goal updated!');
        res.send(goal);
        return goal
      }else{
        console.log('no found! err!');
        return goal
      }
    })
});

router.post('/deleteGoal', function(req, res){

    Goal.findByIdAndRemove(req.body.goalID)
     .exec( function(err, goal) {
        if (err) {
            return {err, goal}
        }
      if(!goal){
        console.log('Can delete a empty goal!');
        res.send(goal);
      }else{
        console.log('Deleted')
        res.send(goal);
      }
    })
});

module.exports = router;
