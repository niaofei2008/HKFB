import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    FlatList,
    InteractionManager,
} from 'react-native';
import { Button, Header, Left, Right, Body, Title} from "native-base";
import {gSizes, gColors, gStyles} from '../../../utils/GlobalData';
import {UltimateListView} from "react-native-ultimate-listview";
import SearchBar from "../../../widgets/SearchBar";
import TopModal from "../../../widgets/TopModal";
import sources from '../../../../images/_sources';
import JudgeUtils from "../../../utils/JudageUtils";
import HTML from 'react-native-render-html';
import Toast from 'react-native-simple-toast';
import MyNet from '../../../utils/my/My'

export default class NoticeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
           List: [],
        }
    }
    componentDidMount() {
        storage.load({key: 'userInfoKey'})
            .then(ret => {
                InteractionManager.runAfterInteractions(
                    () => {
                        MyNet.message(ret.idx)
                            .then(res => {
                                this.setState({
                                    List: res,
                                })
                            })
                            .catch(err => {
                                console.log('err', err);
                            })
                    }
                )
            })
        
    }
    render() {
        return (
        <View style={styles.container}>
            <Header style={{backgroundColor: gColors.primaryNavi}}>
                <Left style={{flex: 1}}>
                    <Button transparent onPress={()=>{ this.props.navigation.goBack()}}>
                        <Image source={sources.ic_arrow_left} resizeMode='contain' style={{width: 20, height: 20}}/>
                    </Button>
                </Left>
                <Body style={{flex: 1, alignItems:'center'}}>
                    <Title>我的消息</Title>
                </Body>
                <Right style={{flex: 1}} />
              </Header>
              <FlatList
                    data={this.state.List}
                    renderItem = {this.renderRow}
                    keyExtractor = {(item, index) => index}
                    style={{marginTop: 20}}
                />
        </View>
        )
    }

    renderRow = ({item, index}) => {
        return (
                <View style={styles.viewBg}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: gSizes.space_screen}}>
                            
                            <View style={{flex: 1, marginRight: gSizes.space_screen}}>
                                <Text style={gStyles.text_normal} numberOfLines={1}>{item.title}</Text>
                            </View>
                                <Text
                                    numberOfLines={1}
                                    style={[gStyles.text_small, {color: gColors.text_gray6,marginRight: gSizes.space_screen}]}>
                                    {item.createdate}
                                </Text>
                        </View>

                    <View style={{
                        marginHorizontal: gSizes.space_screen,
                        marginVertical: gSizes.space_border, marginBottom: gSizes.space_screen
                    }}>
                        <HTML html={item.content1} imagesMaxWidth={gSizes.screen_width} />
                    </View>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: gColors.page_gray,
    },
    viewBg: {
        backgroundColor: 'white',
        borderRadius: gSizes.picRadius,
        overflow: 'hidden',
        marginHorizontal: gSizes.space_screen,
        marginBottom: gSizes.space_screen
    },
    noticeImage: {
        height: 20,
        justifyContent: 'center',
        marginHorizontal: gSizes.space_screen
    },
    timeStyle: {
        position: 'absolute',
        right: gSizes.space_border,
    }
});