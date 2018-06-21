/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MainStackRouter from './js/component/router/MainStackRouter'
import JPushModule from 'jpush-react-native'
import RongCloud from 'rongcloud-imlib-react-native'

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // 开发环境: x18ywvqfxbywc
    RongCloud.initWithAppKey('x18ywvqfxbywc');

    if (Platform.OS === 'android') {
      JPushModule.initPush()
      JPushModule.notifyJSDidLoad(resultCode => {
        if (resultCode === 0) {

        }
      })
    }
    if (Platform.OS === 'ios') {
      JPushModule.setupPush();
    }
    
  }
  render() {
    return <MainStackRouter />
  }
}
