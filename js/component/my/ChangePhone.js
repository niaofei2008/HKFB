import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import { Button, Header, Left, Right, Body, Title, Container} from "native-base";
import {gSizes, gColors, gStyles} from '../../utils/GlobalData';
import sources from '../../../images/_sources'

export default class SighHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uMobile: ''
        }
    }
    componentDidMount() {
        storage.load({key: 'userInfoKey'})
            .then(ret => {
                this.setState({
                    uMobile: ret.uMobile,
                })
            })
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
                        <Title>手机更改</Title>
                    </Body>
                    <Right style={{flex: 1}} />
                </Header>
                <View style={{flex: 1,alignItems: 'center'}}>
                    <Image style={{marginTop: 40}} source={sources.phone_my} />
                    <Text style={{fontSize: 14, color: 'black', marginTop: 20}}>
                        {`你的手机号:  ${this.state.uMobile}`}
                    </Text>
                    <Text style={{marginBottom: 20, marginTop: 10}}>请确认是否需要更换手机</Text>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('ChangePhoneNumber')
                        }}
                        style={{width: gSizes.screen_width - 40, height: 44, justifyContent: 'center',
                            alignItems: 'center', borderRadius: 4, backgroundColor: '#fff'}}
                    >
                        <Text style={{fontSize: 16, color: gColors.primaryNavi}}>更换手机</Text>
                    </TouchableOpacity>
                </View>
            </Container>
        )
    }
}