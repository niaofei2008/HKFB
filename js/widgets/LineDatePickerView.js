/**
 * Created by Mavio on 2017/7/27.
 */


import React, {Component} from 'react'
import {
    Animated,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
    Modal,
    DatePickerAndroid,
    TimePickerAndroid,
    DatePickerIOS,
    Platform,
    Keyboard,
    TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types';
import {
    gStyles,
    gSizes,
    gColors,
} from '../utils/GlobalData';
import moment from "moment";
import ArrowRight from "./ArrowRight";
import sources from "../../images/_sources";

const FORMATS = {
    'date': 'YYYY-MM-DD',
    'datetime': 'YYYY-MM-DD HH:mm',
    'time': 'HH:mm'
};

const SUPPORTED_ORIENTATIONS = ['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right'];

export default class LineDatePickerView extends Component {

    static propTypes = {
        mode: PropTypes.oneOf(['date', 'datetime', 'time']),
        androidMode: PropTypes.oneOf(['calendar', 'spinner', 'default']),
        date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        format: PropTypes.string,
        minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        height: PropTypes.number,
        duration: PropTypes.number,
        confirmBtnText: PropTypes.string,
        cancelBtnText: PropTypes.string,
        iconComponent: PropTypes.element,
        showIcon: PropTypes.bool,
        disabled: PropTypes.bool,
        onDateChange: PropTypes.func,
        onOpenModal: PropTypes.func,
        onCloseModal: PropTypes.func,
        onPressMask: PropTypes.func,
        placeholder: PropTypes.string,
        modalOnResponderTerminationRequest: PropTypes.func,
        is24Hour: PropTypes.bool,

        showDivider: PropTypes.bool,

        showTip: PropTypes.bool,
        tipImage: PropTypes.number,
        tip: PropTypes.string,
        tipColor: PropTypes.string,
        tipFontSize: PropTypes.number,
        tipWidth: PropTypes.number,

        important: PropTypes.bool,

        text: PropTypes.string,
        textHint: PropTypes.string,
        textColor: PropTypes.string,
        textFontSize: PropTypes.number,
        textJustifyContent : PropTypes.string,
        textNumberOfLines: PropTypes.number,

        showArrow: PropTypes.bool,
        arrowImage: PropTypes.number,

        paddingVertical: PropTypes.number,

        onPress: PropTypes.func,
    };

    static defaultProps = {
        mode: 'date',
        androidMode: 'default',
        date: '',// slide animation duration time, default to 300ms, IOS only
        duration: 300,
        confirmBtnText: '确定',
        cancelBtnText: '取消',

        showDivider: true,

        showTip: true,
        tipColor: gColors.text_normal,
        tipFontSize: gSizes.text_normal,

        important: false,

        textHint: '请选择',
        textColor: gColors.text_normal,
        textFontSize: gSizes.text_normal,
        textJustifyContent: 'flex-end',
        textNumberOfLines: 1,

        showArrow: true,
        arrowImage: sources.arrow_right,

        paddingVertical: gSizes.space_border,
    };

    constructor(props) {
        super(props);

        this.state = {
            text: '',
            date: this.getDate(),
            modalVisible: false,
            animatedHeight: new Animated.Value(0),
            allowPointerEvents: true
        };

        this.getDate = this.getDate.bind(this);
        this.getDateStr = this.getDateStr.bind(this);
        this.datePicked = this.datePicked.bind(this);
        this.onPressDate = this.onPressDate.bind(this);
        this.onPressCancel = this.onPressCancel.bind(this);
        this.onPressConfirm = this.onPressConfirm.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.onPressMask = this.onPressMask.bind(this);
        this.onDatePicked = this.onDatePicked.bind(this);
        this.onTimePicked = this.onTimePicked.bind(this);
        this.onDatetimePicked = this.onDatetimePicked.bind(this);
        this.onDatetimeTimePicked = this.onDatetimeTimePicked.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
    }

    componentWillMount() {
        // ignore the warning of Failed propType for date of DatePickerIOS, will remove after being fixed by official
        console.ignoredYellowBox = [
            'Warning: Failed propType'
            // Other warnings you don't want like 'jsSchedulingOverhead',
        ];
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.date !== this.props.date) {
            this.setState({date: this.getDate(nextProps.date)});
        }
    }

    setModalVisible(visible) {
        const {height, duration} = this.props;

        // slide animation
        if (visible) {
            this.setState({modalVisible: visible});
            return Animated.timing(
                this.state.animatedHeight,
                {
                    toValue: height,
                    duration: duration
                }
            ).start();
        } else {
            return Animated.timing(
                this.state.animatedHeight,
                {
                    toValue: 0,
                    duration: duration
                }
            ).start(() => {
                this.setState({modalVisible: visible});
            });
        }
    }

    onStartShouldSetResponder(e) {
        return true;
    }

    onMoveShouldSetResponder(e) {
        return true;
    }

    onPressMask() {
        if (typeof this.props.onPressMask === 'function') {
            this.props.onPressMask();
        } else {
            this.onPressCancel();
        }
    }

    onPressCancel() {
        this.setModalVisible(false);

        if (typeof this.props.onCloseModal === 'function') {
            this.props.onCloseModal();
        }
    }

    onPressConfirm() {
        this.datePicked();
        this.setModalVisible(false);

        if (typeof this.props.onCloseModal === 'function') {
            this.props.onCloseModal();
        }
    }

    getDate(date = this.props && this.props.date) {
        const {minDate, maxDate, mode} = this.props;

        // date默认值
        if (!date) {
            const now = new Date();
            if (minDate) {
                const _minDate = this.getDate(minDate);

                if (now < _minDate) {
                    return _minDate;
                }
            }

            if (maxDate) {
                const _maxDate = this.getDate(maxDate);

                if (now > _maxDate) {
                    return _maxDate;
                }
            }

            return now;
        }

        if (date instanceof Date) {
            return date;
        }

        return moment(date, mode).toDate();
    }

    getDateStr(date = this.props.date) {
        const {mode, format = FORMATS[mode]} = this.props;

        if (!date instanceof Date) {
            date = this.getDate(date);
        }
        const str = moment(date).format(format);
        return str;
    }

    datePicked() {
        if (typeof this.props.onDateChange === 'function') {
            const dateStr = this.getDateStr(this.state.date);
            this.props.onDateChange(dateStr, this.state.date);
            console.log('date', dateStr)
            this.setState({
                text: dateStr,
            })
        }
    }

    getTitleElement() {
        const {date, placeholder} = this.props;

        if (!date && placeholder) {
            return (<Text style={[Style.placeholderText,]}>{placeholder}</Text>);
        }
        return (<Text style={[Style.dateText,]}>{this.getDateStr()}</Text>);
    }

    onDateChange(date) {
        this.setState({
            allowPointerEvents: true,
            date: date,
        });
        const timeoutId = setTimeout(() => {
            this.setState({
                allowPointerEvents: true
            });
            clearTimeout(timeoutId)
        }, 200);
    }

    onDatePicked({action, year, month, day}) {
        if (action !== DatePickerAndroid.dismissedAction) {
            this.setState({
                date: new Date(year, month, day)
            });
            this.datePicked();
        } else {
            this.onPressCancel();
        }
    }

    onTimePicked({action, hour, minute}) {
        if (action !== DatePickerAndroid.dismissedAction) {
            this.setState({
                date: moment().hour(hour).minute(minute).toDate()
            });
            this.datePicked();
        } else {
            this.onPressCancel();
        }
    }

    onDatetimePicked({action, year, month, day}) {
        let {mode, androidMode} = this.props;

        if (action !== DatePickerAndroid.dismissedAction) {
            const timeMoment = moment(this.state.date);

            const format = FORMATS[mode];
            const is24Hour = !format.match(/h|a/);
            TimePickerAndroid.open({
                hour: timeMoment.hour(),
                minute: timeMoment.minutes(),
                is24Hour: is24Hour,
                mode: androidMode
            }).then(this.onDatetimeTimePicked.bind(this, year, month, day));
        } else {
            this.onPressCancel();
        }
    }

    onDatetimeTimePicked(year, month, day, {action, hour, minute}) {
        if (action !== DatePickerAndroid.dismissedAction) {
            this.setState({
                date: new Date(year, month, day, hour, minute)
            });
            this.datePicked();
        } else {
            this.onPressCancel();
        }
    }

    onPressDate() {
        if (this.props.disabled) {
            return true;
        }

        Keyboard.dismiss();

        // reset state
        this.setState({
            date: this.getDate()
        });

        if (Platform.OS === 'ios') {
            this.setModalVisible(true);
        } else {
            const {mode, androidMode, minDate, maxDate} = this.props;

            const format = FORMATS[mode];
            const is24Hour = !format.match(/h|a/);
            // 选日期
            if (mode === 'date') {
                this.openDatePickerAndroid(minDate, maxDate, androidMode);
            } else if (mode === 'time') {
                // 选时间
                this.openTimePickerAndroid(is24Hour);
            } else if (mode === 'datetime') {
                // 选日期和时间
                this.openDateTimePickerAndroid(minDate, maxDate, androidMode);
            }
        }

        if (typeof this.props.onOpenModal === 'function') {
            this.props.onOpenModal();
        }
    }

    openDatePickerAndroid(minDate, maxDate, androidMode){
        DatePickerAndroid.open({
            date: this.state.date,
            minDate: minDate && this.getDate(minDate),
            maxDate: maxDate && this.getDate(maxDate),
            mode: androidMode
        }).then(this.onDatePicked);
    }

    openTimePickerAndroid(is24Hour){
        const timeMoment = moment(this.state.date);

        TimePickerAndroid.open({
            hour: timeMoment.hour(),
            minute: timeMoment.minutes(),
            is24Hour: is24Hour
        }).then(this.onTimePicked);
    }

    openDateTimePickerAndroid(minDate, maxDate, androidMode){
        DatePickerAndroid.open({
            date: this.state.date,
            minDate: minDate && this.getDate(minDate),
            maxDate: maxDate && this.getDate(maxDate),
            mode: androidMode
        }).then(this.onDatetimePicked);
    }

    render() {
        const {
            minuteInterval,
            testID,
            cancelBtnTestID,
            confirmBtnTestID
        } = this.props;

        const paddingVertical = {
            marginTop: this.props.paddingVertical,
            marginBottom: this.props.paddingVertical,
        };

        // console.log('this.props.text', this.props.text)
        return (
            <TouchableOpacity
                {...this.props}
                // underlayColor={gColors.divider}
                onPress={this.onPressDate}
                style={[this.props.style]}
            >
                
                    <View
                        style={[{flexDirection: 'row', }]}>
                        {/*tip*/}
                        {
                            this.props.showTip
                                ?
                                <View style={[paddingVertical,
                                    {flexDirection: 'row', marginRight: gSizes.space_border,alignItems:'center'},
                                    this.props.tipWidth?{width: this.props.tipWidth}:null
                                    ]}>
                                    {
                                        this.props.tipImage
                                            ? <Image style={{width: 20, height: 20,marginRight:gSizes.space_border}}
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
                        {/* <View style={[paddingVertical,
                            {flex:1, flexDirection: 'row', justifyContent: this.props.textJustifyContent}]}> */}

                            {
                                this.props.text && this.props.text.trim().length > 0 ?
                                    <Text
                                        // style={{fontSize: this.props.textFontSize, color: this.props.textColor}}
                                        // numberOfLines={this.props.textNumberOfLines}
                                    >
                                        {this.props.text}
                                    </Text>
                                    :
                                    <Text
                                        style={{fontSize: this.props.textFontSize, color: gColors.text_gray6}}>
                                        {this.props.textHint}
                                    </Text>
                            }

                            {this.renderModal()}
                        {/* </View> */}

                        {/*arrow*/}
                        {
                            this.props.showArrow
                                ? <ArrowRight style={[paddingVertical]}/>
                                : null
                        }
                    </View>
            </TouchableOpacity>
        );
    }

    renderModal(){
        if(Platform.OS === 'ios'){
            return (<Modal
                transparent={true}
                animationType="none"
                visible={this.state.modalVisible}
                supportedOrientations={SUPPORTED_ORIENTATIONS}
                onRequestClose={this.setModalVisible.bind(this, false)}
            >
                <View
                    style={{flex: 1}}
                >
                    <TouchableOpacity
                        style={Style.datePickerMask}
                        activeOpacity={1}
                        underlayColor={'#00000077'}
                        onPress={this.onPressMask}
                    >
                        <TouchableOpacity
                            underlayColor={'#fff'}
                            style={{flex: 1}}
                        >
                            <Animated.View
                                style={[Style.datePickerCon, {height: this.state.animatedHeight},]}
                            >
                                <View pointerEvents={this.state.allowPointerEvents ? 'auto' : 'none'}>
                                    <DatePickerIOS
                                        date={this.state.date}
                                        mode={this.props.mode}
                                        minimumDate={this.props.minDate}
                                        maximumDate={this.props.maxDate}
                                        onDateChange={this.onDateChange}
                                        minuteInterval={this.props.minuteInterval}
                                        timeZoneOffsetInMinutes={8*60}
                                        style={[Style.datePicker, ]}
                                    />
                                </View>
                                <TouchableOpacity
                                    underlayColor={'transparent'}
                                    onPress={this.onPressCancel}
                                    style={[Style.btnText, Style.btnCancel,]}
                                    testID={this.props.cancelBtnTestID}
                                >
                                    <Text
                                        style={[Style.btnTextText, Style.btnTextCancel, ]}
                                    >
                                        {this.props.cancelBtnText}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    underlayColor={'transparent'}
                                    onPress={this.onPressConfirm}
                                    style={[Style.btnText, Style.btnConfirm,]}
                                    testID={this.props.confirmBtnTestID}
                                >
                                    <Text style={[Style.btnTextText,]}>{this.props.confirmBtnText}</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </Modal>
            );
        }
    }
}


const Style = StyleSheet.create({

    dateTouch: {
        width: 142
    },
    dateTouchBody: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dateIcon: {
        width: 32,
        height: 32,
        marginLeft: 5,
        marginRight: 5
    },
    dateInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#aaa',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dateText: {
        color: '#333'
    },
    placeholderText: {
        color: '#c9c9c9'
    },
    datePickerMask: {
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
        backgroundColor: '#00000077'
    },
    datePickerCon: {
        backgroundColor: '#fff',
        height: 0,
        overflow: 'hidden'
    },
    btnText: {
        position: 'absolute',
        top: 0,
        height: 42,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnTextText: {
        fontSize: 16,
        color: '#46cf98'
    },
    btnTextCancel: {
        color: '#666'
    },
    btnCancel: {
        left: 0
    },
    btnConfirm: {
        right: 0
    },
    datePicker: {
        marginTop: 42,
        borderTopColor: '#ccc',
        borderTopWidth: 1
    },
    disabled: {
        backgroundColor: '#eee'
    }
});