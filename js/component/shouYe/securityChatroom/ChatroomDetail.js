import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    FlatList,
    TouchableOpacity,
    Platform,
    DeviceEventEmitter,
    PixelRatio,
    Modal,
    Linking,
} from 'react-native';
import { Button, Header, Left, Right, Body, Title, Container} from "native-base";
import {gSizes, gColors, gStyles} from '../../../utils/GlobalData';
import sources from '../../../../images/_sources'
import { GiftedChat, Actions, InputToolbar, LoadEarlier } from 'react-native-gifted-chat'
import dismissKeyboard from "dismissKeyboard";
import RongCloud from 'rongcloud-imlib-react-native'
import ImagePicker from 'react-native-image-crop-picker'
import GetSetStorage from '../../../asyncStorage/GetSetStorage'

export default class ChatroomDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadEarlier: true,
            isLoadingEarlier: false,
            messages: [],
            messageId: '',
            targetId: this.props.navigation.state.params.targetId,
            avatar: '',
            name: '',
            _id: '',
            memberNumber: '',
            memberList: [],
            chatDetailBack: this.props.navigation.state.params.chatDetailBack,
            conversationTitle: '',
            modalVisible: false,
            showImageUrl: '',
            showPhone: '',
            showName: '',
            showUnitName: '',
        }
    }
    componentWillUnmount() {
        this.listernFromLaunch && this.listernFromLaunch.remove()
        RongCloud.clearMessagesUnreadStatus('DISCUSSION', this.state.targetId)
            .then(data => {
                console.log('清除消息')
                this.state.chatDetailBack && this.state.chatDetailBack()
            })
            .catch(err => {
                console.log('err', err)
            })
    }
    _getLatesMessages = () => {
        RongCloud.getLatestMessages(
            Platform.select({
                ios: 2,
                android: 'DISCUSSION'
            }),
            this.state.targetId,
            8
        )
        .then(data => {
            console.log('data', data);
            this.showMessages(data);
        })
        .catch(err => {
            console.log('chatroomDetail', err);
        })
    }
    
    componentDidMount() {
        storage.load({key: 'userInfoKey'})
            .then(ret => {
                this.setState({
                    _id: ret.idx,
                    name: ret.name,
                    avatar: HOST_UPLOAD + ret.imgHeader,
                    unitName: ret.unitName,
                    uMobile: ret.uMobile,
                })
            })
        this._getLatesMessages();
        this._getDiscussion();
        this.listernFromLaunch = DeviceEventEmitter.addListener('newMessage', this.receiveNewMessage)
    }
    receiveNewMessage = (message) => {
        let messages = [];
        let newDate = new Date();
        newDate.setTime(message.sentTime)
        GetSetStorage.getUserbyid(message.senderUserId, (res) => {
            // console.log('res', res)
            if (message.content || message.imageUrl) {
                let newMessage = {
                    _id: Math.round(Math.random() * 1000000),
                    text: message.content,
                    createdAt: newDate.toISOString(),
                    user: {
                        _id: message.senderUserId,
                        avatar: HOST_UPLOAD + res.imgHeader,
                        name: res.trueName,
                        unitName: res.unitName,
                        uMobile: res.uMobile,
                    },
                    image: message.imageUrl,
                    thumb: message.thumbnail,
                }
                messages.push(newMessage);
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.append(previousState.messages, messages),
                    };
                });
            }
        })
        
    }
    _getDiscussion = (isQuit = false) => {
        if (!isQuit) {
            RongCloud.getDiscussion(this.state.targetId)
                .then(data => {
                    console.log('discussion', data)
                    let tmp = JSON.parse(data);
                    let memberList = JSON.parse(tmp.memberIdList);
                    console.log('memberList',  memberList);
                    this.setState({
                        memberNumber: memberList.length,
                        memberList: memberList,
                        discussionName: tmp.discussionName,
                    })

                })
        }
    }
    handleMessageFnc(item, messages) {
        return new Promise((resolve, reject) => {
                let newDate = new Date();
                newDate.setTime(item.sentTime);
                let message = {};
                GetSetStorage.getUserbyid(item.senderUserId, res => {
                    if (Platform.OS == 'ios') {
                        if (item.content) {
                            message = {
                                _id: Math.round(Math.random() * 1000000),
                                text: item.content,
                                createdAt: newDate.toISOString(),
                                user: {
                                    _id: item.senderUserId,
                                    avatar: HOST_UPLOAD + res.imgHeader,
                                    name: res.trueName,
                                    unitName: res.unitName,
                                    uMobile: res.uMobile,
                                    sendsuccess: item.sentstatus
                                },
                            }
                            messages.push(message)
                            resolve(messages)
                        } else if (item.imageUrl) {
                            message = {
                                _id: Math.round(Math.random() * 1000000),
                                createdAt: newDate.toISOString(),
                                user: {
                                    _id: item.senderUserId,
                                    avatar: HOST_UPLOAD + res.imgHeader,
                                    name: res.trueName,
                                    unitName: res.unitName,
                                    uMobile: res.uMobile,
                                    sendsuccess: item.sentstatus,
                                },
                                image: item.imageUrl,
                            }
                            messages.push(message)
                            resolve(messages)
                        } else {
                            resolve(messages)
                        }

                    } else {
                        if (item.content.type === 'text' && item.content.content) {
                            message = {
                                _id: Math.round(Math.random() * 1000000),
                                text: item.content.content,
                                createdAt: newDate.toISOString(),
                                user: {
                                    _id: item.senderUserId,
                                    avatar: HOST_UPLOAD + res.imgHeader,
                                    name: res.trueName,
                                    unitName: res.unitName,
                                    uMobile: res.uMobile,
                                    sendsuccess: item.sentstatus
                                },
                            }
                            messages.push(message)
                            resolve(messages)
                        } else if (item.content.type === 'image' && item.content.remoteUri) {
                            message = {
                                _id: Math.round(Math.random() * 1000000),
                                createdAt: newDate.toISOString(),
                                user: {
                                    _id: item.senderUserId,
                                    avatar: HOST_UPLOAD + res.imgHeader,
                                    name: res.trueName,
                                    unitName: res.unitName,
                                    uMobile: res.uMobile,
                                    sendsuccess: item.sentstatus,
                                },
                                image: item.content.remoteUri,
                                thumb: item.content.thumb,
                            }
                            messages.push(message)
                            resolve(messages)
                        } else {
                            resolve(messages)
                        }
                    }
                })
            }
        )
    }
    showMessages = (data) => {
        if (data.length === 0) {
            return
        }
        let messages = [];
        (async () => {
            for (let i = 0; i < data.length; i++) {
                messages = await this.handleMessageFnc(data[i], messages);
            }
            this.setState((previousState) => {
                return {
                    messages: GiftedChat.append(previousState.messages, messages),
                    messageId: data[data.length - 1].messageId,
                };
            });
        })()
    }
    _getOldMessage = (data) => {
        this.setState({
            isLoadingEarlier: false,
        })
        if (data.length === 0) {
            return
        }
        let messages = [];
        (async () => {
            for (let i = 0; i < data.length; i++) {
                messages = await this.handleMessageFnc(data[i], messages);
            }
            this.setState((previousState)=> {
                return {
                    messages: GiftedChat.prepend(previousState.messages, messages),
                    messageId: data[data.length - 1].messageId,
                };
            });
        })()
            
    }
    onLoadEarlier = () => {
        this.setState({
            isLoadingEarlier: true,
        })
        let messageId = parseInt(this.state.messageId);
        RongCloud.getHistoryMessages(
            Platform.select({
                ios: 2,
                android: 'DISCUSSION'
            }),
            this.state.targetId,
            messageId,
            20
        )
        .then(data => {
            console.log('获取旧数据', data)
            this._getOldMessage(data);
        })
        .catch(err => {
            console.log('err', err);
        })
    }
    rongyunsendImage(imageMessage, path) {
        if (Platform.OS === 'ios') {
            RongCloud.sendImageMessage('DISCUSSION', this.state.targetId, path)
                .then((data)=> {
                    console.log('-----sendImage success: ', data);
                    // imageMessage[0].user.sendsuccess = "SENT";
                    this.setState((previousState) => {
                        return {
                            messages: GiftedChat.append(previousState.messages, imageMessage),
                        };
                    });
                })
                .catch((e)=> {
                    console.log('-----sendImage fail: ', e);
                    console.log(e);
                })
        } else {
            console.log("imageMessage", imageMessage, path);
            RongCloud.sendImageMessageandroid('DISCUSSION', this.state.targetId, path)
                .then((data)=> {
                    // ImageMessage[0].user.sendsuccess = "SENT";
                    this.setState((previousState) => {
                        return {
                            messages: GiftedChat.append(previousState.messages, imageMessage),
                        };
                    });
                })
                .catch((e)=> {
                    console.log("imageMessage", e);
                });
        }
    }
    _sendImageMessage = (imageUrl) => {
        let imageMessage = [
            {
                _id: Math.round(Math.random() * 1000000),
                createdAt: new Date(),
                user: {
                    _id: this.state._id,
                    avatar: this.state.avatar,
                    name: this.state.name,
                    unitName: this.state.unitName,
                    uMobile: this.state.uMobile,
                    sendsuccess: false
                },
                image: imageUrl,
                thumb: imageUrl,
            }
        ];
        this.rongyunsendImage(imageMessage, imageUrl)
    }
    renderCustomActions = (props) => {
        const options = {
            
            '照相机': (props) => {
                ImagePicker.openCamera({width: 300, height: 400, cropping: true, includeBase64: true,})
                    .then(image => {
                        this._sendImageMessage(image.path)
                    })
            },
            '相册': (props) => {
                ImagePicker.openPicker({width: 300, height: 400, maxFiles: 1, cropping: true, includeBase64: true})
                    .then(image => {
                        this._sendImageMessage(image.path);
                    })
            },
            '取消': () => {

            },
          };
        return (
            <Actions
                {...props}
                options={options}
            />
        )
    }
    onSend(messages) {
        console.log(messages)
        RongCloud.sendTextMessage('DISCUSSION', this.state.targetId, messages[0].text)
            .then(data => {
                console.log("-----sendText success", data);
                this.setState((previousState) => {
                    // messages[0].user.sendsuccess = "SENT";
                    return {
                        messages: GiftedChat.append(previousState.messages, messages),
                    };
                });
            })
    }
    renderInputToolbar = (props) => {
        return (
            <InputToolbar {...props} label="发送" />
        )
    }
    renderLoadEarlier = (props) => {
        return (
            <LoadEarlier {...props} label="加载历史数据" />
        )
    }
    onPressAvatar = (data) => {
        console.log('data', data)
        if (data._id !== this.state._id) {
            this.setState({
                modalVisible: true,
                showImageUrl: data.avatar,
                showName: data.name,
                showPhone: data.uMobile,
                showUnitName: data.unitName,
            })
        }
    }
    _call = (phoneNumber) => {
        Linking.canOpenURL(`tel:${phoneNumber}`)
            .then(supported => {
                if (!supported) {
                    console.log('%%%%%')
                } else {
                    return Linking.openURL(`tel:${phoneNumber}`);
                }
            })
            .catch(err => console.error('Error on LineInfoView linking uri ', err));
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
                <Body style={{flex: 1, alignItems:'center'}}>
                    <Title>群聊({this.state.memberNumber}人)</Title>
                </Body>
                <Right style={{flex: 1}}>
                    <Button
                        transparent
                        onPress={() => {
                            this.props.navigation.navigate('DiscussionSetting',
                                {
                                    targetId:this.state.targetId,
                                    memberList: this.state.memberList,
                                    discussionName: this.state.discussionName,
                                    discussionChange: this._getDiscussion, 
                                })
                        }}>
                        <Image source={sources.chatroomRightBtn} resizeMode='contain' style={{width: 20, height: 20}}/>
                    </Button>
                </Right>
              </Header>
              <View style={{flex:1}}>
                    <GiftedChat
                        // onPressAvatar={()=>this.props.navigation.navigate("Chat")}s
                        //点击大范围，隐藏
                        showAvatarForEveryMessage={true}
                        renderAvatarOnTop={true}
                        showUserAvatar={true}
                        keyboardShouldPersistTaps={'handled'}
                        placeholder={"请输入..."}
                        text={this.state.customText}
                        // onInputTextChanged={this.doInputText.bind(this)}
                        messages={this.state.messages}
                        onSend={(messages) => this.onSend(messages)}
                        user={{
                            // _id: this.state.rcId,
                            // avatar:this.state.avatar,
                            // name:this.state.nickName,
                            // sendsuccess:true,
                            _id: this.state._id,
                            avatar:this.state.avatar,
                            name:this.state.name,
                            unitName: this.state.unitName,
                            uMobile: this.state.uMobile,
                            sendsuccess:true,
                        }}
                        // label='加载历史数据'
                        loadEarlier={this.state.loadEarlier}
                        onLoadEarlier={this.onLoadEarlier}
                        isLoadingEarlier={this.state.isLoadingEarlier}
                        renderFooter={this.renderFooter}
                        renderActions={this.renderCustomActions}
                        renderInputToolbar={this.renderInputToolbar}
                        renderLoadEarlier={this.renderLoadEarlier}
                        onPressAvatar={this.onPressAvatar}
                        // parsePatterns={(linkStyle) =>[
                        //     { pattern: this.parsePatternsFnc(), style: {...linkStyle, color:'blue'}, onPress: this.onPressLink},
                        // ]}
                    />
                </View>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    onRequestClose={() => {}}
                    visible={this.state.modalVisible}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.setState({
                                modalVisible: false,
                            })
                        }}
                        >
                            <View
                                style={{width: gSizes.screen_width, height: gSizes.screen_height, opacity: 0.7,
                                    backgroundColor: 'black', position: 'absolute', justifyContent: 'center', alignItems: 'center'}}/>
                    </TouchableWithoutFeedback>
                        <View
                            style={{width: gSizes.screen_width, position: 'absolute', backgroundColor: '#fff', marginTop: gSizes.screen_width/3,
                                    justifyContent: 'space-between', alignItems: 'center', padding: 10, flexDirection: 'row',
                                }}
                        >
                            <View style={{flexDirection: 'row', alignItems: 'center', borderRightWidth: 1,
                                        borderRightColor: gColors.page_gray_dark, flex: 1}}>
                                <Image style={{width: 44, height: 44, borderRadius: 22}} resizeMode='cover' source={{uri:this.state.showImageUrl}} />
                                <View style={{marginLeft: 20}}>
                                    <Text>{this.state.showName}-{this.state.unitName}</Text>
                                    <Text>{this.state.showPhone}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    this._call(this.state.showPhone)
                                }}
                                style={{paddingLeft: 20}}
                                >
                                <Image style={{width: 28, height: 28}} resizeMode='contain' source={sources.discussionCall} />
                            </TouchableOpacity>
                        </View>
                        
                </Modal>
            </Container>
        )
    }
}