import React, { Component, PropTypes } from 'react';
import { AppRegistry, ScrollView, StyleSheet,
  Text, View, TextInput, TouchableOpacity, NavigatorIOS,
  ListView, Alert, AsyncStorage, TouchableHighlight, ImagePickerIOS, Image,
  NativeModules, Dimensions } from 'react-native';
  import { Container, Content, Left, Body, Header, Right, ListItem, Thumbnail, Card, Title, CardItem, Item, Input, Label,  Button} from 'native-base';

  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';


  import * as actionCreators from '../actions/initialAction';
  import * as loginAction from '../actions/loginAction';
  import Icon from 'react-native-vector-icons/Ionicons';

  import Video from 'react-native-video';
  import ImagePicker from 'react-native-image-crop-picker';
  import { RNS3 } from 'react-native-aws3';

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
    activityNote: t.String,
    activityCategory: nameofthecategory,
    activityDuration: numberofhours
  });

  var options = {
    fields: {
      activityNote: {
        label: 'Description',
        placeholder: 'Note',
      },
      activityCategory: {
        label: 'Select Category',
        placeholder: 'Select a category',
        error: 'Category Required'
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
        position: {
          latitude: this.props.latitude,
          longitude: this.props.longitude
        },
        image: null,
        images: null
      };
    },

    submitForm(){
    },


      onChange(value) {
        this.setState({ value });
      },
      pickSingleWithCamera(cropping) {
        ImagePicker.openCamera({
          cropping: cropping,
          width: 500,
          height: 500,
        }).then(image => {
          console.log('received image', image);
          this.setState({
            image: {uri: image.path, width: image.width, height: image.height},
            images: null
          });
        }).catch(e => alert(e));
      },

      pickSingleBase64(cropit) {
        ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: cropit,
          includeBase64: true
        }).then(image => {
          console.log('received base64 image');
          this.setState({
            image: {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height},
            images: null
          });
        }).catch(e => alert(e));
      },

      cleanupImages() {
        ImagePicker.clean().then(() => {
          console.log('removed tmp images from tmp directory');
        }).catch(e => {
          alert(e);
        });
      },

      cleanupSingleImage() {
        let image = this.state.image || (this.state.images && this.state.images.length ? this.state.images[0] : null);
        console.log('will cleanup image', image);

        ImagePicker.cleanSingle(image ? image.uri : null).then(() => {
          console.log(`removed tmp image ${image.uri} from tmp directory`);
        }).catch(e => {
          alert(e);
        })
      },
      pickSingle(cropit, circular=false) {
        ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: cropit,
          cropperCircleOverlay: circular,
          compressImageMaxWidth: 640,
          compressImageMaxHeight: 480,
          compressImageQuality: 0.5,
          compressVideoPreset: 'MediumQuality',
        }).then(image => {
          console.log('received image', image);
          this.setState({
            image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
            images: null
          });
        }).catch(e => {
          console.log(e);
          Alert.alert(e.message ? e.message : e);
        });
      },
      scaledHeight(oldW, oldH, newW) {
        return (oldH / oldW) * newW;
      },
      renderVideo(video) {
        return (<View style={{height: 300, width: 300}}>
          <Video source={{uri: video.uri, type: video.mime}}
             style={{position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
              }}
             rate={1}
             paused={false}
             volume={1}
             muted={false}
             resizeMode={'cover'}
             onError={e => console.log(e)}
             onLoad={load => console.log(load)}
             repeat={true} />
         </View>);
      },

      renderImage(image) {
        return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={image} />
      },

      renderAsset(image) {
        if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
          return this.renderVideo(image);
        }

        return this.renderImage(image);
      },
      onPress: function (){
        var value = this.refs.form.getValue();
        if (value) {
          var activityObject = Object.assign({}, value);
          activityObject.activityLatitude = this.props.latitude;
          activityObject.activityLongitude = this.props.longitude;
          activityObject.activityCreator = this.props.profile.userObject._id;
          
        this.props.actions.createActivity(activityObject, this.state.image)

        // this.props.navigator.replace({
        //   component: MainPage
        // })

        }
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


          <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity style={{flex: 1, backgroundColor: 'white' ,borderWidth: 2, borderColor: 'grey', height: 70, borderRightWidth: 0}} onPress={this.pickImage}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Icon style={{fontSize: 35, color: 'grey'}} name='md-camera'/>
          <Text style={{color: 'grey'}}>Upload Photo</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, backgroundColor: 'white' ,borderWidth: 2, borderColor: 'grey', height: 70}} onPress={this.onPress}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Icon style={{fontSize: 35, color: 'grey'}} name='md-checkmark-circle'/>
          <Text style={{color: 'grey'}}>Submit</Text>
          </View>
          </TouchableOpacity>
          </View>



                    {this.state.image ? this.renderAsset(this.state.image) : null}
                    {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}


                    <TouchableOpacity onPress={() => this.pickSingleWithCamera(false)} style={styles.button}>
                      <Text style={styles.text}>Select Single With Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.pickSingleWithCamera(true)} style={styles.button}>
                      <Text style={styles.text}>Select Single With Camera With Cropping</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.pickSingle(false)} style={styles.button}>
                      <Text style={styles.text}>Select Single</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.pickSingleBase64(false)} style={styles.button}>
                      <Text style={styles.text}>Select Single Returning Base64</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.pickSingle(true)} style={styles.button}>
                      <Text style={styles.text}>Select Single With Cropping</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.pickSingle(true, true)} style={styles.button}>
                      <Text style={styles.text}>Select Single With Circular Cropping</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.cleanupImages.bind(this)} style={styles.button}>
                      <Text style={styles.text}>Cleanup All Images</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.cleanupSingleImage.bind(this)} style={styles.button}>
                      <Text style={styles.text}>Cleanup Single Image</Text>
                    </TouchableOpacity>

          </ScrollView>



          </View>



        )
      }

    })

    var styles = StyleSheet.create({
      container: {
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
