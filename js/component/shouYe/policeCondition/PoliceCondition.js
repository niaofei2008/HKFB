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
    InteractionManager,
    Modal,
} from 'react-native';
import { Button, Header, Left, Right, Body, Title, Container} from "native-base";
import {gSizes, gColors, gStyles} from '../../../utils/GlobalData';
import sources from '../../../../images/_sources'
import {UltimateListView} from "react-native-ultimate-listview";
import Toast from 'react-native-simple-toast';
import ShouYeNet from '../../../utils/shouYe/ShouYe'
export default class PoliceCondition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            List: [],
            modalVisible: false,
        }
    }
    getPoliceCondition = () => {
        ShouYeNet.policeCondition(this.state.idx)
            .then(res => {
                this.setState({
                    List: res,
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
                    unitIdx: ret.ZhiQinUnitIdx_Fx,
                    isFuZheRen: ret.isFuZheRen,
                }, () => {
                    InteractionManager.runAfterInteractions(
                        () => {
                            this.getPoliceCondition();
                        }
                    )
                    
                })
            })
    }
    onRefresh = () => {
        this.getPoliceCondition();
    }
    renderSelectLabel = (signed, all, type, noBorder, idx, FuZeRenIdx_Fx, place, name, unitIdx, unitName) => {
        return (
            <View style={{flex: 4,flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRightWidth: noBorder ? 1 : 0, borderRightColor: gColors.page_gray, paddingHorizontal: 10}}>
                <TouchableOpacity
                    style={{flex: 1,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                    onPress={() => {
                        // idx 任务idx
                        this.props.navigation.navigate('PoliceShowPage',
                        {type: type, idx: idx, uIdx: this.state.idx, placeName: place, fuzeren: name, FuZeRenIdx_Fx: FuZeRenIdx_Fx,
                            onRefresh: this.onRefresh, limitNumber: all, unitIdx: unitIdx, unitName: unitName});
                        // this.props.navigation.navigate('PoliceStatus',{type: type, count: all, idx: idx, FuZeRenIdx_Fx: FuZeRenIdx_Fx, uIdx: this.state.idx, onRefresh: this.onRefresh})
                    }}
                >
                    
                        <Text style={{fontSize: 14, }}>{type}</Text>
                        <Image source={sources.jingliExpand} style={{width: 15, height: 15}} resizeMode='contain' />
                   
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={{fontSize: 12}}>已选人员</Text>
                            <Text style={{fontSize: 12}}>[{signed}/{all}]</Text>
                        </View>
                        <View style={{height: 5, marginTop: 3, flexDirection: 'row', borderWidth: 1/PixelRatio.get(), borderColor: gColors.page_gray_dark}}>
                            <View style={{backgroundColor: signed/all > 0.3 ? signed/all > 0.8 ? '#6aa84f' : '#e69138' : 'red', flex: signed}} />
                            <View style={{flex: all - signed}} />
                        </View>
                    </View>
                </View>
        )
    }
    renderRow = ({item, index}) => {
        return (
            <View key ={index} style={{flex: 1, paddingVertical: 10,flexDirection: 'row', backgroundColor: '#fff', margin: 5}}>
                <TouchableOpacity
                    onPress={() => {
                        this.modalText = item.renWuZhiZeRemark
                        this.setState({
                            modalVisible: true
                        })
                    }}
                    style={{flex: 2, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: gColors.page_gray}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={sources.smallIcon} style={{width: 3, marginRight: 3}} resizeMode='contain' />
                        <Text style={{fontSize: 12, color: gColors.page_gray_dark}}>执勤区域</Text>
                    </View>
                    <Text style={{color: '#e83f1d', fontSize: 12, textAlign: 'center', marginTop: 5}}>{item.zhiQinPlaceName}</Text>
                </TouchableOpacity>
                <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: gColors.page_gray}}>
                    <Text style={{fontSize: 12, color: gColors.page_gray_dark}}>执勤单位</Text>
                    <Text style={{fontSize: 14, marginTop: 5,
                            color: this.state.isFuZheRen === 'yes' && this.state.unitIdx === item.unitIdx.toString() ? gColors.primaryNavi : 'black'}}>
                        { item.unitName}
                    </Text>
                </View>
                {
                    this.renderSelectLabel(item.currentJingLiCount, item.needJingLiCount, '警力选择', true, item.idx,
                            item.FuZeRenIdx_Fx, item.zhiQinPlaceName, item.trueName, item.unitIdx.toString(), item.unitName)
                }
                {/* {
                    this.renderSelectLabel(rowData.currentBaoAnCount, rowData.needBaoAnCount, '安保选择', false, rowData.idx,
                            rowData.FuZeRenIdx_Fx, rowData.zhiQinPlaceName, rowData.trueName)
                } */}
            </View>
        )
    }
    modalText = ''
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
                        <Title>警力情况列表</Title>
                    </Body>
                    <Right style={{flex: 1}} />
                </Header>
            <FlatList
                    data={this.state.List}
                    renderItem = {this.renderRow}
                    keyExtractor = {(item, index) => index}
                />
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
                                style={{width: gSizes.screen_width/4*3, position: 'absolute', backgroundColor: '#fff',
                                    marginLeft: gSizes.screen_width/8, marginTop: gSizes.screen_height/8,
                                    borderRadius: 4}}
                            >
                                <View style={{backgroundColor: gColors.primaryNavi, height: 50, justifyContent: 'center',
                                        alignItems: 'center', borderTopLeftRadius: 4, borderTopRightRadius: 4}}>
                                    <Text style={{fontSize: 16}}>岗位职责</Text>
                                </View>
                                <Text style={{padding: 10,lineHeight: 18, fontSize: 14}}>{this.modalText}</Text>
                            </View>
                        
            </Modal>
            </Container>
        )
    }
}