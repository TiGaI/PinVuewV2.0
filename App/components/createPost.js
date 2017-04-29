import React, { Component, PropTypes } from 'react';
import { AppRegistry, ScrollView, StyleSheet, Text, View,
  TextInput, TouchableOpacity, NavigatorIOS, ListView, Dimensions, Alert, AsyncStorage, Image } from 'react-native';
import { Item, Input, Tab, Tabs,Spinner, List, ListItem } from 'native-base';
import Icons from 'react-native-vector-icons/Ionicons';

import Icon from 'react-native-vector-icons/Ionicons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/initialAction';
import * as loginAction from '../actions/loginAction';
import MapView from 'react-native-maps';
var Slider = require('react-native-slider');

//Import navigation components
import PinForm from './pinForm'

var { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const LATITUDE = 1;
const LONGITUDE = 1;

const LATITUDE_DELTA = 0.03;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class CreatePost extends Component {

  constructor(props){
    super(props);
    console.log('CREATE PAGE PROPS', this.props)
    // console.log('USER ID', this.props.profile.userObject._id)
    this.state = {
      initialPosition: {
        latitude: LATITUDE,
        longitude: LATITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      currentPosition: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      values: 0,
      text: 'Useless Placeholder'
    }
  }
  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA

        }});

      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
      this.watchID = navigator.geolocation.watchPosition((position) => {
      var currentPosition = JSON.stringify(position);
      this.setState({currentPosition: {
        latitude: (position.coords.latitude) / 1.00022741,
        longitude: position.coords.longitude - 0.001,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }});

    });

  }
  componentWillUnmount (){
  navigator.geolocation.clearWatch(this.watchID);
}
createPin(){
    this.props.navigator.push({
      component: PinForm,
      backButtonTitle: 'CreatePin',
      passProps: {
        latitude: this.state.latitude,
        longitude: this.state.longitude
      }
    })
  }
  render() {
    var e = 1;
    return(
      <View style={{flex: 1}}>
        <View style={styles.rowOne}>
          <View style={styles.rowOneData}>
            <Text style={styles.rowOneText}>Break</Text>
          </View>
          <View style={styles.rowOneData}>
            <Text style={styles.rowOneText}>Commuting</Text>
          </View>
          <View style={styles.rowOneData}>
            <Text style={styles.rowOneText}>Eating</Text>
          </View>
        </View>
        <View style={styles.rowOne}>
          <View style={styles.rowOneData}>
            <Text style={styles.rowOneText}>Internet</Text>
          </View>
          <View style={styles.rowOneData}>
            <Text style={styles.rowOneText}>Sleep</Text>
          </View>
          <View style={styles.rowOneData}>
            <Text style={styles.rowOneText}>Studying</Text>
          </View>
        </View>
        <View style={styles.rowOne}>
          <View style={styles.rowOneData}>
            <Text style={styles.rowOneText}>Training</Text>
          </View>
          <View style={styles.rowOneData}>
            <Text style={styles.rowOneText}>Work</Text>
          </View>
        </View>
        <View style={styles.slider}>
        <Text style={{fontSize: 16, fontWeight: '500', marginBottom: 20}}>Select Duration (Hrs)</Text>
        <Slider
          value={this.state.values}
          onValueChange={(values) => this.setState({values})}
          step={0.5}
          maximumValue={12}
          minimumTrackTintColor={'#3F8EFF'}
          thumbTintColor={'#3F8EFF'}
          thumbTouchSize={{width: 100, height: 100}} />
        <Text>Value: {this.state.values}</Text>
        </View>
        <View style={styles.textInput}>
        <Text style={{fontSize: 16, fontWeight: '500', marginBottom: 20}}>Status</Text>
          <TextInput
          style={{height: 100, borderColor: 'gray', borderWidth: 1, borderRadius: 5, justifyContent: 'flex-start'}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          editable = {true}
          maxLength = {10}
          />
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: 10,
    backgroundColor: 'transparent',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  rowOne: {
    flexDirection: 'row'
  },
  rowOneData: {
    flex: 1,
    backgroundColor: '#3F8EFF',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10
  },
  rowOneText: {
    padding: 5,
    backgroundColor: 'transparent',
    color: 'white',
    fontWeight: '500'
  },
  slider: {
    flex: 1,
    padding: 20
  },
  textInput: {
    flex: 2,
    padding: 20
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
        actions: bindActionCreators(actionCreators, dispatch),
        loginActions: bindActionCreators(loginAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);
