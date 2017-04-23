import { RNS3 } from 'react-native-aws3';
var Environment = require('../Environment.js')

export function editActivity(activityID, activityCreatorId, activityObject){
  console.log("INSIDE EDIT ACTIVITY", activityID, activityCreatorId, activityObject)
  return dispatch => {
    dispatch(fetching());
    fetch('http://localhost:8080/editActivity', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        activityID: activityID,
        activityCreatorId: activityCreatorId,
        activity: activityObject
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {

    })
    .catch((err) => {
      console.log('Error in editActivity', err)
    });
  };
}

export function deleteActivity(activityID, activityCreatorId){
  return dispatch => {
    dispatch(fetching());
    fetch('http://localhost:8080/deleteActivity', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        activityID: activityID,
        activityCreatorId: activityCreatorId
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {

    })
    .catch((err) => {
      console.log('Error in editActivity', err)
    });
  };
}

export function passGoalObject(goalObject){
  return dispatch => {
    dispatch(fetching());
    dispatch(passGoals(goalObject));
  };
}

export function getAllUserActivities(userId){
  console.log('INSIDE GET ALL USER ACTIVITIES', userId)
  return dispatch => {
    dispatch(fetching());
    fetch('http://localhost:8080/getAllUserActivities', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        userId: userId
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log()
      var x = [];
      x.push(responseJson);
      dispatch(getAllUserActivitiesPerDay(x))
    })
    .catch((err) => {
      console.log('Error in getAllUserActivities', err)
    });
  };
}

export function createActivity(activityObject, photo) {
  if(photo){
      var copy = Object.assign({}, activityObject)
      var file = {
          // `uri` can also be a file system path (i.e. file://)
          uri: photo.uri,
          name: activityObject.activityCreator + Date.now() +'.img',
          type: photo.mime
      }
      copy['image'] = "https://your-bucket.s3.amazonaws.com/uploads%2"+file.name
  }else{
      copy['image'] = null
  }

    return dispatch => {
        fetch('http://localhost:8080/createActivity', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                activity: copy
              })
            }).then((response) => response.json())
            .then(responseJson => {

              console.log('this is reponseJson: ', process.env.AWS_DEFAULT_REGION)
                if(responseJson.activityImage){
                  var options = {
                    keyPrefix: "uploads/",
                    bucket: "newvuew",
                    region: Environment.AWS_DEFAULT_REGION,
                    accessKey: Environment.AWS_ACCESS_KEY_ID,
                    secretKey: Environment.AWS_SECRET_ACCESS_KEY,
                    successActionStatus: 201
                  }

                  RNS3.put(file, options).then(response => {
                    if (response.status !== 201)
                      throw new Error("Failed to upload image to S3");
                    console.log(response.body);
                  });
                }


            })
            .catch((err) => {
              console.log('error in createActivity -> ', err)
            });
    };
}

export function getPingAroundMe(category, lat, lon) {
  return dispatch => {
      dispatch(fetching());

      fetch('http://localhost:8080/getPingsAroundMe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              category: category,
              lon: lon,
              lat: lat
            })
          })
          .then((response) => response.json())
          .then((responseJson) => {

            console.log("made it to the promised land: ", responseJson)

              dispatch(getActivities(responseJson))
              dispatch(doneFetching())
          })
          .catch((err) => {
            console.log('error in populatedActivities -> ', err)
          });
  };
}

export function selectCategory(category) {
  return dispatch => {
      dispath(getCategory());
  };
}

export function getnotifications(currentUserID){
  return dispatch => {
        dispatch(fetching());
        console.log('currentUserID in getNotifications in initialAction: ', currentUserID);

        fetch('http://localhost:8080/getNotification', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userID: currentUserID
              })
            }).then((response) => response.json())
            .then((responseJson) => {

                var userObject = [...responseJson];
                console.log(userObject, ' is the super userObject from getUserNotifications');

                dispatch(getNotificationsAction(userObject));
                dispatch(doneFetching())
            })
            .catch((err) => {
              console.log('error: ', err)
            });
    };
}


export function saveNotification(){
  return dispatch => {

        fetch('http://localhost:8080/addActionsToNotification', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userID: currentUserID
              })
            }).then((response) => response.json())
            .then((responseJson) => {

                var userObject = [...responseJson];
                console.log(userObject, ' is the super userObject from getUserNotifications');

                dispatch(getNotificationsAction(userObject));
                dispatch(doneFetching())
            })
            .catch((err) => {
              console.log('error: ', err)
            });
    };
}


export function getNotificationsAction(notifications) {
    return {
        type: 'GET_NOTIFICATIONS',
        notifications
    };
}
export function getAllUserActivitiesPerDay(activities){
  return {
      type: 'GET_USER_ACTIVITIES',
      activities: activities
  }
}

export function passGoals(goals) {
    return {
        type: 'GET_GOALS_OBJECT',
        goals: goals
    };
}

export function getActivities(populatedActivities) {
    return {
        type: 'POPULATED_ACTIVITIES',
        populatedActivities: populatedActivities
    };
}

export function getCategory(category) {
    return {
        type: 'SELECT_CATEGORY',
        category: category
    };
}

function fetching(){
  return {
    type: "FETCHING_DATA"
  }
}
function doneFetching() {
  return {
    type: "DONE_FETCHING"
  }
}
