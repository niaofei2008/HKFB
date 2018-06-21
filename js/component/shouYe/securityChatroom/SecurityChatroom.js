import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    FlatList,
    TouchableOpacity,
    PixelRatio,
    DeviceEventEmitter,
} from 'react-native';
import { Button, Header, Left, Right, Body, Title, Container} from "native-base";
import {gSizes, gColors, gStyles} from '../../../utils/GlobalData';
import sources from '../../../../images/_sources'
import {UltimateListView} from "react-native-ultimate-listview";
import Time from '../../../utils/time'
import RongCloud from 'rongcloud-imlib-react-native'

export default class SecurityChatroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            List: [],
        }
    }
    _getConversationList = () => {
        RongCloud.getConversationList()
            .then(data => {
                console.log('conversation', data);
                this.setState({
                    List: data,
                })
            })
    }
    componentDidMount() {
        
        // RongCloud.getConnectionStatus()
        //     .then(data => {
        //         console.log(data)
        //     })
        this._getConversationList();
        this.listernFromLaunch = DeviceEventEmitter.addListener('newMessage', this._getNewMessage);
    }
    _getNewMessage = (message) => {
        this._getConversationList();
    }
    chatDetailBack = () => {
        this._getConversationList();
    }
    componentWillUnmount() {
        this.listernFromLaunch && this.listernFromLaunch.remove();
    }
    renderRow = (data) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate('ChatroomDetail',
                        {targetId: data.item.targetId, chatDetailBack: this.chatDetailBack});
                }}
                style={{flex: 1, height: 80, flexDirection: 'row', justifyContent: 'space-between',
                            borderBottomWidth: 1/PixelRatio.get(), borderBottomColor: gColors.page_gray_dark,
                            alignItems: 'center', paddingHorizontal: 10, backgroundColor: '#fff', marginBottom: 0.5}}>
                    <Image style={{width: 44, height: 44}} source={sources.discussion} resizeMode='contain' />
                <View style={{flex: 2, paddingLeft: 10}}>
                    <Text style={{color: 'black'}}>{data.item.conversationTitle}</Text>
                    <Text numberOfLines={1} style={{fontSize: 12, marginTop: 5}}>
                        {data.item.unreadMsgCount > 0 ? `[${data.item.unreadMsgCount}条] ${data.item.lastestMessage}` : data.item.lastestMessage}
                    </Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text style={{fontSize: 12, textAlign: 'center'}}>{Time.timeDetail(data.item.lastMessageTime)}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    _keyExtrator = (item, index) => item.lastMessageTime
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
                    <Title>群聊</Title>
                </Body>
                <Right style={{flex: 1}}>
                    <Button
                        transparent
                        onPress={() => {this.props.navigation.navigate('CreateChatroom', {chatDetailBack: this.chatDetailBack})}}>
                        <Image source={sources.add} resizeMode='contain' style={{width: 20, height: 20}}/>
                    </Button>
                </Right>
              </Header>
              <FlatList
                data={this.state.List}
                renderItem = {this.renderRow}
                keyExtractor = {this._keyExtrator}
              />
            </Container>
        )
    }
}