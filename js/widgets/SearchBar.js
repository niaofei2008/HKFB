/**
 * Created by Mavio on 2017/7/18.
 */


import React, {Component} from 'react'
import {
    Animated,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    TextInput,
} from 'react-native'
import PropTypes from 'prop-types';
import sources from '../../images/_sources'

import {
    gStyles,
    gSizes,
    gColors,
} from '../utils/GlobalData'

export default class SearchBar extends Component {

    static propTypes = {
        initShowHint: PropTypes.bool,
        onSearch: PropTypes.func,
        searchTextHint: PropTypes.string,
        backgroundColor: PropTypes.string,
    };

    static defaultProps = {
        initShowHint: true,
        searchTextHint:'搜索',
        backgroundColor: gColors.page_gray,
        onSearch: (text) => {},
    };


    constructor(props) {
        super(props);
        this.state = {
            showHint: this.props.initShowHint,
        }
    }


    render() {
        return (
            <View
                style={[styles.container]}>
                {
                    this.state.showHint
                        ?this._renderHint()
                        :
                        this._renderInput()
                }
            </View>
        );
    }

    _renderHint(){
        return (
            <TouchableWithoutFeedback
                onPress={this._hideHint.bind(this)}>
                <View
                    style={[gStyles.bg_rectf_gray, styles.content,{alignItems: 'center'}]}>
                    <Image
                        style={{width: 16, height: 16,marginLeft:gSizes.space_border}}
                        resizeMode='contain'
                        source={sources.ic_search_gray}/>
                    <Text
                        style={[gStyles.text_small, {marginLeft: gSizes.space_border,color:gColors.text_gray6}]}>
                        {this.props.searchTextHint}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    _renderInput(){
        return (
            <TextInput
                style={[gStyles.bg_rectf_gray, gStyles.text_small, styles.content, {backgroundColor: this.props.backgroundColor,alignItems: 'center', paddingLeft: gSizes.space_border_half,borderRadius:gSizes.btnRadius}]}
                onChange={(event) => this.props.onSearch(event.nativeEvent.text)}
                autoFocus={true}
                onSubmitEditing={() => {this.props.onSubmitEditing && this.props.onSubmitEditing()}}
                underlineColorAndroid="transparent"/>
        )
    }

    _hideHint(){
        this.setState({
            showHint: false,
        });
    }
}


const styles = StyleSheet.create({
    container: {
        height: gSizes.height_single_line,
        paddingHorizontal: gSizes.space_screen,
        paddingVertical: gSizes.space_border_half,
        flexDirection:'row',
        flex: 1,
    },

    content: {
        backgroundColor: gColors.page_normal,
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        padding: 0,
        height: 35,
    },
});