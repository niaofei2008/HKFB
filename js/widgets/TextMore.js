import React, {Component} from 'react';
import {
    Dimensions,
    View,
    Text,
    Platform,
    StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
export default class TextMore extends Component {

    static propTypes = {
        contentText: PropTypes.string.isRequired,
        contentStyle: Text.propTypes.style,
        contentLines: PropTypes.number,

        moreText: PropTypes.array.isRequired,
        moreStyle: Text.propTypes.style
    };

    static defaultProps = {
        contentText: '',
        moreText: ['收起详情', '展开详情'],
        contentLines: 3,
        moreStyle: {},
        contentStyle: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            contentLines: 0,
            isShowMore: false,
            isExpand: false
        };
    }

    render() {
        return (
            <View
                style={this.props.style}>
                <Text
                    onLayout={this._onLayout.bind(this)}
                    style={[{...this.props.contentStyle}]}
                    numberOfLines={this.state.contentLines}>
                    {this.props.contentText}
                </Text>
                {this._renderMoreElement()}
            </View>
        )
    }

    _renderMoreElement(){
        if (this.state.isShowMore) {
            return(
                <Text
                    onPress={this._switchCollapse.bind(this)}
                    style={[{...this.props.moreStyle}]}>
                    {this.state.isExpand ? this.props.moreText[0] : this.props.moreText[1]}
                </Text>);
        }else {
            return null;
        }
    }

    _switchCollapse() {
        this.setState({
            isExpand: !this.state.isExpand
        });
        if (this.state.contentLines === this.props.contentLines) {
            this.setState({contentLines: 0})
        }
        else {
            this.setState({contentLines: this.props.contentLines})
        }
    }

    _onLayout(e) {
        let {height} = e.nativeEvent.layout;

        if (height > this.props.contentLines * 24) {
            if (!this.state.isExpand) {
                this.setState({contentLines: this.props.contentLines})
            }
            if (this.props.contentLines !== 0) {
                this.setState({isShowMore: true});
            }
        }
    }
}