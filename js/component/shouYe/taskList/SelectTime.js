import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    WebView,
    Image,
    TouchableHighlight,
    TouchableWithoutFeedback
} from 'react-native';
import { Button, Header, Left, Right, Body, Title, Container} from "native-base";

import {gSizes, gColors, gStyles} from '../../../utils/GlobalData';
import {UltimateListView} from "react-native-ultimate-listview";
import SearchBar from "../../../widgets/SearchBar";
import sources from '../../../../images/_sources'
import SelectTimeNet from '../../../utils/shouYe/ShouYe'

export default class SelectTime extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataTip: '加载中...'
        }
    }

    keywords

    render() {
        return (
        <Container style={styles.container}>
            <Header style={{backgroundColor: gColors.primaryNavi}}>
                <Left style={{flex: 1}}>
                    <Button transparent onPress={()=>{ this.props.navigation.goBack()}}>
                        <Image source={sources.ic_arrow_left} resizeMode='contain' style={{width: 20, height: 20}}/>
                    </Button>
                </Left>
                <Body style={{flex: 3, alignItems:'center'}}>
                    <Title>选择预计处理时间</Title>
                </Body>
                <Right style={{flex: 1}}/>
            </Header>
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
        </Container>
        )
    }

    fetchData(page, startFetch, abortFetch) {
        SelectTimeNet.selectTime()
            .then(res => {
                startFetch(res.split('|'), 20)
                abortFetch();
            })
            .catch(err => {
                abortFetch();
                console.log('err', err);
            })
        // userApi.dealTime()
        //     .execute((data) => {
        //     if(data){
        //         startFetch(data.split('|'), 20);
        //     }
        //         abortFetch();
        //     }, (error) => {
        //         abortFetch();
        //         this.setState({
        //             dataTip: '暂无数据'
        //         })
        //         // AlertUtils.toast(error);
        //     });
    }

    renderRow = (rowData, index) => {
        return (
            <View
                key={index}>
                <TouchableWithoutFeedback onPress={() => {
                    this.props.navigation.state.params.dealTime(rowData);
                    this.props.navigation.goBack();
                }}>
                    <View style={[styles.viewBg,gStyles.divider_bottom]}>
                        <Text style={[gStyles.text_large,{marginVertical:gSizes.space_border,marginHorizontal:gSizes.space_screen}]} numberOfLines={1}>{rowData}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    _pressItem(rowData){
        // Actions.NoticeDetailScreen({idx:rowData.idx});
    }

    search(text) {
        this.keywords = text;
        this.refs.listView.refresh();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: gColors.page_gray,
    },
    viewBg: {
        backgroundColor: 'white',
        overflow: 'hidden',
    },
});