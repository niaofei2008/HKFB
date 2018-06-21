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
    InteractionManager,
} from 'react-native';
import { Button, Header, Left, Right, Body, Title, Container} from "native-base";
import {gSizes, gColors, gStyles} from '../../utils/GlobalData';
import sources from '../../../images/_sources'
import {UltimateListView} from "react-native-ultimate-listview";
import SearchBar from "../../widgets/SearchBar";
import AddressBookNet from '../../utils/addressBook/AddressBook'
import TopModal from '../../widgets/TopModal'
export default class AddressBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            List: [],
            unitList: [],
            currentProjectIdx: '',
            keyword: '',
        }
    }
    search = (text) => {
        this.setState({
            keyword: text,
        })
    }
    unitListIdx = ''
    componentDidMount() {
        InteractionManager.runAfterInteractions(
            () => {
                this.getUserList();
            }
        )
    }
    getUserList = () => {
        AddressBookNet.info()
            .then(res => {
                this.setState({
                    List: res,
                })
            })
            .catch(err => {
                console.log('err', err)
            })
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
    _getList = () => {
        AddressBookNet.info(this.unitListIdx, this.state.keyword)
            .then(res => {
                this.setState({
                    List: res,
                })
            })
            .catch(err => {
                console.log('err', err)
            })
    }
    _selectedType = (index) => {
        this.unitListIdx = this.state.unitList[index].idx;
        
    }
    renderRow = (data) => {
        return (
            <View style={{flex: 1, height: 44, flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center', paddingHorizontal: 10, backgroundColor: '#fff', marginBottom: 0.5}}>
                <View style={{flex: 1}}>
                    <Image style={{width: 30, height: 30, borderRadius: 15}} source={data.item.imgHeader ? {uri: HOST_UPLOAD + data.item.imgHeader} : sources.addressBookAvatar} resizeMode='cover' />
                </View>
                <View style={{flex: 6, flexDirection: 'row'}}>
                    <Text>{data.item.trueName}</Text>
                    <Text>-{data.item.unitName}</Text>
                </View>
                <View style={{flex: 2, alignItems: 'flex-end'}}>
                    <TouchableOpacity onPress={() => {
                        this._call(data.item.uMobile);
                    }}>
                    <Image style={{width: 20, height: 20}} resizeMode='contain' source={sources.call} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    _keyExtrator = (item, index) => Math.round(Math.random() * 1000000)
    _onSubmitEditing = () => {
        this._getList()
    }
    render() {
        return (
            <Container style={{flex: 1, backgroundColor: gColors.page_gray}}>
               <Header style={{backgroundColor: gColors.primaryNavi}}>
               <Left style={{flex: 1}}>
                    <Button transparent onPress={()=>{
                        this.props.navigation.goBack()}}>
                        <Image source={sources.ic_arrow_left} resizeMode='contain' style={{width: 20, height: 20}}/>
                    </Button>
                </Left>
                <Body style={{flex: 1, alignItems:'center'}}>
                    <Title>通讯录</Title>
                </Body>
                <Right style={{flex: 1}}/>
              </Header>
              {/* {this.state.unitList.length > 0 ? <TopModal
                ref='moreModal'
                arr={this.state.unitList}
                onPress={(index) => this._selectedType(index)}
            /> : null} */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: gSizes.space_border,
                marginBottom: gSizes.space_border
                }}>
                <SearchBar
                        onSearch={this.search}
                        initShowHint={true}
                        searchTextHint='搜索关键字'
                        onSubmitEditing={this._onSubmitEditing}
                    />
                    <Text
                        onPress={() => {
                            // if (this.refs.moreModal) {
                            //     this.refs.moreModal.show();
                            // }
                            this._onSubmitEditing();
                        }}
                        style={[gStyles.text_small, {
                        paddingRight: gSizes.space_screen,
                        color: gColors.primary,
                    }]}>搜索</Text>
                </View>
                <FlatList
                    data={this.state.List}
                    renderItem = {this.renderRow}
                    keyExtractor = {this._keyExtrator}
                />
            </Container>
        )
    }
}