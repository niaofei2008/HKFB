import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    TouchableHighlight,
    ScrollView,
    Alert,
    Platform,
    DeviceEventEmitter,
    PixelRatio,
} from 'react-native';
import {Container, Content, Form, Item, Input, Button,
    Label, Header, Left, Right, Body, Title} from "native-base";
import PropTypes from 'prop-types';
import {gSizes, gColors, gStyles} from '../../utils/GlobalData';
import sources from '../../../images/_sources';
import ShouYeNet from '../../utils/shouYe/ShouYe'
const receiveNotificationEvent = 'receiveNotification'
const openNotificationEvent = 'openNotification'
export default class ShouYe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            middleBanner: '',
            actionvisible: false,
            items:[],
            typeIdx:'',
            value:'选择报警类型',
        }
    }
    line1 = [
        {
            icon: sources.security, text: '通讯录', onPress: () => {
                
                this.props.screenProps.navigation.navigate('AddressBook')
            }
        },
        {
            icon: sources.taskList_icon, text: '任务查看', onPress: () => {
                this.props.screenProps.navigation.navigate('TaskList');
            }
        },
        {
            icon: sources.jingli, text: '警力情况', onPress: () => {
                this.props.screenProps.navigation.navigate('PoliceCondition');
            }
        },
        {
            icon: sources.noticeInformation, text: '帮助', onPress: () => {
                // this.props.screenProps.navigation.navigate('NoticeInfomation');
                this.props.screenProps.navigation.navigate('Help');
            }
        },
    ];
    
    //  line2 = [
    //     {
    //         icon: sources.security, text: '安防群聊', onPress: () => {
    //             this.props.screenProps.navigation.navigate('SecurityChatroom');
    //         }
    //     },];
    componentDidMount() {
        // if (Platform.OS === 'android') {
            this.receiveNotificationListener = DeviceEventEmitter.addListener(receiveNotificationEvent,
            map => {

            })
            this.receiveOpenNotificationListener = DeviceEventEmitter.addListener(openNotificationEvent,
            map => {
                if (Platform.OS === 'android') {
                    console.log('Opening notification!')
                    console.log('map.extra: ' + map.extras)
                    let type = JSON.parse(map.extras);
                    console.log(type);
                    if (type.Type) {
                        switch (type.Type) {
                            case 'Report':
                                return this.props.screenProps.navigation.navigate('TaskListDetail',{idx: type.TypeIdx})
                            case 'MyMessage':
                                return this.props.screenProps.navigation.navigate('NoticeInfomation');
                            
                        }
                    } 
                } else {
                    if (map.Type) {
                        switch (map.Type) {
                            case 'Report':
                                return this.props.screenProps.navigation.navigate('TaskListDetail', {idx: map.TypeIdx})
                            case 'MyMessage':
                                return this.props.screenProps.navigation.navigate('NoticeInfomation');
                        }
                    }
                }
            })
        // }
       storage.load({key: 'userInfoKey'})
            .then(ret => {
                ShouYeNet.signState(ret.idx)
                    .then(res => {
                        if (res.isShangBanOk === 'no') {
                            Alert.alert(
                                '提醒',
                                '当前项目您尚未签到,请到签到页进行签到,谢谢配合',
                                [
                                    // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                    // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                    {text: '确定', onPress: () => {
                                        this.props.screenProps.navigation.navigate('Sign');
                                    }},
                                ],
                                { cancelable: false }
                            )
                        }
                    })
                    .catch(err => {
                        console.log('err', err);
                    })
                ShouYeNet.midBanner()
                .then(res => {
                    if (res.idx.toString() !== ret.currentProjectIdx) {
                        storage.save({
                            key: 'userInfoKey',
                            data: Object.assign(ret, {currentProjectIdx: res.idx.toString()})
                        })
                    } else {
                        // console.log('dddd')
                    }
                    this.setState({
                        middleBanner: res.Img_adCurrent,
                    })
                })
                .catch(err => {
                    console.log('err', err);
                })
                
            })
    }
    onLoad = (dataUri) => {
        if (dataUri) {
            this.setState({
                imageLoaded: true,
            })
        }
    }
    componentWillUnmount() {
        console.log('**************')
        this.receiveNotificationListener && this.receiveNotificationListener.remove();
        this.receiveOpenNotificationListener && this.receiveOpenNotificationListener.remove();
    }
    render() {
        // let middleBanner = this.state.middleBanner ? {uri: this.state.middleBanner} : sources.saishi;

        return (

            <Container style={{flex: 1, backgroundColor: gColors.page_gray}}>
                <Header style={{backgroundColor: 'white'}}>
                    <Left style={{flex: 1}}/>
                    <Body style={{flex: 3, alignItems:'center'}}>
                        <Title style={{color: 'black'}}>虹口足球场智慧安防</Title>
                    </Body>
                    <Right style={{flex: 1}} >
                        <Button transparent onPress={()=>{
                            this.props.screenProps.navigation.navigate('NoticeInfomation')
                        }}>
                            <Image source={sources.home_message} resizeMode='contain' style={{width: 20, height: 20}}/>
                        </Button>
                    </Right>
              </Header>
                <ScrollView style={{flex: 1}}>

                    <TouchableWithoutFeedback onPress={this._pressBannerItem}>
                        <Image
                            source={sources.banner}
                            style={styles.bg}
                        />
                    </TouchableWithoutFeedback>
                    {
                        this.state.middleBanner ? 
                            <Image
                                source={{uri:this.state.middleBanner}}
                                style={styles.middleItem}
                                resizeMode='cover'/>
                            : 
                            <Image
                                source={sources.saishi}
                                style={styles.middleItem}
                                resizeMode='cover' />
                    }

                    <View
                        style={[gStyles.divider_bottom, styles.line, {marginTop: 10}]}>
                        {
                            this.line1.map((item, i) => this._renderItem(item, i))
                        }
                    </View>
                    {/* <View
                        style={styles.line}>
                        {
                            this.line2.map((item, i) => this._renderItem(item, i + 4))
                        }
                    </View> */}
                </ScrollView>

            </Container>
        );
    }
    _renderItem(item, i) {
        // console.log(i)
        return (
            <View key={i} style={{flex: 1, flexDirection: 'row'}}>
            <View
                style={[styles.item, gStyles.divider_left]}
                >
                <TouchableWithoutFeedback
                    onPress={item.onPress ? item.onPress : null}
                >
                    <View
                        style={{justifyContent: 'center', alignItems: 'center', 
                        paddingVertical: gSizes.space_screen}}
                        >
                        <Image
                            style={styles.itemIcon}
                            resizeMode="contain"
                            source={item.icon}/>
                        <Text
                            style={styles.itemText}>
                            {item.text}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                { 
                    item.text === '通告资讯' ?
                        <Image source={sources.homeXin} style={{position: 'absolute', right: 0, width: 30, height: 30, top: 0}} />
                        : null
                }
                {
                    item.text === '安防群聊' ?
                        <Image source={sources.homeNew} style={{position: 'absolute', right: 0, width: 30, height: 30, top: 0}} />
                        :null
                }
            </View>
            {
                i === 4 ? <View style={{flex: 3}} /> : null
            }
            </View>
        )
    }

    _pressBannerItem = () => {
        this.props.screenProps.navigation.navigate('Sign');
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: gColors.page_gray,
    },
    bg: {
        width: gSizes.screen_width,
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerItem: {
        width: gSizes.width_line_info_tip,
        height: gSizes.width_line_info_tip,
    },
    middleItem: {
        width: gSizes.screen_width,
        height: 120,
        marginTop: 10,
    },
    line: {
        flexDirection: 'row',
    },

    item: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: gColors.page_normal,
    },

    itemIcon: {
        width: 30,
        height: 30,
    },

    itemText: {
        color: gColors.text_normal,
        fontSize: gSizes.text_small,
        marginTop: gSizes.space_border,
    },
});