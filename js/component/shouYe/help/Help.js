'use strict';
import React, { Component } from 'react';
import { Image,Text,View,StyleSheet,WebView, InteractionManager} from 'react-native';
import { Button, Header, Left, Right, Body, Title, Container} from "native-base";
import {gSizes, gColors, gStyles, IOS} from '../../../utils/GlobalData';
import sources from "../../../../images/_sources";
const URL = HOST_HEAD + 'Adminmanage/Show.html';
export default class Help extends Component {
    
    constructor(props) {
       super(props);
       this.state = {
            show: false,
       }
     }
    componentDidMount() {
        InteractionManager.runAfterInteractions(
            () => {
                this.setState({
                    show: true,
                })
            }
        )
    }
    render () {
        return (
              <Container style={{flex:1,backgroundColor:'#f4f4f4'}}>
                <Header style={{backgroundColor: gColors.primaryNavi}}>
                    <Left style={{flex: 1}}>
                        <Button transparent onPress={()=>{ this.props.navigation.goBack()}}>
                            <Image source={sources.ic_arrow_left} resizeMode='contain' style={{width: 20, height: 20}}/>
                        </Button>
                    </Left>
                    <Body style={{flex: 1, alignItems:'center'}}>
                        <Title>帮助</Title>
                    </Body>
                    <Right style={{flex: 1}}/>
                </Header>
                {this.state.show ? 
                    <WebView
                        // style={{height:this.state.keyHeight}}
                        source={{uri: URL}}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        scalesPageToFit={true}
                    />
                    : null
                }
              </Container>
        );
    }
}