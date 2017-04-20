import React, { Component, PropTypes } from 'react';
import { AppRegistry, ScrollView, StyleSheet,
  Text, View, TextInput, TouchableOpacity, NavigatorIOS,
  ListView, Alert, AsyncStorage, TouchableHighlight, ImagePickerIOS, Image } from 'react-native';
  import { Container, Content, Left, Body, Header, Right, ListItem, Thumbnail, Card, Title, CardItem, Item, Input, Label,  Button} from 'native-base';

  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';
var Slider = require('react-native-slider');

  import * as actionCreators from '../actions/initialAction';
  import * as loginAction from '../actions/loginAction';
  import Icons from 'react-native-vector-icons/Ionicons';


  //Import navigation components
  import MainPage from './mainPage';

  var t = require('tcomb-form-native');
  var Form = t.form.Form;

  const nameofthecategory = t.enums.of([
    'Entertainment',
    'Exercise',
    'Food',
    'Hobbies',
    'Relaxing',
    'Studying'
  ], 'nameofthecategory');

  const numberofhours = t.enums.of([
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12'

  ], 'numberofhours');



  var capacity = t.refinement(t.Number, function (n) { return n > 0; });

  capacity.getValidationErrorMessage = function (value, path, context) {
    return 'capacity cannot be less than zero: ' + context.locale;
  };

  var Activity = t.struct({
    activityTitle: t.String,
    activityDescription: t.String,
    activityCategory: nameofthecategory,
    // activityStartTime: t.Date,
    // activityDuration: numberofhours
  });

  var options = {
    fields: {
      timeStart: {
        mode: 'time'
      },
      activityTitle: {
        label: 'Title',
        placeholder: 'Activity Title',
        error: 'Title Required'
      },
      activityDescription: {
        label: 'Status',
        placeholder: 'Activity Status',
        error: 'Status Required'
      },
      activityCategory: {
        label: 'Select Category',
        placeholder: 'Select a category',
        error: 'Category Required'
      },
      activityCapacity: {
        label: 'Capacity',
        placeholder: 'Activity Capacity',
        error: 'Capacity Required or Must be a number'
      },
      activityStartTime: {
        label: 'Select Start Time',
        placeholder: 'Select a category',
        error: 'Start Time Required'
      },
      activityDuration: {
        label: 'Activity Duration',
        placeholder: 'Select a category',
        error: 'Duration Required'
      }
    }
  };


  var PinForm = React.createClass({

    getInitialState() {
      console.log('PROPS TEST', this.props)
      return {
        value: {
          activityTitle: "",
          activityDescription: "",
          activityCategory: ""
        },
        values: 0,
        position: {
          latitude: this.props.latitude,
          longitude: this.props.longitude
        },
        photoData: null
      };
    },

    submitForm(){
    },

    categoryList(){
      var sports = [{name: 'Entertainment',
                    iconName: 'ios-beer',
                    color: 'red'
                    },
                    {name: 'Exercise',
                   iconName: 'md-walk',
                   color: 'green'
                    },
                     {name: 'Food',
                   iconName: 'md-pizza',
                   color: 'orange'
                    },
                     {name: 'Hobbies',
                   iconName: 'ios-american-football',
                   color: 'yellow'
                    },
                     {name: 'Relaxing',
                   iconName: 'ios-desktop',
                   color: 'purple'
                    },
                     {name: 'Studying',
                   iconName: 'ios-book',
                   color: 'black'
                  },
                  {name: 'Relaxing',
                  iconName: 'ios-desktop',
                  color: 'brown'
                  },
                 ];
        return sports.map(function(category){
          return (
            <View style={{alignItems: 'center'}}>
            <View style={{backgroundColor: category.color,
              borderRadius: 22.5, height: 40, width: 40, padding: 5, justifyContent: 'center', alignItems: 'center'}}>
              <Icons style={{fontSize: 25, color: 'white', backgroundColor: 'transparent'}} name={category.iconName}>

              </Icons>
          </View>
          <Text style={{fontSize: 10}}>{category.name}</Text>
          </View>
          )

        })


    },

    pickImage() {
      // openSelectDialog(config, successCallback, errorCallback);
      var date = Date.now();
      var imgTitle =  this.props.profile.userObject.email + date + '.jpg';
      ImagePickerIOS.openSelectDialog({},
        resp => {
          var formData = new FormData();
          formData.append('file', {
            uri: resp,
            type: 'image/jpeg',
            name:  imgTitle
          });
          this.setState({photoData: formData});
          //    fetch('http://localhost:8080/postToS3', {
          //      method: 'POST',
          //      headers: {
          //        'Content-Type': 'multipart/form-data'
          //      },
          //      body: formData
          //    })
          //    .then(resp => resp.json())
          //    .then(resp => {
          //      console.log('success upload', resp);
          //      photo = resp.file.location;
          //    })
          //    .catch(resp => console.log('err upload', resp));
        },
        resp => console.log('err', resp));
        // console.log("IMAGE PICKER IOS", ImagePickerIOS.openSelectDialog)

      },

      onChange(value) {
        this.setState({ value });
      },

      onPress: function (){
        // var self = this
        // console.log("PHotoData", self.state.photoData)
        // var s3 = function(self){
        //   console.log("IN S3")
        //   return fetch('http://localhost:8080/postToS3', {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'multipart/form-data'
        //       },
        //       body: photo
        //     })
        //     .then(resp => resp.json())
        //     .then(resp => {
        //       console.log('success upload', resp.file.location);
        //       copy["activityImages"] = [resp.file.location];
        //       return copy;
        //     })
        // }
        // var createActivity = function() {
        //   console.log("CreactActivity", copy)
        //   return fetch("http://localhost:8080/createActivity", {
        //     method: 'POST',
        //     headers: {
        //       "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //       activity: copy
        //     })
        //   })
        // }
        // var doMyShit = function(photoAdded){
        //   console.log("IS PHOTO ADDED", photoAdded)
        //   if (photoAdded){
        //     return s3(self).then(createActivity).catch((resp => console.log('err upload', resp)));
        //   } else {
        //     return createActivity().catch((resp => console.log('err upload', resp)));
        //   }
        // }
        var value = this.refs.form.getValue();
        if (value) {
          var activityObject = Object.assign({}, value);
          activityObject.activityStartTime = new Date();
          activityObject.activityDuration = this.state.values;
          activityObject.activityLatitude = this.props.latitude;
          activityObject.activityLongitude = this.props.longitude;
          activityObject.activityCreator = this.props.profile.userObject._id;


        this.props.actions.createActivity(activityObject)
        this.props.navigator.replace({
          component: MainPage
        })

        }
        //   fetch('http://localhost:8080/postToS3', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'multipart/form-data'
        //     },
        //     body: photoData
        //   })
        //   .then(resp => resp.json())
        //   .then(resp => {
        //     console.log('success upload', resp);
        //     copy["activityImages"] = [resp.file.location];
        //   }).then(() => {
        //     fetch("http://localhost:8080/createActivity", {
        //       method: 'POST',
        //       headers: {
        //         "Content-Type": "application/json"
        //       },
        //       body:
        //       JSON.stringify({
        //         activity: copy
        //       })
        //     })
        //     photoData = null;
        //   }).catch(resp => console.log('err upload', resp));
        // }
        // this.setState({photo: ["defaultimage.jpg"]});
      },

      render() {
        const { profile } = this.props;
        return(
          <View style={styles.container}>
          <Text style={{fontSize: 25, fontWeight: '700', color: '#323232', margin: 20, textAlign: 'center'}}>Pin A Task </Text>
          <ScrollView keyboardShouldPersistTaps="always" style={{paddingLeft:10,paddingRight:10, height:500}}>
          <Form
          ref="form"
          type={Activity}
          options={options}
          value={this.state.value}
          onChange ={this.onChange.bind(this)}
          />
        <Text style={{fontSize: 16, fontWeight: '500'}}>Select Duration (Hrs)</Text>
          <Slider
            value={this.state.values}
            onValueChange={(values) => this.setState({values})}
            step={0.5}
            maximumValue={12}
            minimumTrackTintColor={'green'}
            thumbTintColor={'green'}
            thumbTouchSize={{width: 100, height: 100}} />
          <Text>Value: {this.state.values}</Text>
          <Button block success onPress={this.onPress} style={{marginTop: 10}}>
              <Text style={{color: 'white', fontWeight: '500', fontSize: 20}}> Submit </Text>
          </Button>
          </ScrollView>

          </View>

        )
      }

    })

    var styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 20,
        padding: 20,
        backgroundColor: '#ffffff',
      },
      title: {
        fontSize: 30,
        alignSelf: 'center',
        marginBottom: 30
      }

    });

    function mapStateToProps(state) {
      return {
        login: state.get('login'),
        profile: state.get('profile'),
        activitiesPageState: state.get('activityPageState')

      };
    }

    function mapDispatchToProps(dispatch) {
      return {
        actions: bindActionCreators(actionCreators, dispatch)
      };
    }

    export default connect(mapStateToProps, mapDispatchToProps)(PinForm);
