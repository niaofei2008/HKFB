/**
 * Created by Mavio on 2017/5/23.
 */


import React, {Component} from 'react'
import {
    Animated,
    StyleSheet,
    Text,
    View,
    PixelRatio,
    Dimensions,
    Platform,
    AsyncStorage,
} from 'react-native'

const IOS = Platform.OS === 'ios';

const min_size = 1/PixelRatio.get();

const gSizes = {
    min_size: min_size,

    //单行输入框高度
    singleLineInput: 40,

    //按钮圆角
    btnRadius: 3,

    //卡片圆角
    picRadius: 5,

    screen_width: Dimensions.get('window').width,
    screen_height: Dimensions.get('window').height,

    //图标-单行文本的高度
    height_single_line: 48,
    //大图标-双行文本的高度
    height_double_line: 56,

    //导航栏高度
    height_title: IOS ? 44 : 44,
    //状态栏高度
    height_title_status_bar : IOS ? 20 : 0,
    //分割线高度
    size_divider: min_size,

    //导航栏和状态栏的高度
    height_navi: IOS ? 64 : 56,

    //头像宽高
    ic_head: 45,

    //控件内容距屏幕边距
    space_screen: 16,
    //控件之间的间距
    space_border: 8,
    space_border_half: 4,

    //当行文本cell高度
    singleTextHeight: 44,

    text_tiny: IOS ? 12 : 10,
    text_small: IOS ? 14 : 12,
    text_normal: IOS ? 16 : 14,
    text_large: IOS ? 18 : 16,
    text_subtitle: 16,
    text_title: 18,

    //小尺寸头像宽高
    width_header_small: 45,
    //一般尺寸头像宽高
    width_header_normal: 72,

    //LineInfoView的tipWidth
    width_line_info_tip: 105,

    //一般圆角半径
    corner_normal: 3,
    //大圆角半径
    corner_large: 6,
};

const gColors = {
    //应用主色
    primary: 'orange',
    primaryNavi: 'rgb(230,77,57)',
    primary_dark: '#303F9F',
    primary_disable: '#8899A6',
    primary_trans: '#3E8ECD33',

    index_yellow: '#fec84c',

    page_normal: '#FFFFFF',
    page_gray: '#E8E8E8',
    page_gray_dark: '#C8C8C8',

    divider: '#BDBDBD',
    trans: '#00000000',
    trans_black: 'rgba(0, 0, 0, 0.3)',
    bg_modal_content: '#494E4F',

    text_normal: '#000000',
    text_gray3: '#333333',
    text_gray6: '#666666',
    text_gray9: '#999999',
    text_grayb: '#BBBBBB',
    text_white: '#FFFFFF',
    text_title: '#FFFFFF',
    text_warning: '#FF3333',
    text_yellow: '#FFC74C',
    text_green: '#259B24',

    project_check1: '#FFC74C',
    project_check2: '#1ec695',
};

const gStyles = StyleSheet.create({
    /**
     * 横向margin间距
     */
    margin_horizontal: {
        marginLeft: gSizes.space_screen,
        marginRight: gSizes.space_screen,
    },

    /**
     * 纵向margin间距
     */
    margin_vertical: {
        marginTop: gSizes.space_border,
        marginBottom: gSizes.space_border,
    },

    /**
     * 普通margin间距
     */
    margin_normal: {
        marginTop: gSizes.space_border,
        marginBottom: gSizes.space_border,
        marginLeft: gSizes.space_screen,
        marginRight: gSizes.space_screen,
    },

    /**
     * 普通padding间距
     */
    padding_normal: {
        paddingTop: gSizes.space_border,
        paddingBottom: gSizes.space_border,
        paddingLeft: gSizes.space_screen,
        paddingRight: gSizes.space_screen,
    },

    /**
     * 横向padding间距
     */
    padding_horizontal: {
        paddingLeft: gSizes.space_screen,
        paddingRight: gSizes.space_screen,
    },

    /**
     * 纵向padding间距
     */
    padding_vertical: {
        paddingTop: gSizes.space_border,
        paddingBottom: gSizes.space_border,
    },

    child_center: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    /**
     * 超小文字，特殊情况使用
     */
    text_tiny: {
        backgroundColor: 'transparent',
        color: gColors.text_gray6,
        fontSize: gSizes.text_tiny,
    },

    /**
     * 小号文字，用于对一般内容的说明
     */
    text_small: {
        backgroundColor: 'transparent',
        color: gColors.text_gray6,
        fontSize: gSizes.text_small,
    },

    /**
     * 普通文字设置，用于显示一般内容
     */
    text_normal: {
        backgroundColor: 'transparent',
        color: gColors.text_normal,
        fontSize: gSizes.text_normal,
    },

    /**
     * 大号文字，用于显示一般内容的小标题
     */
    text_large: {
        backgroundColor: 'transparent',
        color: gColors.text_normal,
        fontSize: gSizes.text_large,
    },

    /**
     * 副标题，用于显示标题栏的副标题文字
     */
    text_subtitle: {
        backgroundColor: 'transparent',
        color: gColors.text_title,
        fontSize: gSizes.text_subtitle,
    },

    /**
     * 标题，用于显示标题栏的主要文字
     */
    text_title: {
        backgroundColor: 'transparent',
        color: gColors.text_title,
        fontSize: gSizes.text_title,
    },
    title: {
        fontSize: gSizes.text_title,
        color: gColors.text_title,
        textAlign: 'center',
    },

    divider_top: {
        borderTopWidth: gSizes.size_divider,
        borderTopColor: gColors.divider,
    },

    divider_bottom: {
        borderBottomWidth: gSizes.size_divider,
        borderBottomColor: gColors.divider,
    },

    divider_left: {
        borderLeftWidth: gSizes.size_divider,
        borderLeftColor: gColors.divider,
    },

    divider_right: {
        borderRightWidth: gSizes.size_divider,
        borderRightColor: gColors.divider,
    },

    bg_rectf_gray: {
        backgroundColor: gColors.page_gray_dark,
        borderRadius: gSizes.corner_normal,
        borderWidth: min_size,
    },

    ic_head: {
        width: 80,
        height: 80,
        borderRadius: IOS ? 40 : 100,
    },

});

const gRegulars = {
    password: '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$',
};

const gStrings = {
    app_name: '思创销售管理平台',
    app_version: '1.2.3',
    app_website: 'www.strongit.com.cn',
};

exports.gSizes = gSizes;
exports.gColors = gColors;
exports.gStyles = gStyles;
exports.gRegulars = gRegulars;
exports.gStrings = gStrings;
exports.IOS = IOS;

exports.DEBUG = true;