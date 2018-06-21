import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    Modal,
} from 'react-native';
import { Button, Header, Left, Right, Body, Title, Container, Content} from "native-base";
import {gSizes, gColors, gStyles} from '../../utils/GlobalData';
import sources from '../../../images/_sources'
import MyNet from '../../utils/my/My'
import {NavigationActions} from 'react-navigation'
export default class SighHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newNumber: '',
            modalVisible: false,
            isSuccess: true,
            stateMsg: '',
            oldNumber: '',
            idx: '',
            oldRet: {},
        }
    }
    _onChangeText = (text) => {
        this.setState({
            newNumber: text,
        })
    }
    componentDidMount() {
        storage.load({key: 'userInfoKey'})
            .then(ret => {
                this.setState({
                    idx: ret.idx,
                    oldNumber: ret.uMobile,
                    oldRet: ret,
                })
            })
    }
    render() {
        return (
            <Container style={{flex: 1, backgroundColor: gColors.page_gray}}>
                <Header style={{backgroundColor: gColors.primaryNavi}}>
                    <Left style={{flex: 1}}>
                        <Button transparent onPress={()=>{ this.props.navigation.goBack()}}>
                            <Text style={{color: '#fff'}}>取消</Text>
                        </Button>
                    </Left>
                    <Body style={{flex: 3, alignItems:'center'}}>
                        <Title>更换手机号</Title>
                    </Body>
                    <Right style={{flex: 1}} />
                </Header>
                <Content style={{flex: 1,}} keyboardShouldPersistTaps={"handled"}>

                <View style={{flex: 1,alignItems: 'center', justifyContent: 'space-between'}}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{marginTop: 20}}>更换手机后,下次登录可使用新手机号登录</Text>
                        <Text>当前手机号:</Text>
                        <Text style={{fontSize: 16, color: 'black', marginTop: 10}}>
                            {this.state.oldNumber}
                        </Text>
                        <View style={{flexDirection: 'row', backgroundColor: '#fff', height: 44, width: gSizes.screen_width, marginTop: 60}}>
                            <View style={{borderRightWidth: 1, borderRightColor: gColors.page_gray, justifyContent: 'center',
                                    alignItems: 'center', width: 60, height: 44}}>
                                <Text style={{color: 'black', fontSize: 16}}>+86</Text>
                            </View>
                            <View style={{paddingLeft: 20, justifyContent: 'center', width: gSizes.screen_width-60,height: 44}}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    onChangeText={this._onChangeText}
                                    maxLength={20}
                                    style={{fontSize: 16}}
                                />
                            </View>
                        </View>
                    </View>
                    
                </View>
                
                </Content>
                <TouchableOpacity
                        onPress={() => {
                            MyNet.editPhone(this.state.idx, this.state.newNumber)
                                .then(res => {
                                    storage.save({
                                        key: 'userInfoKey',
                                        data: Object.assign(this.state.oldRet, {uMobile: this.state.newNumber})
                                    })
                                    this.setState({
                                        isSuccess: true,
                                        modalVisible: true,
                                    })
                                })
                                .catch(err => {
                                    this.setState({
                                        isSuccess: false,
                                        modalVisible: true,
                                    })
                                    console.log('err', err);
                                })
                            
                        }}
                        style={{width: gSizes.screen_width - 40, height: 44, justifyContent: 'center',marginHorizontal: 20,
                            alignItems: 'center', borderRadius: 4, backgroundColor: '#fff', bottom: 20,position:'absolute'}}
                    >
                        <Text style={{fontSize: 16, color: gColors.primaryNavi}}>确认</Text>
                </TouchableOpacity>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    onRequestClose={() => {}}
                    visible={this.state.modalVisible}
                    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                >
                    <View style={{width: gSizes.screen_width, height: gSizes.screen_height,position: 'absolute', opacity: 0.7, backgroundColor: 'black'}} />
                    <View style={{position: 'absolute', width: gSizes.screen_width, height: gSizes.screen_height,
                                    justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{alignItems: 'center', justifyContent: 'center', width: 250, height: 150, backgroundColor: '#fff'}}>
                            <Image source={this.state.isSuccess ? sources.sign_success : sources.warn_sign} style={{width: 60, height: 60}} resizeMode='contain' />
                            <Text style={{marginTop: 10}}>{this.state.isSuccess ? '更换成功,请重新登录' : '修改失败'}</Text>
                        </View>
                        <TouchableOpacity
                            style={{marginTop: 20}}
                            onPress={() => { 
                                this.setState({
                                    modalVisible: false
                                }, () => {
                                    storage.remove({key: 'userInfoKey'})
                                    const resetAction = NavigationActions.reset({
                                        index: 0,
                                        actions: [
                                            NavigationActions.navigate({routeName: 'Launch'})//要跳转到的页面名字
                                        ]
                                    });

                                    this.state.isSuccess && this.props.navigation.dispatch(resetAction);
                                })
                            }}
                        >
                            <Image  source={sources.sign_cancel} style={{width: 30, height: 30}} resizeMode='contain' />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </Container>
        )
    }
}