import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TextInput,
    TouchableWithoutFeedback
} from 'react-native';
import PropTypes from 'prop-types';
import {gSizes, gColors, gStyles} from '../utils/GlobalData';
import ArrowRight from "./ArrowRight";

export default class EditinfoView extends Component {

    static propTypes = {
        tipImage: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
        tip: PropTypes.string,
        showArrow: PropTypes.bool,
        placeholder: PropTypes.string,
        text: PropTypes.string,
        onChangeText: PropTypes.func,
        onPress: PropTypes.func,
    };

    static defaultProps = {
        showArrow: true,
        placeholder: '请选择',
    };

    constructor(props) {
        super(props);
        //TODO
    }

    render() {
        return (
        <View style={[gStyles.divider_top,styles.container]}>
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <View style={styles.container}>
                    {this.props.tipImage ? 
                        <Image
                            source={this.props.tipImage}
                            style={styles.tipImage}
                            resizeMode='contain'
                        />
                            : null
                    }
                    <Text style={[gStyles.text_normal,{marginLeft:this.props.tipImage ? gSizes.space_border :gSizes.space_screen }]}>{this.props.tip}</Text>
                    <TextInput
                        {...this.props}
                        ref="textInput"
                        placeholder={this.props.placeholder}
                        placeholderTextColor={gColors.text_gray6}
                        fontSize={gSizes.text_normal}
                        autoCorrect={false}
                        multiline={false}
                        value={this.props.text}
                        editable={!this.props.onPress}
                        onChangeText={this.props.onChangeText}
                        style={[styles.textInput,{marginRight:this.props.showArrow ? 0 : gSizes.space_screen}]}
                        autoCapitalize='none'
                        underlineColorAndroid="transparent"
                    />
                    {this.props.showArrow ? <View style={{marginRight:gSizes.space_screen}}><ArrowRight/></View> : null}
                </View>
            </TouchableWithoutFeedback>

        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems:'center',
        height: 44,
        width: gSizes.screen_width
    },
    tipImage: {
        marginLeft:gSizes.space_screen,
        height:20,
        width: 20,
    },
    textInput: {
        color: gColors.text_normal,
        fontSize: gSizes.text_normal,
        flex: 1,
        textAlign: 'right',
        marginHorizontal: gSizes.space_border,
    },
});