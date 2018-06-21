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
    PixelRatio,
} from 'react-native';
import { Button, Header, Left, Right, Body, Title, Container} from "native-base";
import {gSizes, gColors, gStyles} from '../../../utils/GlobalData';
import sources from '../../../../images/_sources'
import {UltimateListView} from "react-native-ultimate-listview";
import Toast from 'react-native-simple-toast';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import _ from 'lodash'
import ShouYeNet from '../../../utils/shouYe/ShouYe'
export default class policeStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jingli: [],
            anbao: [],
            FuZeRenIdx_Fx: this.props.navigation.state.params.FuZeRenIdx_Fx,
            uIdx: this.props.navigation.state.params.uIdx, // 用户id
            idx: this.props.navigation.state.params.idx,
            type: this.props.navigation.state.params.type,
            limitNumber: this.props.navigation.state.params.limitNumber,
            unitIdx: this.props.navigation.state.params.unitIdx,
            unitName: this.props.navigation.state.params.unitName,
            myUnitIdx: '',
            isFuZheRen: '',
        }
    }
    componentDidMount() {
        storage.load({key: 'userInfoKey'})
            .then(ret => {
                this.setState({
                    myUnitIdx: ret.ZhiQinUnitIdx_Fx,
                    isFuZheRen: ret.isFuZheRen,
                })
            })
     }
    fetchDataJingli = (page, startFetch, abortFetch) => {
        ShouYeNet.policeShow(this.state.idx, this.state.unitIdx)
            .then(res => {
                startFetch(res, 100)
                abortFetch()
            })
            .catch(err => {
                abortFetch()
                console.log('err', err);
            })
        
    }
    fetchDataAnbao = (page, startFetch, abortFetch) => {
        ShouYeNet.anBaoShow(this.props.navigation.state.params.idx)
            .then(res => {
                startFetch(res, 100)
                abortFetch()
            })
            .catch(err => {
                abortFetch()
                console.log('err', err);
            })
        
    }
    _renderRowJingli = (rowData, index) => {
        return this._renderRow(rowData, index);
    }
    _renderRowAnbao = (rowData, index) => {
        return this._renderRow(rowData, index);
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
    componentWillUnmount() {
        this.props.navigation.state.params.onRefresh();
    }
    _renderRow = (rowData, index) => {
            return (
                <View key={index} style={{flex: 1, padding: 10, alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff'}}>
                    <Image style={{width: 30, height: 30}} resizeMode='contain'
                        source={rowData.imgHeader ? {uri: HOST_UPLOAD + rowData.imgHeader} : sources.defaultAvatar} />
                    <View style={{marginLeft: 20, flex: 10}}>
                        <Text>{rowData.trueName}-{rowData.unitName}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { this._call(rowData.uMobile)}} style={{flex: 1}}>
                        <Image source={sources.phoneCall} style={{width: 20, height: 20}} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
            )
    }
    onRefresh = () => {
        this.refs.listViewJingli && this.refs.listViewJingli.refresh();
        this.refs.listViewAnbao && this.refs.listViewAnbao.refresh();
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
                        <Title>{this.state.type === '警力选择' ? '当前警力情况' : '当前安保情况'}</Title>
                    </Body>
                    {
                        this.state.unitIdx === this.state.myUnitIdx &&  this.state.isFuZheRen === 'yes' ? 
                    
                        <Right style={{flex: 1}} >
                            <Button transparent onPress={() => {
                                this.props.navigation.navigate('PoliceStatus', 
                                    {
                                        idx: this.state.idx,
                                        uIdx: this.state.uIdx,
                                        onRefresh: this.onRefresh,
                                        type: this.state.type,
                                        limitNumber: this.state.limitNumber,
                                        unitIdx: this.state.unitIdx,
                                    })
                            }}>
                                <Text style={{fontSize: 14, color: '#fff'}}>选择</Text>
                            </Button>
                        </Right>
                    : <Right style={{flex: 1}} />
                    }
                </Header>
                {/* <View style={{backgroundColor: '#fff', height: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10}}> */}
                    <View style={{flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: '#fff',
                                 paddingLeft: 10, borderBottomWidth: 1/PixelRatio.get(), borderBottomColor: gColors.page_gray_dark}}>
                        <Image style={{height: 10, width: 4, marginRight: 5}} source={sources.smallIcon} resizeMode='contain' />
                        <Text>{'执勤区域  '}</Text>
                        <Text numberOfLines={2} style={{textAlign: 'center',fontSize: 14, color: gColors.primaryNavi}}>
                            {this.props.navigation.state.params.placeName}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: '#fff',
                                    paddingLeft: 10, borderBottomWidth: 1/PixelRatio.get(), borderBottomColor: gColors.page_gray_dark}}>
                        <Image style={{height: 10, width: 4, marginRight: 5}} source={sources.smallIcon} resizeMode='contain' />
                        <Text>{'执勤单位  '}</Text>
                        <Text style={{fontSize: 14, color: gColors.primaryNavi}}>
                            {this.state.unitName}
                        </Text>
                    </View>
                {/* </View> */}
                {/* <ScrollableTabView style={{flex: 1}} 
                initialPage={this.props.navigation.state.params.type === '警力选择' ? 0 : 1} 
                > */}
                        {
                           this.state.type  === '警力选择' ?
                        <UltimateListView
                            ref="listViewJingli"
                            key="listJingli"
                            onFetch={this.fetchDataJingli}
                            keyExtractor={(item, index) => index}
                            refreshableMode="basic"
                            item={this._renderRowJingli}
                            waitingSpinnerText={this.state.dataTip}
                            allLoadedText=''
                            tabLabel='警力'
                        />
                        :
                        <UltimateListView
                            ref="listViewAnbao"
                            key="listAnbao"
                            onFetch={this.fetchDataAnbao}
                            keyExtractor={(item, index) => index}
                            refreshableMode="basic"
                            item={this._renderRowAnbao}
                            waitingSpinnerText={this.state.dataTip}
                            allLoadedText=''
                            tabLabel='安保'
                        />
                        }
                {/* </ScrollableTabView> */}
            </Container>
        )
    }
}