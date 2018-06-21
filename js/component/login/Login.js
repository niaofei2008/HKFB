/**
 * Created by Jason on 2017/510/19.
 */


import React, {Component} from 'react'
import {
    Animated,
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    ScrollView,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Modal,
    ActivityIndicator,
    Linking,
    Platform,
} from 'react-native'
import {Container, Content, Form, Item, Input, Button,
    Label, Header, Left, body, Right, Body, Title} from "native-base";
import Toast from 'react-native-simple-toast';
import {NavigationActions} from 'react-navigation'

import Login from '../../utils/login/Login'
import {
    gStyles,
    gSizes,
    gColors,
    IOS
} from '../../utils/GlobalData';
import sources from '../../../images/_sources'
import JPushModule from 'jpush-react-native'

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        //TODO
        this.state = {
            username: '',
            password: '',
            isLoading: false,
            isModal: false,
            firstLoad: '0',
        };
    };

    componentDidMount() {
        storage.load({key: 'firstLoad'})
            .then(ret => {
                if (ret) {
                    this.setState({
                        firstLoad: '2',
                    })
                } else {
                    this.setState({
                        firstLoad: '1',
                    })
                }
            })
            .catch(err => {
                this.setState({
                    firstLoad: '1',
                })
            })
    }

    componentWillUnmount() {
    }
    _renderScrollView() {
        return (
            <ScrollView style={{flex:1}}
                                contentContainerStyle={{height:gSizes.screen_height,width:gSizes.screen_width*4}}
                                horizontal={true}
                                pagingEnabled={true}>
                        <Image source={sources.welcome01} resizeMode='stretch' style={{flex:1,height:gSizes.screen_height,width:gSizes.screen_width}}/>
                        <Image source={sources.welcome02} resizeMode='stretch' style={{flex:1,height:gSizes.screen_height,width:gSizes.screen_width}}/>
                        <Image source={sources.welcome03} resizeMode='stretch' style={{flex:1,height:gSizes.screen_height,width:gSizes.screen_width}}/>
                        <TouchableWithoutFeedback onPress={() => {
                            storage.save({
                                key: 'firstLoad',
                                data: '2',
                                expires: null
                            });
                            
                            this.setState({
                                firstLoad:'2'
                            })
                        }}>
                            <Image source={sources.welcome04} resizeMode='stretch' style={{flex:1,height:gSizes.screen_height,width:gSizes.screen_width}}/>
                        </TouchableWithoutFeedback>
                    </ScrollView>
        )
    }
    _renderData(){
        
                return (
                    <Container style={{backgroundColor:gColors.page_gray,flex:1}}>
                        <Content keyboardShouldPersistTaps={"handled"}>
                            <Header style={{backgroundColor: '#fff'}}>
                                <Left style={{flex: 1}} />
                                <Body style={{flex: 1, alignItems:'center'}}>
                                    <Title style={{color: 'black'}}>登录</Title>
                                </Body>
                                <Right style={{flex: 1}}/>
                            </Header>
                            <Image
                                source={sources.login_banner}
                                style={styles.bg}>
                            </Image>
                            <TextInput
                                style={styles.textInput}
                                // maxLength={11}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                underlineColorAndroid="transparent"
                                defaultValue={this.state.username}
                                onChangeText={(username) => this.setState({username})}
                                placeholder='请输入账号'/>
                            <TextInput
                                style={[styles.textInput, {marginTop: 2}]}
                                // maxLength={20}
                                underlineColorAndroid="white"
                                defaultValue={this.state.password}
                                secureTextEntry={true}
                                onChangeText={(password) => this.setState({password})}
                                placeholder='密码'/>

                            <View style={[styles.loginBtnBg,{backgroundColor:this.state.username && this.state.password ? gColors.primary : 'rgb(170,170,170)'}]}>
                                <TouchableHighlight style={styles.loginBtn} onPress={this._login.bind(this)}>
                                    <Text style={[gStyles.text_normal, {color: 'white'}]}>登录</Text>
                                </TouchableHighlight>
                            </View>
                        </Content>
                        <Modal
                            animationType={"fade"}
                            transparent={true}
                            visible={this.state.isModal}
                            onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                            <ActivityIndicator
                                style={{marginTop:450}}
                                animating={this.state.isLoading}
                                color="#999"
                                size="large"/>
                        </Modal>
                    </Container>
                );
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.firstLoad === '0' ?
                        <View style={{flex: 1, backgroundColor: gColors.page_gray}} />
                    : this.state.firstLoad === '1' ?
                        this._renderScrollView()
                        :
                    this._renderData()
                }
            </View>
        );

    };

    _login(){
        if (this.state.username === '' || this.state.password === '') {
            Toast.show('请将信息填写完整')
        } else {
            this.setState({
                isLoading: true,
                isModal: true
            })
            Login.login(this.state.username, this.state.password)
                .then((res) => {
                    console.log('res', res);
                    this.setState({
                        isLoading: false,
                        isModal: false,
                    })
                    JPushModule.setAlias(res.uIdx.toString(), map => {
                        if (map.errorCode === 0) {
                            // Toast.show('success')
                            console.log('set alias succeed', res.uIdx.toString())
                        } else {
                            // Toast.show('faid', map.errorCode)
                            console.log('set alias failed, errorCode: ' + map.errorCode)
                        }
                    })
                    storage.save({
                        key: 'userInfoKey',
                        data: {
                            idx: res.uIdx,
                            currentProjectIdx: res.currentProjectIdx,
                            name: res.trueName,
                            unitName: res.unitName,
                            imgHeader: res.imgHeader,
                            isFuZheRen: res.isFuZheRen,
                            ZhiQinUnitIdx_Fx: res.ZhiQinUnitIdx_Fx,
                            uMobile: res.uMobile,

                        }
                    })
                    .then(res => {
                        // console.log(res);
                        const resetAction = NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({routeName: 'Launch'})//要跳转到的页面名字
                            ]
                        });
                        this.props.navigation.dispatch(resetAction);
                    });
                })
                .catch(err => {
                    this.setState({
                        isLoading: false,
                        isModal: false,
                    })
                    Toast.show(err)
                    console.log('err', err);
                })
        }
    }
}


let styles = StyleSheet.create({
    container: {
        backgroundColor: gColors.page_gray,
        flex: 1,
    },
    bg: {
        width: gSizes.screen_width,
        height: 200,
    },
    textInput: {
        marginTop: 10,
        width: gSizes.screen_width,
        height: gSizes.singleLineInput,
        backgroundColor: 'white',
        paddingHorizontal: gSizes.space_screen
    },
    loginBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    loginBtnBg: {
        marginTop: 10,
        width: gSizes.screen_width - gSizes.space_screen * 2,
        height: gSizes.singleLineInput,
        borderRadius: gSizes.btnRadius,
        alignSelf:'center'
    }
});
