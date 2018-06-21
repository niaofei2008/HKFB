import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    WebView,
    Image,
    TouchableWithoutFeedback,
    ScrollView,
    TouchableHighlight,
    ImageBackground,
    Alert,
} from 'react-native';
import {Container, Content, Form, Item, Input, Button,
    Label, Header, Left, Right, Body, Title} from "native-base";
import {gSizes, gColors, gStyles} from '../../utils/GlobalData';
import sources from '../../../images/_sources';
import LineInfoView from '../../widgets/LineInfoView';
import {NavigationActions} from 'react-navigation'
import MyNet from '../../utils/my/My'
import ActionSheetModal from '../../widgets/ActionSheetModal'
import ImagePicker from 'react-native-image-crop-picker'
import RongCloud from 'rongcloud-imlib-react-native'

export default class My extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            unitName: '',
            imgHeader: '',
            showModal: false,
            ret: {},
            isFuZheRen: '',
        }
    }
    componentDidMount(){
        storage.load({key: 'userInfoKey'})
            .then(ret => {
                this.setState({
                    name: ret.name,
                    unitName: ret.unitName,
                    imgHeader: ret.imgHeader,
                    idx: ret.idx,
                    isFuZheRen: ret.isFuZheRen,
                    ret: ret,
                })
            })
    }
    render() {
        return (
            <Container style={{flex: 1, backgroundColor: 'white'}}>
                <Header style={{backgroundColor: gColors.primaryNavi}}>
                    <Left style={{flex: 1}} />
                    <Body style={{flex: 1, alignItems:'center'}}>
                        <Title>我的</Title>
                    </Body>
                    <Right style={{flex: 1}}/>
              </Header>
            <ScrollView>
                <ImageBackground
                    source={sources.user_bg}
                    style={styles.bg}>
                    <TouchableWithoutFeedback onPress={() => {
                        Alert.alert(
                            '提醒',
                            '上传头像',
                            [
                                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: '确定', onPress: () => {
                                    this.setState({
                                        showModal: true,
                                    })
                                    // MyNet.uploadAvatar()
                                }},
                                {text: '取消', onPress: () => {
                                    
                                }},
                            ],
                            // { cancelable: false }
                        )
                    }}>
                        <Image
                            source={this.state.imgHeader ? {uri:HOST_UPLOAD + this.state.imgHeader} : sources.defaultAvatar}
                            style={gStyles.ic_head}/>
                    </TouchableWithoutFeedback>
                    <Text style={[gStyles.text_normal,{color:gColors.text_normal,marginTop:gSizes.space_border}]}>
                        {this.state.name}{this.state.isFuZheRen === 'yes' ? '·' : ''}
                        </Text>
                    <Text style={[gStyles.text_normal,{color:gColors.text_normal,marginTop:gSizes.space_border}]}>{this.state.unitName}</Text>
                </ImageBackground>
                <LineInfoView
                    style={[gStyles.padding_horizontal,gStyles.divider_bottom]}
                    paddingVertical={gSizes.space_screen}
                    text = '签到历史'
                    tipImage = {sources.signHistory}
                    showDivider={false}
                    onPress={()=>{
                        this.props.screenProps.navigation.navigate('SignHistory');
                    }}
                />
                <LineInfoView
                    style={[gStyles.padding_horizontal,gStyles.divider_bottom]}
                    paddingVertical={gSizes.space_screen}
                    text = '任务列表'
                    tipImage = {sources.taskList_my}
                    showDivider={false}
                    onPress={()=>{
                        this.props.screenProps.navigation.navigate('TaskList')
                    }}
                />
                <LineInfoView
                    style={[gStyles.padding_horizontal,gStyles.divider_bottom,]}
                    paddingVertical={gSizes.space_screen}
                    text = '手机更改'
                    tipImage = {sources.phone_my}
                    showDivider={false}
                    onPress={()=>{
                        this.props.screenProps.navigation.navigate('ChangePhone')
                    }}
                />
                <LineInfoView
                    style={[gStyles.padding_horizontal,gStyles.divider_bottom]}
                    paddingVertical={gSizes.space_screen}
                    text = '修改密码'
                    tipImage = {sources.changePsd}
                    showDivider={false}
                    onPress={()=>{
                        this.props.screenProps.navigation.navigate('ChangePassword')
                    }}
                />
                <LineInfoView
                    style={[gStyles.padding_horizontal,gStyles.divider_bottom]}
                    paddingVertical={gSizes.space_screen}
                    text = '意见反馈'
                    tipImage = {sources.suggestion}
                    showDivider={false}
                    onPress={()=>{
                        this.props.screenProps.navigation.navigate('Suggestion')
                    }}
                />
                <LineInfoView
                    style={[gStyles.padding_horizontal,gStyles.divider_bottom]}
                    paddingVertical={gSizes.space_screen}
                    text = '我的消息'
                    tipImage = {sources.myNotice}
                    showDivider={false}
                    onPress={()=>{
                        this.props.screenProps.navigation.navigate('NoticeInfomation')
                    }}
                />
                <View style={[styles.loginBtnBg,{backgroundColor:'red'}]}>
                    <TouchableHighlight style={styles.loginBtn} onPress={this._loginout} underlayColor={gColors.page_gray_dark}>
                        <Text style={[gStyles.text_normal, {color: 'white'}]}>退出登录</Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
            <ActionSheetModal
                    cellsArr={['拍照','从手机相册选择']}
                    actionvisible={this.state.showModal}
                    cancelFunc={()=> this.setState({showModal: false})}
                    onPress={(index)=> this._onPickPhotoModalItemPress(index)}
                />
        </Container>
        )
    }
    _onPickPhotoModalItemPress(index) {
        if (index === 0) {
            //打开相机
            ImagePicker.openCamera({width: 300, height: 400, cropping: true, includeBase64: true,})
                .then(image => {
                    let picture =  image;
                    let path = picture.path;
                    let names = path.split('/');
                    let name = names[names.length - 1];
                    let obj = {};
                    obj.idx = this.state.idx;
                    obj['file0'] = {
                        uri: path,
                        name: name,
                        type: 'multipart/form-data',
                    }
                    MyNet.uploadAvatar(obj)
                        .then(res => {
                            this.setState({
                                imgHeader: res,
                                ret: Object.assign(this.state.ret, {imgHeader: res}),
                            }, () => {
                                storage.save({
                                    key: 'userInfoKey',
                                    data: this.state.ret,
                                })
                            })
                        })
                        .catch(err => {
                            console.log('err', err);
                        })
                    this.setState({
                        showModal: false,
                    })
                });
        } else {
            //打开相册
            ImagePicker.openPicker({width: 300, height: 400, maxFiles: 1, cropping: true, includeBase64: true})
                .then(image => {
                    // console.log('image', image)
                    let picture = image;
                    let path = picture.path;
                    let names = path.split('/');
                    let name = names[names.length - 1];
                    let obj = {};
                    obj.idx = this.state.idx;
                    obj['file0'] = {
                        uri: path,
                        name: name,
                        type: 'multipart/form-data',
                    }
                    MyNet.uploadAvatar(obj)
                        .then(res => {
                            this.setState({
                                imgHeader: res,
                                ret: Object.assign(this.state.ret, {imgHeader: res}),
                            }, () => {
                                storage.save({
                                    key: 'userInfoKey',
                                    data: this.state.ret,
                                })
                            })
                            
                            
                        })
                        .catch(err => {
                            console.log('err', err);
                        })
                    this.setState({
                        showModal: false,
                    })
                });
        }
    }
    _loginout = () => {
        storage.remove({key: 'userInfoKey'});
        RongCloud.disconnect(true)
            .then(data => {
                if (data[1] === 'disconnect success') {
                    console.log('断开连接')
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({routeName: 'Launch'})//要跳转到的页面名字
                        ]
                    });
                    this.props.screenProps.navigation.dispatch(resetAction);
                }
            })
        
    }

    _pressHeader(){

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: gColors.page_gray,
    },
    bg: {
        width: gSizes.screen_width,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    loginBtnBg: {
        width: gSizes.screen_width - gSizes.space_screen * 2,
        height: gSizes.singleLineInput,
        borderRadius: gSizes.btnRadius,
        alignSelf:'center',
        marginVertical: gSizes.space_border
    }
});