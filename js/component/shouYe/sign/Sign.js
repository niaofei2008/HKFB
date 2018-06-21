import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
    TouchableOpacity,
    FlatList,
    Linking,
    Modal,
    Alert,
} from 'react-native';
import { Button, Header, Left, Right, Body, Title, Container} from "native-base";
import {gSizes, gColors, gStyles} from '../../../utils/GlobalData';
import sources from '../../../../images/_sources'
import Toast from 'react-native-simple-toast';
import JudgeUtils from '../../../utils/JudageUtils'
import Geolocation from 'Geolocation';
import Coordtransform from 'coordtransform'
import ShouYeNet from '../../../utils/shouYe/ShouYe'
export default class Sign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: '',
            name: '',
            unitName: '',
            startWorkTime: '',
            modalVisible: false,
            isShangBanOk: 'no',
            isXiaBanOk: 'no',
            time_shangBan: '',
            time_xiaBan: '',
        }
    }
    componentDidMount() {
        storage.load({key: 'userInfoKey'})
            .then(ret => {
                ShouYeNet.signState(ret.idx)
                    .then(res => {
                        console.log(res);
                        this.setState({
                            isShangBanOk: res.isShangBanOk,
                            isXiaBanOk: res.isXiaBanOk,
                            time_shangBan: res.time_shangBan,
                            time_xiaBan: res.time_xiaBan,
                        })
                    })
                    .catch(err => {
                        console.log('err', err);
                    })
                this.setState({
                    idx: ret.idx,
                    name: ret.name,
                    unitName: ret.unitName,
                    imgHeader: ret.imgHeader,
                })
            })
        // this.startWorkTimeTimer = setInterval(() =>{
        //     this.setState({
        //         startWorkTime: new Date().toLocaleTimeString(),
        //     })
        // }, 1000)
    }
    componentWillUnmount() {
        // this.startWorkTimeTimer && clearInterval(this.startWorkTimeTimer);
    }
    locationSuccessStart = (data) => {
        console.log('data', data);
        let wgs84togcj02 = Coordtransform.wgs84togcj02(data.coords.longitude, data.coords.latitude);

        let wgs84tobd09 = Coordtransform.gcj02tobd09(wgs84togcj02[0], wgs84togcj02[1]);
        console.log(wgs84tobd09)
        ShouYeNet.sign(this.state.idx, wgs84tobd09[0], wgs84tobd09[1])
            .then(res => {
                this.setState({
                    isShangBanOk: res.isShangBanOk,
                    time_shangBan: res.time_shangBan,
                    modalVisible: true,
                })
            })
            .catch(err => {
                Toast.show('不在签到范围内')
                console.log('err', err);
            })
    }
    locationErrorStart = (error) => {
        console.log('error', error)
        if (error.PERMISSION_DENIED === 1) {
            Toast.show('您的手机未允许访问当前位置')
        }
    }
    locationSuccessEnd = (data) => {
        console.log('data', data);
        let wgs84togcj02 = Coordtransform.wgs84togcj02(data.coords.longitude, data.coords.latitude);

        let wgs84tobd09 = Coordtransform.gcj02tobd09(wgs84togcj02[0], wgs84togcj02[1]);
        console.log(wgs84tobd09)
        ShouYeNet.signEndWork(this.state.idx, wgs84tobd09[0], wgs84tobd09[1])
            .then(res => {
                this.setState({
                    isXiaBanOk: res.isXiaBanOk,
                    time_xiaBan: res.time_xiaBan,
                    modalVisible: true,
                })
            })
            .catch(err => {
                Toast.show('不在签到范围内')
                console.log('err', err);
            })
    }
    locationErrorEnd = (error) => {
        console.log('error', error)
        if (error.PERMISSION_DENIED === 1) {
            Toast.show('您的手机未允许访问当前位置')
        }
    }
    renderSignStart = () => {
        return (
            <View style={{marginLeft: 60, marginTop: 20, height: 150}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: '#e69138'}} />
                    <Text style={{marginLeft: 10, fontSize: 16}}>
                        {`上班签到:   ${this.state.isShangBanOk === 'yes' ? this.state.time_shangBan : '未签到'}`}
                    </Text>
                </View>
                <View style={{flex: 1, marginLeft: 4, borderLeftWidth: 0.5, borderLeftColor: gColors.page_gray_dark}}>
                    <TouchableOpacity
                        // disabled={this.state.isShangBanOk === 'yes' ? true : false}
                        onPress={() => {
                            Alert.alert(
                                '提醒',
                                '您确认上班签到吗？',
                                [
                                    // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                    {text: '取消', onPress: () => console.log('Cancel Pressed')},
                                    {text: '确定', onPress: () => {
                                        Geolocation.getCurrentPosition(this.locationSuccessStart, this.locationErrorStart);
                                    }},
                                ],
                                { cancelable: false }
                            )
                        }}
                        style={{borderRadius: 4, backgroundColor: this.state.isShangBanOk === 'yes'? gColors.page_gray_dark : gColors.primaryNavi, height: 50, width: 200,
                                justifyContent: 'center', alignItems: 'center', marginLeft: 20, marginTop: 30}}
                    >
                        <Text style={{fontSize: 18, color: '#fff'}}>{this.state.isShangBanOk === 'yes' ? '已签到' : '点击签到'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    renderSignEnd = () => {
        return (
            <View style={{marginLeft: 60, height: 150}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: '#e69138'}} />
                    <Text style={{marginLeft: 10, fontSize: 16}}>
                        {`下班签到:   ${this.state.isXiaBanOk === 'yes' ? this.state.time_xiaBan : '未签到'}`}
                    </Text>
                </View>
                <View style={{flex: 1, marginLeft: 4}}>
                    <TouchableOpacity
                        disabled={this.state.isXiaBanOk === 'yes' || this.state.isShangBanOk === 'no' ?  true : false}
                        onPress={() => {
                            Alert.alert(
                                '提醒',
                                '您确认下班签到吗？',
                                [
                                    // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                    {text: '取消', onPress: () => console.log('Cancel Pressed')},
                                    {text: '确定', onPress: () => {
                                        Geolocation.getCurrentPosition(this.locationSuccessEnd, this.locationErrorEnd);
                                    }},
                                ],
                                { cancelable: false }
                            )
                        }}
                        style={{borderRadius: 4, backgroundColor: this.state.isXiaBanOk === 'yes' || this.state.isShangBanOk === 'no' ? gColors.page_gray_dark : gColors.primaryNavi, height: 50, width: 200,
                                justifyContent: 'center', alignItems: 'center', marginLeft: 20, marginTop: 30}}
                    >
                        <Text style={{fontSize: 18, color: '#fff'}}>{this.state.isXiaBanOk === 'yes' ? '已签到' : '点击签到'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
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
                        <Title>签到</Title>
                    </Body>
                    <Right style={{flex: 1}} />
                </Header>
                <View style={{padding: 10, height: 60, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: gColors.page_gray_dark}}>
                    <Image style={{width: 40, height: 40, borderRadius: 20}} resizeMode='cover'
                            source={this.state.imgHeader ? {uri: HOST_UPLOAD + this.state.imgHeader} : sources.header01} />
                    <View style={{flex: 1, marginLeft: 10}}>
                        <Text style={{fontSize: 16}}>{this.state.name}</Text>
                        <Text>{this.state.unitName}</Text>
                    </View>
                </View>
                {this.renderSignStart()}
                {this.renderSignEnd()}
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
                            <Image source={sources.sign_success} style={{width: 60, height: 60}} resizeMode='contain' />
                            <Text style={{marginTop: 10}}>签到成功</Text>
                        </View>
                        <TouchableOpacity
                            style={{marginTop: 20}}
                            onPress={() => { this.setState({modalVisible: false})}}>
                            <Image  source={sources.sign_cancel} style={{width: 30, height: 30}} resizeMode='contain' />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </Container>
        )
    }
}