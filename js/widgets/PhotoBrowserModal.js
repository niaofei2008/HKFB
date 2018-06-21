/**
 * Created by Jason on 2017/8/31.
 */

import React, {Component} from 'react'
import {
    Animated,
    StyleSheet,
    View,
    Text,
    Image,
    Modal,
    TouchableWithoutFeedback,
    PanResponder,
    ActivityIndicator
} from 'react-native'
import PropTypes from 'prop-types';
import {
    gStyles,
    gSizes,
    gColors,
} from '../utils/GlobalData'
import sources from '../../images/_sources'
export default class PhotoBrowserModal extends Component {

    static propTypes = {
        visible: PropTypes.bool,
        uri: PropTypes.string,
        dismissView: PropTypes.func,
    }

    static  defaultProps = {
        visible: false,
        uri: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
            scale: new Animated.Value(1),
            scale_rate: 1,
            imagex: 0,
            imagey: 0,
            imageH: gSizes.screen_height,
            imageW: gSizes.screen_width,
            viewAlpha: 1,
            pressTime: 0,
            isLoading: true,
        }
    }

    render() {
        let ImageSource = this.props.uri ? {uri: this.props.uri} : sources.Imageplaceholder;
        return (
            <Modal visible={this.props.visible}
                   animationType={"fade"}
                   transparent={true}
                   onRequestClose={this._dismiss.bind(this)}>
                <View
                    style={[styles.container,{backgroundColor: `rgba(0,0,0,${this.state.viewAlpha})`}]}>
                    <Animated.Image
                        {...this._panGestureTest.panHandlers}
                        source={ImageSource}
                        ref='image'
                        onLoadEnd={this._imageOnloadEnd.bind(this)}
                        resizeMode='contain'
                        style={[{
                            transform: [
                                {
                                    scale: this.state.scale
                                }
                            ]
                        },{
                            left: this.state.imagex,
                            top: this.state.imagey,
                            height: this.state.imageH,
                            width: this.state.imageW,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }]}>
                        
                    </Animated.Image>
                    <ActivityIndicator animating={this.state.isLoading} style={{backgroundColor:'transparent',width:40,height:40}}/>
                </View>
            </Modal>
        );
    }

    _imageOnloadEnd(event){
        this.setState({isLoading: false});
    }

    _dismiss(){
        this.setState({
            visible: false,
        })
        if (this.props.dismissView){
            this.props.dismissView();
        }
    }

    componentWillMount() {
        this._panGestureTest = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (event, gestureState) => true,
            onStartShouldSetPanResponderCapture: (event, gestureState) => true,
            onMoveShouldSetPanResponder: (event, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (event, gestureState) => true,

            // 开始手势操作
            onPanResponderGrant: (event, gestureState) => {
                this.lastPositionX = this.state.imagex;
                this.lastPositionY = this.state.imagey;
                this.zoomLastDistance = this.state.scale_rate;
                this.lastTouchStartTime = new Date().getTime();
            },
            // 手指移动过程中
            onPanResponderMove: (event, gestureState) => {
                let diffY = gestureState.dy - this.lastPositionY;
                if (this.state.scale_rate === 1){
                    this.setState({
                        imagex: this.lastPositionX+gestureState.dx,
                        imagey: this.lastPositionY+gestureState.dy
                    })
                }else {
                    this.setState({
                        imagex: this.lastPositionX+gestureState.dx
                    })
                }
                // 向下滑动背景变透明，并且图片缩小
                if (diffY > 0){
                    let _viewAlpha = 1-diffY/1000;
                    if (_viewAlpha < 0.5) _viewAlpha = 0.5;
                    Animated.spring(
                        this.state.scale,
                        {
                            toValue: _viewAlpha,
                        }
                    ).start();
                    this.setState({
                        viewAlpha: _viewAlpha,
                    })
                }
            },
            // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            onPanResponderTerminate: (event, gestureState) => {
                if (this.state.scale_rate === 1) {
                    this.setState({
                        imagey: 0,
                        imagex: 0,
                        viewAlpha: 1,
                        scale: new Animated.Value(1),
                    })
                }else {
                    this.setState({
                        imagex: this.lastPositionX + gestureState.dx
                    })
                }
            },
            // 用户放开了所有的触摸点。
            onPanResponderRelease: (event, gestureState) => {
                if (Math.abs(gestureState.dy) < 0.5 && Math.abs(gestureState.dx) < 0.5){
                    this._dismiss();
                }
                if (gestureState.dy >= 140){
                    this._dismiss();
                }
                if (this.state.scale_rate === 1) {
                    this.setState({
                        imagey: 0,
                        imagex: 0,
                        viewAlpha: 1,
                        scale: new Animated.Value(1),
                    })
                }else {
                    this.setState({
                        imagex: this.lastPositionX + gestureState.dx
                    })
                }
            }
        });
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});