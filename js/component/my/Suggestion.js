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
    TextInput,
} from 'react-native';
import { Button, Header, Left, Right, Body, Title, Container} from "native-base";
import {gSizes, gColors, gStyles} from '../../utils/GlobalData';
import sources from '../../../images/_sources'
import {UltimateListView} from "react-native-ultimate-listview";
import SearchBar from '../../widgets/SearchBar'
import MyNet from '../../utils/my/My'
import Toast from 'react-native-simple-toast'

export default class Suggestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
        }
    }
    componentDidMount() {
        storage.load({key: 'userInfoKey'})
            .then(ret => {
                this.setState({
                    idx: ret.idx,
                })
            })
    }
    _submitOpinion = () => {
        if (this.state.content=="") {
            Toast.show('请输入反馈内容');
        } else {
            MyNet.suggestion(this.state.content, this.state.idx)
                .then(res => {
                    Toast.show('感谢您的反馈');
                    this.props.navigation.goBack();
                })
                .catch(err => {
                    Toast.show('反馈失败，请稍后重试');
                    console.log('err', err);
                })
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
                        <Title>意见反馈</Title>
                    </Body>
                    <Right style={{flex: 1}}>
                        <Button transparent onPress={this._submitOpinion}>
                            <Text style={{color: '#fff'}}>提交</Text>
                        </Button>
                    </Right>
                </Header>
                <View style={{marginTop:1,backgroundColor:'#fff',padding:13}}>
                        <TextInput
                          style={{height:100}}
                          maxLength={100}
                          placeholder={"请输入您的意见反馈, 100字以内"}
                          multiline={true}
                          textAlignVertical={'top'}
                          underlineColorAndroid={"transparent"}
                          onChangeText={(text) => this.setState({content:text})}
                        />
                    </View>
            </Container>
        )
    }
}