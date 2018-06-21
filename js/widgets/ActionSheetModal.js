/**
 * Created by Jason on 2017/7/13.
 */
import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Modal,
    Text,
    TouchableHighlight,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    Alert,
} from 'react-native'
import PropTypes from 'prop-types';
import {gStyles, gSizes, gColors} from '../utils/GlobalData'
const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;


export default class ActionSheetModal extends Component {

    constructor(props) {
        super(props);
        //TODO
    }

    static defaultProps = {

    };

    static propTypes = {
        cellsArr: PropTypes.array.isRequired,
        cancelFunc: PropTypes.func,
        onPress: PropTypes.func,
        actionvisible: PropTypes.bool,
        cellHeight: PropTypes.number,
    };

    render(){
        return(
            <Modal
                animationType={'none'}
                transparent={true}
                visible={this.props.actionvisible}
                onRequestClose={this.props.cancelFunc}
                style={styles.modalStyle}>
                <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)'}}>
                    <TouchableWithoutFeedback onPress={this.props.cancelFunc}>
                        <View style={{flex: 1}}>
                        </View>
                    </TouchableWithoutFeedback>
                    {this._render()}
                </View>
            </Modal>
        );
    }

    _render() {
        if (this.props.cellsArr.length <= 0 || this.props.cellsArr.length > 6){
            return null;
        }

        return (
            <View style={{backgroundColor: 'rgba(255,255,255,0.8)'}}>
                {this._renderCell()}
                <TouchableOpacity activeOpacity={0.8} onPress={this.props.cancelFunc}><View style={[styles.bottomCellStyle,{height: this.props.cellHeight ? this.props.cellHeight : 50}]}><Text
                    style={styles.textStyle}>取消</Text></View></TouchableOpacity>
            </View>
        );
    }

    _renderCell() {

        const cells = [];

        for (let i = 0 ; i < this.props.cellsArr.length ; i ++){
            cells.push(<TouchableOpacity activeOpacity={0.8} key={i} onPress={()=> this.props.onPress(i)}><View  style={[styles.otherCellStyle,{height: this.props.cellHeight ? this.props.cellHeight : 50}]}><Text
                style={styles.textStyle}>{this.props.cellsArr[i]}</Text></View></TouchableOpacity>)
        }
        return cells;
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        justifyContent: 'flex-end',
    },
    otherCellStyle: {
        marginBottom: 1 * gSizes.min_size,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomCellStyle: {
        marginTop: 10 * gSizes.min_size,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: gSizes.text_title,
        color: gColors.text_normal,
    }
});