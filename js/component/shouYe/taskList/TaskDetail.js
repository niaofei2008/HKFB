import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Linking
} from 'react-native';
import PropTypes from 'prop-types';
import { Button, Header, Left, Right, Body, Title, Container} from "native-base";

import {gSizes, gColors, gStyles} from '../../../utils/GlobalData';
import EditinfoView from "../../../widgets/EditinfoView";
import sources from "../../../../images/_sources";
import TextMore from "../../../widgets/TextMore";
import PhotoBrowserModal from "../../../widgets/PhotoBrowserModal";
import PictureView from "../../../widgets/PictureView";
import TaskListDetailNet from '../../../utils/taskPublish/TaskPublish'
import Toast from 'react-native-simple-toast'

export default class TaskListDetail extends Component {

    static propTypes = {
        idx: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
            dealUserIdx_Fx: null,
            dealTime: null,
            writetext: '',
            images: '',
            visible: false,
            singleImage:'',
            floorGridIdx_Fx:'',
            dealRemark: '',
            reportUserPhone: '',
            bottomimages: '',
            leaderIdx_Fx: null,
            typeName: '未填写',
            dealName: '未填写',
        }
    }
    _getTaskInfo = (idx = this.props.navigation.state.params.idx) => {
        TaskListDetailNet.taskInfoOne(idx)
            .then(res => {
                this.setState({
                    taskContent: res.taskContent,
                    taskState: res.taskState,
                    createdate: res.createdate,
                    receiveName: res.receiveName,
                    images: res.taskImage,
                    trueName: res.trueName,
                    userIdx_receive: res.userIdx_receive,
                    HandleName1: res.HandleName1,
                    dealExpectTime: res.dealExpectTime,
                    currentIdx: res.idx,
                    dealContent: res.dealContent,
                    dealImage: res.dealImage,
                    userIdx_send: res.userIdx_send,
                })
            })
            .catch(err => {
                console.log('err', err);
            })
    }
    componentDidMount() {
        storage.load({key: 'userInfoKey'})
            .then(ret => {
                this.setState({
                    idx: ret.idx,
                    name: ret.name,
                })
            })
        this._getTaskInfo();
    }
    render() {
        return (
            <Container style={styles.container}>
                <Header style={{backgroundColor: gColors.primaryNavi}}>
                    <Left style={{flex: 1}}>
                        <Button transparent onPress={()=>{ this.props.navigation.goBack()}}>
                            <Image source={sources.ic_arrow_left} resizeMode='contain' style={{width: 20, height: 20}}/>
                        </Button>
                    </Left>
                    <Body style={{flex: 1, alignItems:'center'}}>
                        <Title>任务详情</Title>
                    </Body>
                    <Right style={{flex: 1}}/>
                </Header>
                <ScrollView style={styles.container}>
                    <View style={{height: 30, backgroundColor: gColors.page_gray}}>
                        <Text style={[gStyles.text_small, styles.tipText]}>基本信息</Text>
                    </View>
                    {/* <EditinfoView
                        tip='网格图'
                        tipImage={sources.tab02_location}
                        text={this.state.floor}
                        onPress={() => {Actions.SelectFloorScreen({idx:this.state.floorGridIdx_Fx})}}
                    /> */}
                    <EditinfoView
                        tip='下发人员'
                        showArrow={false}
                        placeholder='未填写'
                        text={this.state.trueName}
                        tipImage={sources.defaultAvatar}
                        onPress={()=> {}}
                    />
                    <EditinfoView
                        tip='接收人员'
                        showArrow={false}
                        placeholder='未填写'
                        text={this.state.receiveName}
                        tipImage={sources.defaultAvatar}
                        onPress={()=> {}}
                    />
                    <EditinfoView
                        tip='下发时间'
                        showArrow={false}
                        tipImage={sources.tab02_time}
                        text={this.state.createdate}
                        onPress={() => {
                        }}
                    />
                    {/*<EditinfoView*/}
                        {/*tip='上报人名'*/}
                        {/*showArrow={false}*/}
                        {/*tipImage={sources.phone}*/}
                        {/*text={this.state.reportMan}*/}
                        {/*onPress={() => {*/}
                        {/*}}*/}
                    {/*/>*/}
                    {/* <EditinfoView
                        tip='联系电话'
                        showArrow={false}
                        tipImage={sources.tab02_phone}
                        placeholder='未填写'
                        text={this.state.reportUserPhone}
                        onPress={() => {
                            Linking.canOpenURL(`tel:${this.state.reportUserPhone}`)
                                .then(supported => {
                                    if (!supported) {
                                    } else {
                                        return Linking.openURL(`tel:${this.state.reportUserPhone}`);
                                    }
                                })
                                .catch(err => console.error('Error on LineInfoView linking uri ', err));
                        }}
                    /> */}
                    <View style={{height: 30, backgroundColor: gColors.page_gray}}>
                        <Text style={[gStyles.text_small, styles.tipText]}>事件描述</Text>
                    </View>
                    <View style={{backgroundColor: 'white'}}>
                        <Text style={{
                            fontSize: gSizes.text_small,
                            marginHorizontal: gSizes.space_screen,
                            marginVertical: gSizes.space_border
                        }}>
                            {this.state.taskContent}
                        </Text>
                    </View>
                    {this._renderImage()}
                    <View style={{height: 30, backgroundColor: gColors.page_gray}}>
                        <Text style={[gStyles.text_small, styles.tipText]}>事件状态</Text>
                    </View>
                    <EditinfoView
                        tip='当前状态：'
                        showArrow={false}
                        text={this.state.taskState}
                        onPress={() => {
                        }}
                    />
                    {this._renderState()}
                    {/*<LoadingModal modalVisible={this.state.modalVisible}/>*/}
                    {this.state.visible ?
                        <PhotoBrowserModal
                            visible={this.state.visible}
                            dismissView={this.hidePhotoModal.bind(this)}
                            uri={this.state.singleImage}/>
                        : null}
                </ScrollView>
            </Container>
        )
    }

    hidePhotoModal(){
        this.setState({visible: false});
    }

    _renderImage(){
        if (!this.state.images){
            return null
        }
        let images = this.state.images.split('$');
        let pWidth = (gSizes.screen_width - gSizes.space_screen * 2 - gSizes.space_border * 4)/5;
        return (
            <View style={{backgroundColor: gColors.page_normal, flexDirection: 'row'}}>
                {images.map((item,index)=>
                    <TouchableOpacity key={index} onPress={()=> this._pressPicture(item)}>
                    <Image
                        key={index}
                        source={{uri: HOST_UPLOAD + item}}
                        style={{
                            height: pWidth,
                            width: pWidth,
                            marginLeft: gSizes.space_screen,
                            marginVertical: gSizes.space_border
                        }}/>
                </TouchableOpacity>)}
            </View>
        )
    }

    _renderBottomImage(){
        if (!this.state.dealImage){
            return null
        }
        let images = this.state.dealImage.split('$');
        let pWidth = (gSizes.screen_width - gSizes.space_screen * 2 - gSizes.space_border * 4)/5;
        return (
            <View style={{backgroundColor: gColors.page_normal, flexDirection: 'row'}}>
                {images.map((item,index)=>
                    <TouchableOpacity key={index} onPress={()=> this._pressPicture(item)}>
                        <Image
                            key={index}
                            source={{uri: HOST_UPLOAD + item}}
                            style={{
                                height: pWidth,
                                width: pWidth,
                                marginLeft: gSizes.space_screen,
                                marginVertical: gSizes.space_border
                            }}/>
                    </TouchableOpacity>)}
            </View>
        )
    }

    _pressPicture(item){
        this.setState({
            singleImage: HOST_UPLOAD + item,
            visible: true,
        })
    }
    dealTimeCallback = (time) => {
        this.setState({
            dealTime: time,
        })
    }
    markedIsRefresh = ''
    publishCallback = (idx) => {
        this._getTaskInfo(idx)
        this.markedIsRefresh = 'yes';
    }
    componentWillUnmount() {
        // this.props.navigation.state.params.onRefresh();
    }
    _renderState() {
        if (this.state.taskState === '未处理') {
            return (
                <View>
                    {this.state.userIdx_receive.split(',').indexOf(this.state.idx) > -1 ?
                    <View>
                        <EditinfoView
                            tip='处理人：'
                            showArrow={false}
                            text={this.state.name}
                            onPress={() => {
                            }}
                        />
                        <EditinfoView
                            tip='选择预计处理时间'
                            text={this.state.dealTime ? this.state.dealTime : ''}
                            onPress={() => {
                                this.props.navigation.navigate('SelectTime', {dealTime: this.dealTimeCallback})
                            }}
                        />

                        <View style={[styles.loginBtnBg, {backgroundColor: 'red'}]}>
                            <TouchableHighlight style={[styles.loginBtn, {backgroundColor: 'red'}]}
                                                onPress={this._submitforqueren.bind(this)}>
                                <Text style={[gStyles.text_normal, {color: 'white'}]}>确认</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    : null }
                    {
                        this.state.userIdx_send.toString() === this.state.idx ?
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('TaskPublishAgain',
                                        {
                                            publishCallback: this.publishCallback,
                                            userIdx_receive: this.state.userIdx_receive,
                                            taskContent: this.state.taskContent,
                                            images: this.state.images ? this.state.images.split('$') : [],
                                            currentIdx: this.state.currentIdx, 

                                        }
                                    )
                                }}
                                style={{backgroundColor: 'red', borderRadius: 4, justifyContent: 'center',
                                    alignItems: 'center', margin: 15, paddingVertical: 10}}
                            >
                                <Text style={{color: '#fff', fontSize: 16}}>重新派遣任务</Text>
                            </TouchableOpacity>
                            : null 
                    }
                </View>
            )
        } else if (this.state.taskState === '已安排') {
            return (
                <View style={{backgroundColor: 'white',flex:1}}>
                    <EditinfoView
                        tip='处理人员'
                        showArrow={false}
                        text={this.state.HandleName1}
                        onPress={() => {}}
                    />
                    {this.state.userIdx_receive.split(',').indexOf(this.state.idx) > -1 ? <View>
                        <View style={{backgroundColor:'white'}}>
                            <TextInput
                                ref="textInput"
                                placeholder='请输入处理情况'
                                placeholderTextColor={gColors.text_gray6}
                                fontSize={gSizes.text_normal}
                                autoCorrect={false}
                                multiline={true}
                                value={this.state.reportDescribe}
                                editable={!this.props.onPress}
                                onChangeText={(text)=> {
                                    this.state.writetext = text;
                                }}
                                style={{marginHorizontal:gSizes.space_screen,marginVertical:gSizes.space_border,height:150,textAlignVertical: 'top'}}
                                autoCapitalize='none'
                                underlineColorAndroid="transparent"/>
                            <View>
                                <PictureView
                                    ref="pictureView"/>
                            </View>
                        </View>
                        <View style={[styles.loginBtnBg, {backgroundColor: 'red'}]}>
                            <TouchableHighlight style={[styles.loginBtn, {backgroundColor: 'red'}]}
                                                onPress={this._comfirm.bind(this)}>
                                <Text style={[gStyles.text_normal, {color: 'white'}]}>处理完毕</Text>
                            </TouchableHighlight>
                        </View>
                    </View> : null }

                </View>
            )
        } else if (this.state.taskState === '已解决') {
            return (
                <View style={{backgroundColor: 'white'}}>
                    <EditinfoView
                        tip='处理人'
                        showArrow={false}
                        text={this.state.HandleName1}
                        onPress={() => {}}
                    />
                    <View style={{height: 30, backgroundColor: gColors.page_gray}}>
                        <Text style={[gStyles.text_small, styles.tipText]}>处理情况</Text>
                    </View>
                    <Text style={{
                        fontSize: gSizes.text_small,
                        marginHorizontal: gSizes.space_screen,
                        marginVertical: gSizes.space_border
                    }}>
                        {this.state.dealContent}
                    </Text>
                    {this._renderBottomImage()}
                </View>
            )
        }
    }
    _comfirm(){
        // if (!this.state.writetext | this.state.writetext == '') {
        //     AlertUtils.toast('请填写处理情况');
        //     return;
        // }
        if (!this.state.writetext) {
            Toast.show('请输入处理情况')
            return
        }
        this.setState({
            modalVisible: true,
        })
        let date = new Date();
        // Idx,dealRemark,dealDate
        let filePost = {};
        filePost.idx = this.state.currentIdx;
        filePost.dealContent = this.state.writetext
        filePost.handleIdx = this.state.idx;
        let picturesView = this.refs.pictureView;
        let pictures = picturesView._getPictures();
        for (let i = 0; i < pictures.length; i++) {
            let path = pictures[i].path;
            let names = path.split('/');
            let name = names[names.length - 1];

            filePost['file' + i] = {
                uri: path,
                name: name,
                type: 'multipart/form-data',
            }
        }
        TaskListDetailNet.dealTaskInfo(filePost)
            .then(res => {
                this.setState({
                    modalVisible: false,
                }, () => {
                    this.props.navigation.state.params.onRefresh && this.props.navigation.state.params.onRefresh();
                    this.props.navigation.goBack();
                })
            })
            .catch(err => {
                this.setState({
                    modalVisible: false,
                })
                console.log('err', err);
            })
    }

    _submitforqueren() {
        if (!this.state.dealTime) {
            Toast.show('请选择预处理时间')
            return
        }
        TaskListDetailNet.cofirmPreHandle(this.state.currentIdx, this.state.idx, this.state.dealTime)
            .then(res => {
                console.log(this.props.navigation.state.params)
                this.props.navigation.state.params.onRefresh && this.props.navigation.state.params.onRefresh();
                this.props.navigation.goBack();
            })
            .catch(err => {
                console.log('err', err)
            })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: gColors.page_gray,
    },
    tipText: {
        marginVertical: gSizes.space_border,
        marginHorizontal: gSizes.space_screen
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
        alignSelf: 'center',
        marginVertical: gSizes.space_border
    },
});