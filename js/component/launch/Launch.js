import React, { Component } from 'react';
import { View, Platform, DeviceEventEmitter } from 'react-native';
import HomePage from '../router/HomePage';
import Login from '../login/Login';
import RongYunNet from '../../utils/rongyun/RongYun'
import RongCloud from 'rongcloud-imlib-react-native'
import GetSetStorage from '../../asyncStorage/GetSetStorage'
import AddressBookNet from '../../utils/addressBook/AddressBook'

export default class Launch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            idx: '',
            checkDone: false,
        }
    }
    componentDidMount() {
        this.checkLogin();
        // storage.remove({key: 'userInfoKey'});
        
    }
    componentWillUnmount() {
        console.log('***************')
        
    }
    onReceiveMessage = () => {
        RongCloud.onReceived(res => {
            console.log('Launch监听', res);
            DeviceEventEmitter.emit('newMessage', res.message);
        })
    }
    checkLogin = () => {
        storage.load({key: 'userInfoKey'})
            .then(ret => {
                console.log(ret)
                RongCloud.getConnectionStatus()
                    .then(data => {
                        console.log('status', data)
                        if (data !== 0) {
                            RongYunNet.getToken(ret.idx, ret.trueName, HOST_UPLOAD + ret.imgHeader)
                                .then(result => {
                                    RongCloud.connectWithToken(result)
                                        .then(datas => {
                                            console.log('连接成功', datas)
                                            this.onReceiveMessage();
                                        })
                                        .catch(err => {
                                            console.log('err', err)
                                        })
                                })
                                .catch(err => {
                                    console.log('err', err)
                                })
                        } else {
                            console.log('已经连接');
                            this.onReceiveMessage();
                        }
                    })
                // 存储人员信息
                AddressBookNet.info()
                    .then(res => {
                        GetSetStorage.storeUserbyid(res);
                    })
                    .catch(err => {
                        console.log('err', err);
                    })
                
                this.setState({
                    idx: ret.idx,
                    checkDone: true,
                })
            })
            .catch(err => {
                this.setState({
                    checkDone: true,
                })
                console.log('err_login', err);
            })
    }
    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                {
                    this.state.checkDone ?
                        this.state.idx ? 
                            <HomePage screenProps={{navigation:this.props.navigation}} />
                            : 
                            <Login navigation={this.props.navigation} />
                            : null
                }
            </View>
        )
    }
}