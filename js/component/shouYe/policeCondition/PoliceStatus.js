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
} from 'react-native';
import { Button, Header, Left, Right, Body, Title, Container} from "native-base";
import {gSizes, gColors, gStyles} from '../../../utils/GlobalData';
import sources from '../../../../images/_sources'
import {UltimateListView} from "react-native-ultimate-listview";
import Toast from 'react-native-simple-toast';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import _ from 'lodash'
import ShouYeNet from '../../../utils/shouYe/ShouYe'

export default class PoliceStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jingli: [],
            anbao: [],
            uIdx: this.props.navigation.state.params.uIdx,
            idx: this.props.navigation.state.params.idx,
            type: this.props.navigation.state.params.type,
            limitNumber: this.props.navigation.state.params.limitNumber,
            unitIdx: this.props.navigation.state.params.unitIdx,
        }
    }
    componentDidMount() {
       
    }
    fetchDataJingli = (page, startFetch, abortFetch) => {
        console.log(this.props.navigation.state.params)
        ShouYeNet.policeSelect(this.state.uIdx, this.state.idx, this.state.unitIdx)
            .then(res => {
                this.setState({
                    jingli: res,
                }, () => {
                    startFetch(this.state.jingli, 1000);
                    abortFetch();
                })
            })
            .catch(err => {
                console.log('err', err);
            })
        
    }
    fetchDataAnbao = (page, startFetch, abortFetch) => {
        ShouYeNet.anBaoSelect(this.state.uIdx, this.state.idx)
            .then(res => {
                this.setState({
                    anbao: res,
                }, () => {
                    startFetch(this.state.anbao, 1000);
                    abortFetch();
                })
            })
            .catch(err => {
                console.log('err', err);
            })
        
    }
    _renderRowJingli = (rowData, index) => {
        return this._renderRow(rowData, index, 'jingli');
    }
    _renderRowAnbao = (rowData, index) => {
        return this._renderRow(rowData, index, 'anbao');
    }
    _call = (phoneNumber) => {
        Linking.canOpenURL(`tel:${phoneNumber}`)
            .then(supported => {
                if (!supported) {
                } else {
                    return Linking.openURL(`tel:${phoneNumber}`);
                }
            })
            .catch(err => console.error('Error on LineInfoView linking uri ', err));
    }
    _renderRow = (rowData, index, type) => {
        if (type === 'jingli') {
            return (
                <View key={index} style={{flex: 1, padding: 10, alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff'}}>
                    <TouchableOpacity
                        onPress={() => {
                                let tmp = _.cloneDeep(this.state.jingli);
                                if (!tmp[index].isChose && tmp.filter(value => value.isChose).length === this.state.limitNumber) {
                                    Toast.show('人数已达上限')
                                    return
                                }
                                tmp[index].isChose = !this.state.jingli[index].isChose;
                                this.setState({
                                    jingli: tmp,
                                })
                        }} 
                        style={{flex: 1}}>
                        <Image
                            style={{width: 25, height: 25}}
                            resizeMode='contain'
                            source={this.state.jingli[index].isChose ? sources.checked : sources.unChecked} />
                    </TouchableOpacity>
                    <View style={{marginLeft: 20, flex: 10}}>
                        <Text>{this.state.jingli[index].trueName}-{this.state.jingli[index].unitName}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { this._call(rowData.uMobile)}} style={{flex: 1}}>
                        <Image source={sources.phoneCall} style={{width: 20, height: 20}} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View key={index} style={{flex: 1, padding: 10, alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff'}}>
                    <TouchableOpacity
                        onPress={() => {
                                let tmp = _.cloneDeep(this.state.anbao);
                                if (!tmp[index].isChose && tmp.filter(value => value.isChose).length === this.state.limitNumber) {
                                    Toast.show('人数已达上限')
                                    return
                                }
                                tmp[index].isChose = !this.state.anbao[index].isChose;
                                this.setState({
                                    anbao: tmp,
                                })
                        }} 
                        style={{flex: 1}}>
                        <Image
                            style={{width: 25, height: 25}}
                            resizeMode='contain'
                            source={this.state.anbao[index].isChose ? sources.checked : sources.unChecked} />
                    </TouchableOpacity>
                    <View style={{marginLeft: 20, flex: 10}}>
                        <Text>{this.state.anbao[index].trueName}-{this.state.anbao[index].unitName}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { this._call(rowData.uMobile)}} style={{flex: 1}}>
                        <Image source={sources.phoneCall} style={{width: 20, height: 20}} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
            )
        }
        
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
                        <Title>选择</Title>
                    </Body>
                    <Right style={{flex: 1}} />
                </Header>
                {/* <ScrollableTabView style={{flex: 1}} >
                    <View tabLabel='警力' > */}
                    {
                        this.state.type === '警力选择' ?
                        <View style={{flex: 1}}>
                        <UltimateListView
                            ref="listViewJingli"
                            key="listJingli"
                            onFetch={this.fetchDataJingli}
                            keyExtractor={(item, index) => index}
                            refreshableMode="basic"
                            item={this._renderRowJingli}
                            waitingSpinnerText={this.state.dataTip}
                            allLoadedText=''
                        />
                        <TouchableOpacity
                            onPress={() => {
                                // this.props.navigation.goBack();
                                let checkedArr = this.state.jingli.filter((value)=> value.isChose);
                                let checkedStr = checkedArr.map(value => {
                                    return value.idx
                                }).join(',');
                                console.log('%%%%', checkedStr);
                                // 第一个参数是这条记录 
                                ShouYeNet.confirmJingLi(this.props.navigation.state.params.idx, checkedStr, 'currentJingLiCount')
                                    .then(res => {
                                        console.log('#####', res);
                                        this.props.navigation.state.params.onRefresh();
                                        this.props.navigation.goBack()
                                    })
                            }}
                            style={{width: gSizes.screen_width - 40, height: 40, bottom: 20, backgroundColor: gColors.primaryNavi,
                                borderRadius: 2, marginHorizontal: 20, justifyContent: 'center', alignItems: 'center',position: 'absolute'}}>
                            <Text style={{color: '#fff', fontSize: 16}}>
                                出警({this.state.jingli.filter((value)=> value.isChose).length}/{this.state.jingli.length})
                            </Text> 
                        </TouchableOpacity>
                        </View>
                    // </View>
                    :
                    // <View style={{flex: 1}} tabLabel='安保'>
                    <View style={{flex: 1}}>
                        <UltimateListView
                            ref="listViewAnbao"
                            key="listAnbao"
                            onFetch={this.fetchDataAnbao}
                            keyExtractor={(item, index) => index}
                            refreshableMode="basic"
                            item={this._renderRowAnbao}
                            waitingSpinnerText={this.state.dataTip}
                            allLoadedText=''
                            
                        />
                        <TouchableOpacity
                            onPress={() => {
                                let checkedArr = this.state.anbao.filter((value)=> value.isChose);
                                let checkedStr = checkedArr.map(value => {
                                    return value.idx
                                }).join(',');
                                console.log('%%%%', checkedStr);
                                // 第一个参数是这条记录 
                                ShouYeNet.confirmJingLi(this.props.navigation.state.params.idx, checkedStr, 'currentBaoAnCount')
                                    .then(res => {
                                        console.log('#####', res);
                                        this.props.navigation.state.params.onRefresh();
                                        this.props.navigation.goBack()
                                    })
                            }}
                            style={{width: gSizes.screen_width - 40, height: 40, bottom: 20, backgroundColor: gColors.primaryNavi,
                                borderRadius: 2, marginHorizontal: 20, justifyContent: 'center', alignItems: 'center', position: 'absolute'}}>
                            <Text style={{color: '#fff', fontSize: 16}}>
                                出警({this.state.anbao.filter((value)=> value.isChose).length}/{this.state.anbao.length})
                            </Text> 
                        </TouchableOpacity>
                        </View>
                    // </View>
                    
                // </ScrollableTabView>
                            }
            </Container>
        )
    }
}