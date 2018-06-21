import React, {Component} from 'react'
import {
    Animated,
    StyleSheet,
    View,
    Modal,
    Text,
    Image,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native'
import PropTypes from 'prop-types';
import {
    gStyles,
    gSizes,
    gColors,
} from '../utils/GlobalData'
import sources from '../../images/_sources'

export default class TopModal extends Component {

    static propTypes = {
        arr: PropTypes.array.isRequired,
        onPress: PropTypes.func,
    }

    static defaultProps = {
        arr: [],
    }

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    render() {
        return (
            <Modal
                transparent={true}
                onRequestClose={this.hide.bind(this)}
                visible={this.state.visible}>
                {this.props.arr.length > 0 ? <TouchableWithoutFeedback
                    disabled={!this.state.visible}
                    onPress={this.hide.bind(this)}>
                    <View
                        style={styles.container}>
                        <View
                            style={styles.content}>
                            <Image
                                style={styles.triangle}
                                resizeMode="contain"
                                source={sources.ic_pop_trangle}/>
                            <ScrollView
                                style={styles.buttonContent}>
                                {this._renderItem()}
                            </ScrollView>
                        </View>
                    </View>
                </TouchableWithoutFeedback> : <View />}
            </Modal>
        );
    }

    _renderItem() {
        return (
            <View>
                {this.props.arr.map((item, index) =>
                    <View key={index}>
                        <TouchableWithoutFeedback
                            onPress={() => this.onPress(index)}>
                            <View
                                style={styles.button}>
                                {/*<Image*/}
                                    {/*style={styles.buttonIcon}*/}
                                    {/*source={item.image}/>*/}
                                <Text
                                    style={styles.buttonText}>
                                    {item.unitName}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.divider}/>
                    </View>
                )}
            </View>
        )
    }

    show() {
        this.setState({
            visible: true,
        })
    }

    hide() {
        this.setState({
            visible: false,
        })
    }

    onPress(index){
        if(this.props.onPress){
            this.props.onPress(index);
        }
        this.hide();
    }

}

let styles = StyleSheet.create({
    container: {
        alignItems: 'flex-end',
        width: gSizes.screen_width,
        height: gSizes.screen_height,
    },

    content: {
        marginTop: gSizes.height_title + 40,
        marginRight: gSizes.space_screen,
    },

    triangle: {
        alignSelf: 'flex-end',
        marginRight: gSizes.space_screen,
        width: 9,
        height: 6,
    },

    buttonContent: {
        width: 100,
        backgroundColor: gColors.bg_modal_content,
        borderRadius: gSizes.corner_large,
        // alignItems: 'stretch',
    },

    button: {
        flexDirection: 'row',
        paddingLeft: gSizes.space_screen,
        height: gSizes.singleLineInput,
        alignItems: 'center',
    },

    buttonIcon: {
        marginRight: gSizes.space_border,
        width: 12,
        height: 12,
    },

    buttonText: {
        color: gColors.text_white,
        fontSize: gSizes.text_small,
    },

    divider: {
        marginLeft: gSizes.space_screen,
        backgroundColor: '#000000',
        height: gSizes.size_divider,
        alignSelf: 'stretch',
    }
});