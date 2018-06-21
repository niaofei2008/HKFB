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
import {gSizes, gColors, gStyles} from '../../utils/GlobalData';
import sources from '../../../images/_sources'
import {UltimateListView} from "react-native-ultimate-listview";
import SearchBar from '../../widgets/SearchBar'
import MyNet from '../../utils/my/My'
export default class SighHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTip: '加载中',
            List: [],
            keyword: '',
        }
    }
    fetchData = (page, startFetch, abortFetch) => {
        MyNet.signStatus(this.state.keyword)
            .then(res => {
                startFetch(res, 100);
                abortFetch();
            })
            .catch(err => {
                console.log('err', err);
            })
    }
    _renderRow = (rowData, index) => {
        return (
            <View
                style={{padding: 10, height: 60, flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between', borderBottomColor: gColors.page_gray_dark, borderBottomWidth: 1}}
                key={index} >
                <View style={{flexDirection: 'row', flex: 3, alignItems: 'center'}}>
                    <Image source={rowData.imgHeader ? {uri: HOST_UPLOAD + rowData.imgHeader} : sources.defaultAvatar}
                        style={{height: 40, width: 40, borderRadius: 20}} resizeMode='cover' />
                    <View style={{justifyContent: 'center', marginLeft: 10}} >
                        <Text style={{fontSize: 14, color: 'black'}}>{rowData.trueName}-{rowData.unitName}</Text>
                        <Text numberOfLines={1} style={{fontSize: 12, color: gColors.primaryNavi}}>{rowData.gprsAddress}</Text>
                    </View>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'flex-end',flex: 1}}>
                    <Text style={{textAlign: 'right'}}>{rowData.qianDaoDate.split(' ')[0]}</Text>
                    <Text style={{textAlign: 'right'}}>{rowData.qianDaoDate.split(' ')[1]}</Text>
                </View>
            </View>
        )
    }
    search = (text) => {
        this.setState({
            keyword: text,
        })
    }
    _onSubmitEditing = () => {
        this.refs.listView.refresh();
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
                        <Title>签到历史</Title>
                    </Body>
                    <Right style={{flex: 1}} />
                </Header>
                {/* <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: gSizes.space_border,
                        marginBottom: gSizes.space_border
                        }}
                >
                    <SearchBar
                            onSearch={this.search}
                            initShowHint={true}
                            searchTextHint='搜索关键词'
                            onSubmitEditing={this._onSubmitEditing}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            this.refs.listView.refresh();
                        }}
                    >
                        <Text
                            style={[gStyles.text_small, {paddingRight: gSizes.space_screen,color: gColors.primaryNavi,}]}
                        >
                            搜索
                        </Text>
                    </TouchableOpacity>
                </View> */}
                <UltimateListView
                    ref="listView"
                    key="list"
                    onFetch={this.fetchData}
                    keyExtractor={(item, index) => index}
                    refreshableMode="basic"
                    item={this._renderRow}
                    waitingSpinnerText={this.state.dataTip}
                    allLoadedText=''
                    
                />
            </Container>
        )
    }
}