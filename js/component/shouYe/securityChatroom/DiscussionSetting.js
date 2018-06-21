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
    Dimensions,
    TextInput,
    Alert,
} from 'react-native';
import { Button, Header, Left, Right, Body, Title, Container,Content} from "native-base";
import {gSizes, gColors, gStyles} from '../../../utils/GlobalData';
import sources from '../../../../images/_sources'
import dismissKeyboard from "dismissKeyboard";
import RongCloud from 'rongcloud-imlib-react-native'
import TaskPublishNet from '../../../utils/taskPublish/TaskPublish'
import _ from 'lodash'
const avatarMarginRight = Math.floor((Dimensions.get('window').width - 10 * 2 - 4 * 60) / 3);
export default class DiscussionSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targetId: this.props.navigation.state.params.targetId,
            memberList: this.props.navigation.state.params.memberList,
            discussionName: this.props.navigation.state.params.discussionName,
            List: [],
        }
    }
    isQuit = false
    _selfIdx = () => {
        storage.load({key: 'userInfoKey'})
            .then(ret => {
                this.setState({
                    uIdx: ret.idx,
                })
            })
    }
    _getUserList = () => {
        TaskPublishNet.taskUserList()
            .then(res => {
                let tmp = _.cloneDeep(res);
                for (let i = 0; i < tmp.length; i++) {
                    for (let j = 0; j < tmp[i].content.length; j++) {
                        if (this.state.memberList.indexOf(tmp[i].content[j].idx) > -1) {
                            tmp[i].content[j].isChecked = true;
                        }
                    }
                }
                this.setState({
                    List: tmp,
                })
            })
            .catch(err => {
                console.log('err', err);
            })
    }
    componentDidMount() {
        this._selfIdx();
        this._getUserList();
    }
    callback = (data) => {
        
        this.setState({
            List: data,
        }, () => {
            let idArr = [];
            let tmp = this.state.List.map(item => item.content).reduce((a, b) => a.concat(b), []).filter(value => value.isChecked)
            tmp.forEach(data => {
                idArr.push(data.idx);
            })
            // console.log(idArr)
            // 只负责加不同的id 没有不同的id将抛出错误
            RongCloud.addMemberToDiscussion(this.state.targetId, idArr)
                .then(res => {
                    console.log('res', res)
                    
                })
                .catch(err => {
                    console.log('err', err)
                })
        })
    }
    componentWillUnmount() {
        this.props.navigation.state.params.discussionChange && this.props.navigation.state.params.discussionChange(this.isQuit)
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
                    <Title>群聊设置</Title>
                </Body>
                <Right style={{flex: 1}}>
                    <Button
                        transparent
                        onPress={() => {
                            RongCloud.setDiscussionName(this.state.targetId, this.state.discussionName)
                                .then(res => {
                                    console.log('name', res);
                                    
                                })
                                .catch(err => {
                                    console.log('err', err);
                                })
                            
                        }}>
                        <Text style={{color: '#fff'}}>保存</Text>
                    </Button>
                </Right>
              </Header>
              <Content>
                <View style={{padding: 10, flexDirection: 'row',backgroundColor: '#fff',
                                flexWrap: 'wrap', alignItems: 'center'}}>
                    {
                        this.state.List.map((item, index) => item.content).reduce((a, b) => a.concat(b), []).filter(value => value.isChecked).map((selectItem, index) => {
                        
                            return (
                                <View key={selectItem.idx} style={{marginTop: 10, width: 60, justifyContent: 'center',alignItems: 'center', marginRight: (index + 1) % 4 ? avatarMarginRight : 0}}>
                                    <Image style={{width: 44, height: 44, borderRadius: 22}} source={selectItem.imgHeader ? {uri:HOST_UPLOAD + selectItem.imgHeader} : sources.defaultAvatar} />
                                    <Text style={{marginTop: 10}}>{selectItem.trueName}</Text>
                                    {
                                        selectItem.idx !== this.state.uIdx ?
                                    
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
                                            RongCloud.removeMemberFromDiscussion(this.state.targetId, selectItem.idx)
                                                .then(res => {
                                                    console.log('remove', res);

                                                })
                                                .catch(err => {
                                                    console.log('err', err);
                                                })
                                        }}
                                        style={{position: 'absolute', right: 0, top: 0, }}
                                    >
                                        <Image style={{width: 15, height: 15}} resizeMode='contain' source={sources.cancel} />
                                    </TouchableOpacity>
                                    : null}
                                </View>
                            )
                        }).concat(
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('CreateChatroom',
                                        {
                                            List: this.state.List,
                                            callback: this.callback,
                                            isDiscussionSetting: 'yes',
                                            memberList: this.state.memberList,
                                        }
                                    );
                                }}
                                key={'0000'}
                                style={{marginTop: 12}}>
                                <Image  source={sources.add_circle}  />
                            </TouchableOpacity>)
                    }
                </View>
                <View style={{backgroundColor: '#fff', marginTop: 10, flexDirection: 'row',
                        justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
                    <Text style={{fontSize: 16}}>群聊名称</Text>
                    <View style={{flexDirection: 'row',}}>
                        <TextInput
                            underlineColorAndroid='transparent'
                            // keyboardType='email-address'
                            onChangeText={(text) => {this.setState({discussionName: text})}}
                            maxLength={16}
                            placeholderTextColor={sources.page_gray}
                            placeholder={this.state.discussionName}
                            style={{fontSize: 14, width: 100}}
                        />
                        <Image style={{width: 20, height: 20}} resizeMode='contain' source={sources.arrow_right} />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            '提醒',
                            '删除后,群聊记录不会保存',
                            [
                                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                {text: '取消', onPress: () => console.log('Cancel Pressed')},
                                {text: '确定', onPress: () => {
                                    RongCloud.quitDiscussion(this.state.targetId)
                                        .then(res => {
                                            console.log('quit', res)
                                            this.isQuit = true;
                                            this.props.navigation.pop(2);
                                        })
                                        .catch(err => {
                                            console.log('err', err)
                                        })
                                }},
                            ],
                            { cancelable: false }
                        )
                    }}
                    style={{height: 60, justifyContent: 'center', alignItems: 'center',
                        backgroundColor: '#fff', marginTop: 10}}
                >
                    <Text style={{fontSize: 16, color: gColors.primaryNavi}}>删除并退出</Text>
                </TouchableOpacity>
                </Content>
            </Container>
        )
    }
}