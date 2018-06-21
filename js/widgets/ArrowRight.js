/**
 * Created by Mavio on 2017/7/18.
 */


import React, {Component} from 'react'
import {
    Animated,
    StyleSheet,
    View,
    Image,
} from 'react-native'
import PropTypes from 'prop-types';
import {
    gStyles,
    gSizes,
    gColors,
} from '../utils/GlobalData';
import sources from '../../images/_sources'

export default class ArrowRight extends Component {

    static propTypes = {
        arrowImage: PropTypes.number,
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);
        //TODO 
    }


    render() {
        return (
            <Image
                style={[{width: 20, height: 20}, this.props.style]}
                resizeMode="contain"
                source={this.props.arrowImage ? this.props.arrowImage : sources.arrow_right}/>
        );
    }
}


let styles = StyleSheet.create({});