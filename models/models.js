var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  //How can we keep track of User Activity?
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: String
  },
  profileImg: {
    type: String
  },
  admin: {
    type: Boolean,
    default: false
  },
  sortedPing: {
    type: Object,
    default: {}
  },
  myActivity: [String]
},
{ timestamps: true }
);

var activitySchema = new mongoose.Schema({
  //How can we keep track of User Activity?
  activityCreator: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  activityImage: String,
  activityNote: {
    type: String,
    default: "",
  },
  activityLatitude: {
    type: Number,
    required: true
  },
  activityLongitude: {
    type: Number,
    required: true
  },
  activityCategory:{
    type: String,
    required: true
  },
  activityDuration: {
    type: Number,
    required: true
  },
  activityTrueHour: {
    type: Number
  }
},
{ timestamps: true }
);

var goalsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  activityCategory: {
    type: String,
    required: true
  },
  activityGoal: {
    type: Number,
    required: true
  },
  goalTimeFrame: {
    type: Number,
    required: true
  },
  currentProgress: {
    type: Number,
    default: 0
  }
  },
  { timestamps: true }
);


var User = mongoose.model("User", userSchema);
var Activity = mongoose.model("Activity", activitySchema);
var Goal = mongoose.model("Goal", goalsSchema);

module.exports = {
  User: User,
  Activity: Activity,
  Goal: Goal
};
