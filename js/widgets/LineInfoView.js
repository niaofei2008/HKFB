/**
 * Created by Jason on 2017/6/5.
 */


import React, {Component} from 'react'
import {
    Animated,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
    Linking,
    TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types';
import sources from '../../images/_sources'
import {gStyles, gSizes, gColors} from '../utils/GlobalData'

import ArrowRight from './ArrowRight'

export default class LineInfoView extends Component {

    static propTypes = {
        showDivider: PropTypes.bool,

        showTip: PropTypes.bool,
        tipImage: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
        tipImageWidth: PropTypes.number,
        tip: PropTypes.string,
        tipColor: PropTypes.string,
        tipFontSize: PropTypes.number,
        tipWidth: PropTypes.number,

        important: PropTypes.bool,

        text: PropTypes.oneOfType([PropTypes.string,PropTypes.object]),
        textHint: PropTypes.string,
        textColor: PropTypes.string,
        textFontSize: PropTypes.number,
        textJustifyContent : PropTypes.string,
        textNumberOfLines: PropTypes.number,

        renderContent: PropTypes.func,

        showArrow: PropTypes.bool,
        arrowImage: PropTypes.number,

        paddingVertical: PropTypes.number,

        onPress: PropTypes.func,

        uri: PropTypes.oneOfType(PropTypes.object, PropTypes.string),
    };

    static defaultProps = {
        showDivider: true,

        showTip: true,
        tipImageWidth: 20,
        tipColor: gColors.text_normal,
        tipFontSize: gSizes.text_normal,

        important: false,

        textHint: '未填写',
        textColor: gColors.text_normal,
        textFontSize: gSizes.text_normal,
        textJustifyContent: 'flex-start',
        textNumberOfLines: 1,

        showArrow: true,
        arrowImage: sources.arrow_right,

        paddingVertical: gSizes.space_border,
    };

    constructor(props) {
        super(props)
        //TODO 
    }


    render() {
        const paddingVertical = {
            marginTop: this.props.paddingVertical,
            marginBottom: this.props.paddingVertical,
        };

        const divider = this.props.showDivider ? gStyles.divider_top : null;
        return (
            <TouchableOpacity
                {...this.props}
                underlayColor={gColors.divider}
                onPress={this.onPress.bind(this)}
                style={[this.props.style, {alignItems: 'stretch', backgroundColor: gColors.page_normal}, divider]}
                >
                <View
                    style={{alignItems: 'stretch'}}>

                    <View
                        style={[{flexDirection: 'row', }]}>
                        {/*tip*/}
                        {
                            this.props.showTip
                                ?
                                <View style={[paddingVertical,
                                    {flexDirection: 'row', marginRight: gSizes.space_border},
                                    this.props.tipWidth?{width: this.props.tipWidth}:null
                                    ]}>
                                    {
                                        this.props.tipImage
                                            ? <Image style={{width: this.props.tipImageWidth, height: this.props.tipImageWidth}}
                                                     resizeMode="contain"
                                                     source={this.props.tipImage}/>
                                            : null
                                    }
                                    <Text
                                        style={{fontSize: this.props.tipFontSize, color: this.props.tipColor}}
                                        >
                                        {this.props.tip}
                                    </Text>

                                    {
                                        this.props.important ?
                                            <Text style={{fontSize: gSizes.text_normal,color: 'red'}}>*</Text>
                                            : null
                                    }
                                </View>
                                : null
                        }


                        {/*content*/}
                        <View style={[
                            {flex:1, flexDirection: 'row', justifyContent: this.props.textJustifyContent}]}>
                            {
                                this.renderContent()
                            }
                        </View>

                        {/*arrow*/}
                        {
                            this.props.showArrow
                                ? <ArrowRight
                                    arrowImage={this.props.arrowImage}
                                    style={paddingVertical}/>
                                : null
                        }
                    </View>

                </View>
            </TouchableOpacity>
        );
    }

    onPress() {
        if (this.props.onPress) this.props.onPress();
        else if (this.props.uri) {
            Linking.canOpenURL(this.props.uri)
                .then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle uri: ' + this.props.uri);
                    } else {
                        return Linking.openURL(this.props.uri);
                    }
                })
                .catch(err => console.error('Error on LineInfoView linking uri ', err));
        }
    }

    renderContent(){
        if(this.props.renderContent){
            return this.props.renderContent();
        }else{
            const paddingVertical = {
                marginTop: this.props.paddingVertical,
                marginBottom: this.props.paddingVertical,
            };
            return (
                this.props.text && this.props.text.trim().length > 0 ?
                    <Text
                        style={[paddingVertical, {fontSize: this.props.textFontSize, color: this.props.textColor}]}
                        numberOfLines={this.props.textNumberOfLines}
                    >
                        {this.props.text}
                    </Text>
                    :
                    <Text
                        style={[paddingVertical, {fontSize: this.props.textFontSize, color: gColors.text_gray6}]}>
                        {this.props.textHint}
                    </Text>
            );
        }
    }
}

const styles = StyleSheet.create({

});