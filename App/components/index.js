
import React, { Component } from 'react';
import { Navigator, View } from 'react-native';

import MainPage from './mainPage';
import CreatePost from './createPost';


export default class Index extends Component {
  renderScene(route, navigator) {
    const {state,actions} = this.props;
    const routeId = route.id;

    if (routeId === 'Main') {
      return (
        <MainPage
          {...this.props}
          navigator={navigator}
        />
      );
    }
    if (routeId === 'CreatePost') {
      return (
        <CreatePost
          {...this.props}
          navigator={navigator}
        />
      );
    }
  }
  render(){
    const {actions } = this.props;
      return (
        <View style={{ flex:1 }}>
        <Navigator
          style={{ flex:1 }}
          ref={'NAV'}
          initialRoute={{ id: 'Main', name: 'Main' }}
          renderScene={this.renderScene.bind(this)}
          configureScene={(route, routeStack) =>
            Navigator.SceneConfigs.FloatFromBottom}

        />
      </View>
      )
    }
}
module.exports = Index;
