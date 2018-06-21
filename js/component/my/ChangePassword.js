import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { Button, Header, Left, Right, Body, Title, Container, Content} from "native-base";
import {gSizes, gColors, gStyles} from '../../utils/GlobalData';
import sources from '../../../images/_sources'
import MyNet from '../../utils/my/My'
import Toast from 'react-native-simple-toast'
export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: 'liyong',
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
            idx: '',
        }
    }
    componentDidMount() {
        storage.load({key: 'userInfoKey'})
            .then(ret => {
                this.setState({
                    account: ret.name,
                    idx: ret.idx,
                    unitName: ret.unitName,
                })
                
            })
    }
    _onChangeTextOld = (text) => {
        this.setState({
            oldPassword: text,
        })
    }
    _onChangeTextOne = (text) => {
        this.setState({
            newPassword: text,
        })
    }
    _onChangeTextTwo = (text) => {
        this.setState({
            newPasswordConfirm: text,
        })
    }
    render() {
        return (
            <Container style={{flex: 1, backgroundColor: gColors.page_gray}}>
                <Header style={{backgroundColor: gColors.primaryNavi}}>
                    <Left style={{flex: 1}}>
                        <Button transparent onPress={()=>{ this.props.navigation.goBack()}}>
                            <Image source={sources.ic_arrow_left} resizeMode='contain' style={{width: 20, height: 20}}/>
                        </Button>
                    </Left>
                    <Body style={{flex: 3, alignItems:'center'}}>
                        <Title>修改密码</Title>
                    </Body>
                    <Right style={{flex: 1}} />
                </Header>
                <Content style={{flex: 1}}>
                    <View style={{flex: 1,flexDirection: 'row', backgroundColor: '#fff', height: 44,
                                    borderBottomColor: gColors.page_gray_dark, borderBottomWidth: 1}}>
                        <View style={{flex: 1,justifyContent: 'center',paddingLeft: 10,
                                 height: 44}}>
                            <Text style={{color: 'black', fontSize: 16}}>账号</Text>
                        </View>
                        <View style={{flex: 3,paddingLeft: 20, justifyContent: 'center',height: 44}}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                value={`${this.state.account}-${this.state.unitName}`}
                                // onChangeText={this._onChangeText}
                                editable={false}
                            />
                        </View>
                    </View>
                    <View style={{flex: 1,flexDirection: 'row', backgroundColor: '#fff', height: 44,
                                    borderBottomColor: gColors.page_gray_dark, borderBottomWidth: 1}}>
                        <View style={{flex: 1,justifyContent: 'center',paddingLeft: 10,
                                 height: 44}}>
                            <Text style={{color: 'black', fontSize: 16}}>旧密码</Text>
                        </View>
                        <View style={{flex: 3,paddingLeft: 20, justifyContent: 'center',height: 44}}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                // keyboardType='email-address'
                                onChangeText={this._onChangeTextOld}
                                maxLength={16}
                                placeholder={'请输入当前密码'}
                                placeholderTextColor={sources.page_gray}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>
                    <View style={{flex: 1,flexDirection: 'row', backgroundColor: '#fff', height: 44,
                                    borderBottomColor: gColors.page_gray_dark, borderBottomWidth: 1}}>
                        <View style={{flex: 1,justifyContent: 'center',paddingLeft: 10,
                                 height: 44}}>
                            <Text style={{color: 'black', fontSize: 16}}>新密码</Text>
                        </View>
                        <View style={{flex: 3,paddingLeft: 20, justifyContent: 'center',height: 44}}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                // keyboardType='email-address'
                                onChangeText={this._onChangeTextOne}
                                maxLength={16}
                                secureTextEntry={true}
                                placeholderTextColor={sources.page_gray}
                                placeholder={'请输入密码'}
                            />
                        </View>
                    </View>
                    <View style={{flex: 1,flexDirection: 'row', backgroundColor: '#fff', height: 44,
                                    borderBottomColor: gColors.page_gray_dark, borderBottomWidth: 1}}>
                        <View style={{flex: 1,justifyContent: 'center',paddingLeft: 10,
                                 height: 44}}>
                            <Text style={{color: 'black', fontSize: 16}}>确认新密码</Text>
                        </View>
                        <View style={{flex: 3,paddingLeft: 20, justifyContent: 'center',height: 44}}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                // keyboardType='email-address'
                                onChangeText={this._onChangeTextTwo}
                                maxLength={16}
                                secureTextEntry={true}
                                placeholderTextColor={sources.page_gray}
                                placeholder={'再次输入您的密码'}
                            />
                        </View>
                    </View>
                </Content>
                <TouchableOpacity
                        onPress={() => {
                            if (this.state.newPassword !== this.state.newPasswordConfirm) {
                                Toast.show('两次密码输入不一致')
                                return
                            }
                            MyNet.editPassword(this.state.idx, this.state.oldPassword, this.state.newPasswordConfirm)
                                .then(res => {
                                    Toast.show('密码修改成功')
                                    this.props.navigation.goBack()
                                })
                                .catch(err => {
                                    Toast.show(err);
                                    console.log('err', err);
                                    
                                })
                            
                        }}
                        style={{width: gSizes.screen_width - 40, height: 44, justifyContent: 'center',marginHorizontal: 20,
                            alignItems: 'center', borderRadius: 4, backgroundColor: gColors.primaryNavi, bottom: 20,position:'absolute'}}
                    >
                        <Text style={{fontSize: 16, color: '#fff'}}>确认修改</Text>
                </TouchableOpacity>
            </Container>
        )
    }
}