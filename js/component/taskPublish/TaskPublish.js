import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    WebView,
    Image,
    TouchableWithoutFeedback,
    TouchableHighlight,
    ScrollView,
    Alert,
    TextInput,
    Dimensions,
    TouchableOpacity,
    DeviceEventEmitter,
    Modal,
    ActivityIndicator,
} from 'react-native';
import {Container, Button,
    Header, Left, Right, Body, Title} from "native-base";
import PropTypes from 'prop-types';
import {gSizes, gColors, gStyles} from '../../utils/GlobalData';
import sources from '../../../images/_sources';
import PictureView from '../../widgets/PictureView'
import TaskPublishNet from '../../utils/taskPublish/TaskPublish'
import Toast from 'react-native-simple-toast'
export default class TaskPublish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            List: [],
            reportDescribe: '',
            projectIdx_Fx: '',
            userIdx_send: '',
            isModal: false,
            isLoading: false,
            receiveTip: '',
        }
    }
    
    componentDidMount() {
       storage.load({key: 'userInfoKey'})
        .then(ret => {
            this.setState({
                projectIdx_Fx: ret.currentProjectIdx,
                userIdx_send: ret.idx,
            })
        })
        .catch(err => {
            console.log('err', err)
        })
        TaskPublishNet.taskUserList()
            .then(res => {
                this.setState({
                    List: res,
                })
            })
            .catch(err => {
                console.log('err', err);
            })
    }
    callback = (data) => {
        this.setState({
            List: data,
        })
    }
    render() {
        return (
            <Container style={{flex: 1, backgroundColor: 'white'}}>
                <Header style={{backgroundColor: gColors.primaryNavi}}>
                    <Left style={{flex: 1}} />
                    <Body style={{flex: 1, alignItems:'center'}}>
                        <Title>任务派遣</Title>
                    </Body>
                    <Right style={{flex: 1}}/>
                </Header>
                <ScrollView style={{flex: 1, backgroundColor:gColors.page_gray}}>
                    <View style={{height:30,backgroundColor:gColors.page_gray}}>
                        <Text style={[gStyles.text_small,styles.tipText]}>任务描述</Text>
                    </View>
                    <TextInput
                        ref="textInput"
                        placeholder='请描述情况（限500字）'
                        placeholderTextColor={gColors.text_gray6}
                        fontSize={gSizes.text_normal}
                        autoCorrect={false}
                        multiline={true}
                        value={this.state.reportDescribe}
                        editable={!this.props.onPress}
                        onChangeText={(text)=> this.setState({reportDescribe: text})}
                        style={{paddingHorizontal:gSizes.space_screen,
                            height:100,textAlignVertical: 'top', backgroundColor: '#fff'}}
                        autoCapitalize='none'
                        underlineColorAndroid="transparent"
                    />
                    <PictureView ref = 'pictureView'/>
                    <View style={{ backgroundColor: '#fff', flex: 1}}>
                        <View style={{height:30,backgroundColor:gColors.page_gray}}>
                            <Text style={[gStyles.text_small,styles.tipText]}>接收人</Text>
                        </View>
                        <View style={{padding: 10, flex: 1, flexDirection: 'row',
                                        flexWrap: 'wrap'}}>
                            {
                                this.state.List.map((item, index) => item.content).reduce((a, b) => a.concat(b), []).filter(value => value.isChecked).map((selectItem, index) => {
                                
                                    return (
                                        <View key={selectItem.idx} style={{width: 60, justifyContent: 'center',alignItems: 'center', marginRight: (index + 1) % 4 ? avatarMarginRight : 0, marginTop: 10}}>
                                            <Image style={{width: 44, height: 44, borderRadius: 22}} source={selectItem.imgHeader ? {uri:HOST_UPLOAD + selectItem.imgHeader} : sources.defaultAvatar} />
                                            <Text style={{marginTop: 10}}>{selectItem.trueName}</Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    let tmp = _.cloneDeep(this.state.List)
                                                    for (let i = 0; i < tmp.length; i++) {
                                                        tmp[i].isChecked = false;
                                                        for (let j = 0; j < tmp[i].content.length; j++) {
                                                            if (tmp[i].content[j].idx === selectItem.idx) {
                                                                tmp[i].content[j].isChecked = false;
                                                                this.setState({
                                                                    List: tmp,
                                                                })
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }}
                                                style={{position: 'absolute', right: 0, top: 0, }}
                                            >
                                                <Image style={{width: 15, height: 15}} resizeMode='contain' source={sources.cancel} />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }).concat(
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.screenProps.navigation.navigate('CreateChatroom', {List: this.state.List, callback: this.callback});
                                        }}
                                        key={'0000'}
                                        style={{marginTop: 12}}>
                                        <Image  source={sources.add_circle}  />
                                    </TouchableOpacity>)
                            }
                        </View>
                    </View>
                    
                </ScrollView>
                <View style={{bottom: 10, backgroundColor: '#fff'}}>
                    <TouchableOpacity
                        onPress={() => {
                            let obj = {};
                            obj.projectIdx_Fx = this.state.projectIdx_Fx;
                            obj.userIdx_send = this.state.userIdx_send;
                            obj.taskContent = this.state.reportDescribe;
                            let tmpArr = [];
                            for (let i = 0; i < this.state.List.length; i++) {
                                for (let j = 0; j < this.state.List[i].content.length; j++) {
                                    if (this.state.List[i].content[j].isChecked) {
                                        tmpArr.push(this.state.List[i].content[j].idx);
                                    }
                                }
                            }
                            obj.userIdx_receive = tmpArr.join(',');
                            this.setState({
                                receiveTip: obj.userIdx_receive,
                            })
                            let pictures = this.refs.pictureView._getPictures();
                            for (let i = 0; i < pictures.length; i++) {
                                let path = pictures[i].path;
                                let names = path.split('/');
                                let name = names[names.length - 1];

                                obj['file' + i] = {
                                    uri: path,
                                    name: name,
                                    type: 'multipart/form-data',
                                }
                            }
                            if (!obj.taskContent) {
                                Toast.show('请输入任务内容')
                                return
                            }
                            if (!obj.userIdx_receive) {
                                Toast.show('请选择接收人')
                                return
                            }
                            this.setState({
                                isModal: true,
                                isLoading: true,
                            })
                            TaskPublishNet.submit(obj)
                                .then(res => {
                                    // console.log('res')
                                    this.refs.pictureView._clearPictures();
                                    Toast.show('任务派遣成功')
                                    let tmp = _.cloneDeep(this.state.List)
                                    for (let i = 0; i < tmp.length; i++) {
                                        tmp[i].isChecked = false;
                                        for (let j = 0; j < tmp[i].content.length; j++) {
                                            tmp[i].content[j].isChecked = false;
                                        }
                                    }
                                    this.setState({
                                        reportDescribe: '',
                                        List: tmp,
                                        isModal: false,
                                        isLoading: false,
                                        receiveTip: '',
                                    })
                                })
                                .catch(err => {
                                    console.log('err', err);
                                })

                            
                        }}
                            style={{margin: 10, borderRadius: 2, backgroundColor: this.state.reportDescribe && this.state.receiveTip ? gColors.primary : gColors.page_gray_dark,
                                justifyContent: 'center', alignItems: 'center', height: 40}}
                        >
                            <Text>提交</Text>
                    </TouchableOpacity>    
                </View>
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
}
const avatarMarginRight = Math.floor((Dimensions.get('window').width - 10 * 2 - 4 * 60) / 3);
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: gColors.page_gray,
    },
    tipText: {
        marginVertical:gSizes.space_border,
        marginHorizontal:gSizes.space_screen
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