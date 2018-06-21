import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
    TouchableOpacity,
} from 'react-native';
import _ from 'lodash'
import { Button, Header, Left, Right, Body, Title, Container} from "native-base";
import {gSizes, gColors, gStyles} from '../../../utils/GlobalData';
import sources from '../../../../images/_sources'
import {UltimateListView} from "react-native-ultimate-listview";
import SearchBar from "../../../widgets/SearchBar";
import ExpanableList from '../../../widgets/react-native-expandable-section-flatlist';
import TaskPublishNet from '../../../utils/taskPublish/TaskPublish'
import RongCloud from 'rongcloud-imlib-react-native'

export default class CreateChatroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // params.List 任务下发传来的参数
            data: this.props.navigation.state.params.List ? this.props.navigation.state.params.List : [],
            sectionSelect: [],
            keyword: '',
            isDiscussionSetting: this.props.navigation.state.params.isDiscussionSetting,
            memberList: this.props.navigation.state.params.memberList,
        }
    }
    componentDidMount() {
        if (this.state.data.length > 0) {
            // 从任务下发来
        } else {
            // 群聊
            TaskPublishNet.taskUserList()
            .then(res => {
                this.setState({
                    data: res,
                })
            })
            .catch(err => {
                console.log('err', err);
            })
        }
    }
    search = (text) => {
        this.setState({
            keyword: text,
        })
    }
    isCreateDiscussion = false
    componentWillUnmount() {
        console.log('------------')
        this.isCreateDiscussion && this.props.navigation.state.params.chatDetailBack()
    }
    _renderRow = (rowItem, rowId, sectionId) => {
        // console.log(this.state.data)
        return (
            <View style={{flex: 1, height: 44, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
                 paddingHorizontal: 10, marginBottom: 0.5}}>
               <View style={{flex: 1}} />
               <View style={{flex: 1}}>
                <TouchableOpacity onPress={() => {
                    
                    if (this.state.isDiscussionSetting === 'yes' && this.state.memberList.indexOf(this.state.data[sectionId].content[rowId].idx) > -1) {

                    } else {
                        let lodash_data = _.cloneDeep(this.state.data);
                        lodash_data[sectionId].content[rowId].isChecked = !this.state.data[sectionId].content[rowId].isChecked;
                        // console.log(lodash_data)
                        this.setState({
                            data: lodash_data,
                        }, () => {
                            // console.log(this.state.data)
                        })
                    }
                }}>
                    {
                        this.state.data[sectionId].content[rowId].isChecked ?
                            <Image style={{width: 20, height: 20}} resizeMode='contain' source={sources.select_circle} />
                            :
                            <Image style={{width: 20, height: 20}} source={sources.circle} resizeMode='contain' />
                    }
                 </TouchableOpacity>
               </View>
               <View style={{flex: 7}}>
                    <Text>{rowItem.trueName}</Text>
               </View>
            </View>
        )
    }
    _renderSection = (section, sectionId) => {
        return (
            <View style={{flex: 1, height: 44, flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center', paddingHorizontal: 10, backgroundColor: '#fff', marginBottom: 0.5}}>
                <View style={{flex: 1}}>
                    <TouchableOpacity
                        onPress={() => {
                            let tmp = _.cloneDeep(this.state.data);
                            tmp[sectionId].isChecked = !this.state.data[sectionId].isChecked;
                            if (tmp[sectionId].isChecked) {
                                for (let i = 0; i < tmp[sectionId].content.length; i++) {
                                    tmp[sectionId].content[i].isChecked = true;
                                }
                            } else {
                                for (let i = 0; i < tmp[sectionId].content.length; i++) {
                                    if (this.state.isDiscussionSetting === 'yes' && this.state.memberList.indexOf(tmp[sectionId].content[i].idx) > -1) {
                                        // 群聊设置
                                    } else {
                                        tmp[sectionId].content[i].isChecked = false;
                                    }
                                }
                            }
                            // console.log(tmp[sectionId])
                            this.setState({
                                data: tmp,
                            })
                        }}
                        >
                        <Image style={{width: 20, height: 20}} source={this.state.data[sectionId].isChecked ? sources.select_circle : sources.circle} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 6, flexDirection: 'row'}}>
                    <Text>{section}</Text>
                    <Text style={{color: gColors.page_gray_dark, marginLeft: 30}}>({this.state.data[sectionId].content.length}人)</Text>
                </View>
                <View style={{flex: 2, alignItems: 'flex-end'}}>
                    <TouchableOpacity onPress={() => {
                        DeviceEventEmitter.emit('sectionState', sectionId);
                        let tmp = _.cloneDeep(this.state.data);
                        tmp[sectionId].isExpand = !this.state.data[sectionId].isExpand;
                        this.setState({
                            data: tmp,
                        })
                    }}>
                        <Image style={{width: 20, height: 20}} resizeMode='contain' source={this.state.data[sectionId].isExpand ? sources.expand_opacity : sources.expand} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    _onSubmitEditing = () => {

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
                    <Title>选择人员</Title>
                </Body>
                <Right style={{flex: 1}}/>
              </Header>
                <ExpanableList
                    dataSource={this.state.data}
                    headerKey='unitName'
                    memberKey='content'
                    renderRow={this._renderRow}
                    renderSectionHeaderX={this._renderSection}
                    />
                <View style={{bottom: 0,backgroundColor: '#fff', padding: 10,flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between'}}>
                    <Text style={{color: 'red'}}>已经选择:</Text>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.props.navigation.state.params.List) {
                                // 任务下发里的选择人员
                                let tmp = _.cloneDeep(this.state.data);
                                for (let i = 0; i < tmp.length; i++) {
                                    tmp[i].isExpand = false;
                                }
                                this.props.navigation.state.params.callback(tmp);
                                this.props.navigation.goBack();
                            } else {
                                // 创建群聊里的选择人员
                                let tmp = _.cloneDeep(this.state.data);
                                let userList = [];
                                let nameList = [];
                                for (let i = 0; i < tmp.length; i++) {
                                    for (let j = 0; j < tmp[i].content.length; j++) {
                                        if (tmp[i].content[j].isChecked) {
                                            userList.push(tmp[i].content[j].idx);
                                            nameList.push(tmp[i].content[j].trueName);
                                        }
                                    }
                                }
                                let name = nameList.toString();
                                let strName = '';
                                if (name.length < 7) {
                                    strName = name;
                                } else {
                                    strName = name.substring(0, 7);
                                    strName = strName + '...'
                                }
                                RongCloud.createDiscussion(strName, userList)
                                    .then(data => {
                                        console.log('创建群聊', data);
                                        this.isCreateDiscussion = true;

                                    })
                                    .catch(err => {
                                        console.log('err', err);
                                    })
                                this.props.navigation.goBack();
                            }
                        }}
                        style={{width: 80, height: 30,backgroundColor: gColors.primaryNavi, justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Text style={{color: '#fff'}}>
                            {`确定(${this.state.data.map(value => value.content).reduce((a, b) => a.concat(b), []).filter(item => item.isChecked).length}人)`}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Container>
        )
    }
}