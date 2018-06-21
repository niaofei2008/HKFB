import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
    Modal,
    TextInput,
    TouchableWithoutFeedback,
} from 'react-native';
import {gSizes, gColors, gStyles, IOS} from '../../../utils/GlobalData';
import { Button, Header, Left, Right, Body, Title, Container} from "native-base";

import {UltimateListView} from "react-native-ultimate-listview";
import sources from "../../../../images/_sources";
import Toast from 'react-native-simple-toast';
import TaskListNet from '../../../utils/shouYe/ShouYe'
import moment from 'moment'
import LineDatePickerView from '../../../widgets/LineDatePickerView'
export default class TaskList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataTip: '加载中...',
            selectIndex: 0,
            taskState: '',
            modalVisible: false,
            inputValue: '',
            time: '',
        }
    }
    componentDidMount() {
        this.listerners = [];
        this.listerners.push(
            DeviceEventEmitter.addListener('refreshTaskList', () => {
                console.log('ddd', this.refs)
                this.refs.listView.refresh();
            })
        )
        
    }
    componentWillUnmount() {
        this.listerners && this.listerners.forEach(this.removeListerner)
    }
    removeListerner = (listern) => {
        listern && listern.remove()
    }   
    render() {
        return (
            <Container style={styles.container}>
                <Header style={{backgroundColor: gColors.primaryNavi}}>
                    <Left style={{flex: 1}}>
                        <Button transparent onPress={()=>{ this.props.navigation.goBack()}}>
                            <Image source={sources.ic_arrow_left} resizeMode='contain' style={{width: 20, height: 20}}/>
                        </Button>
                    </Left>
                    <Body style={{flex: 1, alignItems:'center'}}>
                        <Title>任务列表</Title>
                    </Body>
                    <Right style={{flex: 1}}>
                        <Button transparent
                            onPress={() => {
                                this.setState({
                                    modalVisible: true,
                                })
                            }}
                            style={{marginLeft: 20}}
                        >
                            <Image style={{width: 20, height: 20}} resizeMode='contain' source={sources.ic_search_gray} />
                        </Button>
                    </Right>
                </Header>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: gColors.page_gray,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {/* <TouchableOpacity
                        style={[styles.topSelectItem, {
                            backgroundColor: this.state.selectIndex === 0 ? gColors.primary : 'white',
                            borderBottomLeftRadius: gSizes.btnRadius,
                        }]}
                        onPress={() => this._onselected(0)}
                    >
                        <Text
                            style={[gStyles.text_normal, {color: this.state.selectIndex === 0 ? 'white' : gColors.primary,}]}
                        >
                            所有
                        </Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        style={[styles.topSelectItem, {
                            backgroundColor: this.state.selectIndex === 0 ? gColors.primary : 'white',
                        }]}
                        onPress={() => this._onselected(0)}
                    >
                        <Text
                            style={[gStyles.text_normal, {color: this.state.selectIndex === 0 ? 'white' : gColors.primary,}]}
                        >
                            未处理
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.topSelectItem, {backgroundColor: this.state.selectIndex === 1 ? gColors.primary : 'white'}]}
                        onPress={() => this._onselected(1)}>
                        <Text
                            style={[gStyles.text_normal, {color: this.state.selectIndex === 1 ? 'white' : gColors.primary,}]}>已安排</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.topSelectItem, {
                        backgroundColor: this.state.selectIndex === 2 ? gColors.primary : 'white',
                        borderBottomRightRadius: gSizes.btnRadius,
                    }]}
                                      onPress={() => this._onselected(2)}>
                        <Text
                            style={[gStyles.text_normal, {color: this.state.selectIndex === 2 ? 'white' : gColors.primary,}]}>已解决</Text>
                    </TouchableOpacity>
                    
                </View>
                <UltimateListView
                    ref="listView"
                    key="list"
                    onFetch={this.fetchData.bind(this)}
                    keyExtractor={(item, index) => index}
                    refreshableMode="basic"
                    item={this.renderRow.bind(this)}
                    waitingSpinnerText={this.state.dataTip}
                    allLoadedText=''
                />
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    onRequestClose={() => {}}
                    visible={this.state.modalVisible}
                    style={{justifyContent: 'center', alignItems: 'center'}}
                >
                    <TouchableWithoutFeedback
                        // activeOpacity={1}
                        onPress={() => {
                            this.setState({
                                modalVisible: false,
                            })
                        }}
                        >
                            <View style={{width: gSizes.screen_width, height: gSizes.screen_height, opacity: 0.7,
                                backgroundColor: 'black', position: 'absolute'}}/>
                        </TouchableWithoutFeedback>
                        <View
                            style={{backgroundColor: '#fff',width: gSizes.screen_width, height: 180,
                                position: 'absolute', marginTop: 60, alignItems: 'center'}}>
                            {/* <View style={{width: 100, height: 40, borderRadius: 4, borderWidth: 1, }} */}
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10,
                                    borderBottomColor: 'black',alignItems: 'center', borderBottomWidth: 1, width: gSizes.screen_width, height: 50}}>
                                <Text style={{}}>关键字</Text>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    // keyboardType='email-address'
                                    onChangeText={this._changeText}
                                    maxLength={16}
                                    placeholder={'请输入关键字'}
                                    placeholderTextColor={sources.page_gray}
                                    
                                    style={{fontSize: 16, height: 35, width: 200, borderWidth: 1, borderColor: 'black', padding: 0}}
                                />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10,
                                    borderBottomColor: 'black',alignItems: 'center', borderBottomWidth: 1, width: gSizes.screen_width, height: 50}}>
                                <Text>选择日期</Text>
                                <LineDatePickerView
                                    // tip="上报日期"
                                    mode='date'
                                    important={false}
                                    // tipImage={sources.tab02_time}
                                    androidMode='spinner'
                                    paddingVertical={0}
                                    minDate={new Date('1900/01/01')}
                                    maxDate={new Date('2199/12/31')}
                                    textHint={this.state.time}
                                    text={this.state.time}
                                    textNumberOfLines={1}
                                    style={{paddingHorizontal: gSizes.space_screen}}
                                    onDateChange={(date) => {
                                        this.setState({
                                            time: date,
                                        })
                                    }}/>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 20}}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.refs.listView.refresh();
                                    this.setState({
                                        modalVisible: false,
                                    })
                                }}
                                style={{width: 100, height: 40, backgroundColor: gColors.primaryNavi, justifyContent: 'center',
                                    alignItems: 'center', borderRadius: 4}}
                            >
                                <Text style={{color: '#fff', fontSize: 16}}>确定</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    
                                    this.setState({
                                        modalVisible: false,
                                        time: '',
                                        inputValue: '',
                                    }, () => {
                                        this.refs.listView.refresh();
                                    })
                                }}
                                style={{width: 100, height: 40, backgroundColor: gColors.primaryNavi, justifyContent: 'center',
                                    alignItems: 'center', marginLeft: 50, borderRadius: 4}}
                            >
                                <Text style={{color: '#fff', fontSize: 16}}>重置</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                </Modal>
            </Container>
        )
    }
    _changeText = (text) => {
        this.setState({
            inputValue: text,
        })
    }
    _onselected(index) {
        if (index == 0) {
            this.reportState = '未处理'
        } else if (index == 1) {
            this.reportState = '已安排'
        } else if (index == 2) {
            this.reportState = '已解决'
        }
        this.setState({
            selectIndex: index,
        })
        this.refs.listView.refresh();
    }

    reportState = '未处理'

    fetchData(page, startFetch, abortFetch) {
        TaskListNet.taskList(this.reportState, this.state.time, this.state.inputValue)
            .then(res => {
                startFetch(res, 100);
                abortFetch();
            })
            .catch(err => {
                abortFetch();
                console.log('err', err);
            })
        
        // Toast.show('暂无数据');
        

    }
    onRefresh = () => {
        this.refs.listView.refresh();
    }
    renderRow = (rowData, index) => {
        // let imageSources = {uri: ApiUrls.getImageUrl() + rowData.reportImage};
        let imageSources;
        if (rowData.taskState == '未处理') {
            imageSources = sources.news02;
        } else if (rowData.taskState == '已安排') {
            imageSources = sources.news03;
        } else if (rowData.taskState == '已解决'){
            imageSources = sources.news01;
        }
        if (this.state.selectIndex === 0) {
            return (
                <View
                    key={index}
                    style={gStyles.divider_top}>
                    <TouchableOpacity onPress={() => {
                        // Actions.PostEventsDetailScreen({idx: rowData.idx})
                        this.props.navigation.navigate('TaskListDetail', {idx: rowData.idx, onRefresh: this.onRefresh})
                    }}>
                        <View style={[{
                            flexDirection: 'row',
                            backgroundColor: gColors.page_normal,
                            borderRadius: gSizes.btnRadius,
                            flex: 1
                        }]}>
                            <View style={[styles.tipImage]}>
                                <Image style={[styles.ic_head]} source={imageSources}/>
                                {rowData.taskState == '未处理' ? <View style={styles.point}/> : null}

                            </View>
                            <View style={{marginVertical: gSizes.space_border, flex: 1}}>
                                <View style={{
                                    marginRight: gSizes.space_screen,
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <Text
                                        style={[gStyles.text_normal, {color: gColors.text_gray6}]}>{rowData.taskState}</Text>
                                    <Text
                                        style={[gStyles.text_normal, {color: gColors.text_gray6}]}>{rowData.createdate}</Text>
                                </View>
                                <View style={{
                                    marginTop: gSizes.space_border,
                                    paddingRight: gSizes.space_screen,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{flex: 1, marginRight: gSizes.space_border}}>
                                        <Text
                                            numberOfLines={1}
                                            style={[gStyles.text_small, {color: 'black'}]}>{rowData.taskContent}</Text>
                                    </View>
                                    <View style={{marginRight: gSizes.space_border}}>
                                        <Text numberOfLines={1}>
                                            {rowData.receiveName.length > 15 ?
                                                rowData.receiveName.substring(0, 14) + '...'
                                                : rowData.receiveName}
                                        </Text>
                                    </View>
                                </View>

                            </View>

                        </View>
                    </TouchableOpacity>
                </View>
            )
        } else if (this.state.selectIndex === 1) {
            return (
                <View
                    key={index}
                    style={gStyles.divider_top}>
                    <TouchableOpacity onPress={() => {
                        // Actions.PostEventsDetailScreen({idx: rowData.idx})
                        this.props.navigation.navigate('TaskListDetail', {idx: rowData.idx, onRefresh: this.onRefresh})
                    }}>
                        <View style={[{
                            flexDirection: 'row',
                            backgroundColor: gColors.page_normal,
                            borderRadius: gSizes.btnRadius,
                            flex: 1
                        }]}>
                            <View style={[styles.tipImage]}>
                                <Image style={[styles.ic_head]} source={imageSources}/>
                                {/*<View style={styles.point}/>*/}
                            </View>
                            <View style={{marginVertical: gSizes.space_border, flex: 1}}>
                                <View style={{
                                    marginRight: gSizes.space_screen,
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <Text
                                        style={[gStyles.text_normal, {color: gColors.text_gray6}]}>{rowData.taskState}</Text>
                                    <Text
                                        style={[gStyles.text_normal, {color: gColors.text_gray6}]}>{rowData.createdate}</Text>
                                </View>
                                <View style={{
                                    marginTop: gSizes.space_border,
                                    paddingRight: gSizes.space_screen,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{flex: 1, marginRight: gSizes.space_border}}>
                                        <Text
                                            numberOfLines={1}
                                            style={[gStyles.text_small, {color: 'black'}]}>{rowData.taskContent}</Text>
                                    </View>
                                    <View style={{marginRight: gSizes.space_border}}>
                                        <Text numberOfLines={1}>{rowData.HandleName1}</Text>
                                    </View>
                                </View>

                            </View>

                        </View>
                    </TouchableOpacity>
                </View>
            )
        } 
        // else if (this.state.selectIndex === 0) {
        //     return (
        //         <View
        //             key={index}
        //             style={gStyles.divider_top}>
        //             <TouchableOpacity onPress={() => {
        //                 // Actions.PostEventsDetailScreen({idx: rowData.idx})
        //                 this.props.navigation.navigate('TaskListDetail', {idx: rowData.idx, onRefresh: this.onRefresh})
        //             }}>
        //                 <View style={[{
        //                     flexDirection: 'row',
        //                     backgroundColor: gColors.page_normal,
        //                     borderRadius: gSizes.btnRadius,
        //                     flex: 1
        //                 }]}>
        //                     <View style={[styles.tipImage]}>
        //                         <Image style={[styles.ic_head]} source={imageSources}/>
        //                         {rowData.taskState == '未处理' ? <View style={styles.point}/> : null}
        //                     </View>
        //                     <View style={{marginVertical: gSizes.space_border, flex: 1}}>
        //                         <View style={{
        //                             marginRight: gSizes.space_screen,
        //                             flex: 1,
        //                             flexDirection: 'row',
        //                             justifyContent: 'space-between'
        //                         }}>
        //                             <Text
        //                                 style={[gStyles.text_normal, {color: gColors.text_gray6}]}>{rowData.taskState}</Text>
        //                             <Text
        //                                 style={[gStyles.text_normal, {color: gColors.text_gray6}]}>{rowData.createdate}</Text>
        //                         </View>
        //                         <View style={{
        //                             marginTop: gSizes.space_border,
        //                             paddingRight: gSizes.space_screen,
        //                             flexDirection: 'row',
        //                             justifyContent: 'space-between'
        //                         }}>
        //                             <View style={{flex: 1, marginRight: gSizes.space_border}}>
        //                                 <Text
        //                                     numberOfLines={1}
        //                                     style={[gStyles.text_small, {color: 'black'}]}>{rowData.taskContent}</Text>
        //                             </View>
        //                             <View style={{marginRight: gSizes.space_border}}>
        //                                 {this._renderText(rowData)}
        //                             </View>
        //                         </View>

        //                     </View>

        //                 </View>
        //             </TouchableOpacity>
        //         </View>
        //     )
        // }
        else if (this.state.selectIndex === 2){
            return (
                <View
                    key={index}
                    style={gStyles.divider_top}>
                    <TouchableOpacity onPress={() => {
                        // Actions.PostEventsDetailScreen({idx: rowData.idx})
                        this.props.navigation.navigate('TaskListDetail', {idx: rowData.idx})
                    }}>
                        <View style={[{
                            flexDirection: 'row',
                            backgroundColor: gColors.page_normal,
                            borderRadius: gSizes.btnRadius,
                            flex: 1
                        }]}>
                            <View style={[styles.tipImage]}>
                                <Image style={[styles.ic_head]} source={imageSources}/>
                                {/*<View style={styles.point}/>*/}
                            </View>
                            <View style={{marginVertical: gSizes.space_border, flex: 1}}>
                                <View style={{
                                    marginRight: gSizes.space_screen,
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <Text
                                        style={[gStyles.text_normal, {color: gColors.text_gray6}]}>{rowData.taskState}</Text>
                                    <Text
                                        style={[gStyles.text_normal, {color: gColors.text_gray6}]}>{rowData.createdate}</Text>
                                </View>
                                <View style={{
                                    marginTop: gSizes.space_border,
                                    paddingRight: gSizes.space_screen,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{flex: 1, marginRight: gSizes.space_border}}>
                                        <Text
                                            numberOfLines={1}
                                            style={[gStyles.text_small, {color: 'black'}]}>{rowData.dealContent}</Text>
                                    </View>
                                    <View style={{marginRight: gSizes.space_border}}>
                                        <Text numberOfLines={1}>{rowData.HandleName2}</Text>
                                    </View>
                                </View>

                            </View>

                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    _renderText(rowData) {
        if (rowData.taskState == '已安排') {
            return <Text numberOfLines={1}>{rowData.HandleName1}</Text>
        } else if (rowData.taskState == '未处理') {
            return <Text numberOfLines={1}>{rowData.trueName}</Text>
        } else if (rowData.taskState == '已解决'){
            return <Text numberOfLines={1}>{rowData.HandleName2}</Text>
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: gColors.page_gray,
    },
    topSelectItem: {
        width: (gSizes.screen_width - gSizes.space_screen * 2 ) / 5,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: gSizes.space_screen,
        borderColor: gColors.primary,
        borderWidth: gSizes.min_size * 2,
    },
    tipImage: {
        marginLeft: gSizes.space_screen,
        marginRight: gSizes.space_border,
        marginVertical: gSizes.space_border,
        width: gSizes.ic_head,
        height: gSizes.ic_head,
    },
    point: {
        height: 10,
        width: 10,
        borderRadius: 5,
        position: 'absolute',
        right: -5,
        top: -5,
        backgroundColor: 'red'
    },
    ic_head: {
        width: gSizes.ic_head,
        height: gSizes.ic_head,
    }
});