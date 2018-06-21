/**
 * Created by Jason on 2017/8/2.
 */

import React, {Component} from 'react'
import {
    Animated,
    StyleSheet,
    View,
    Text,
} from 'react-native'

import {
    gStyles,
    gSizes,
    gColors,
} from './GlobalData';


export default class JudgeUtils{

    /**
     * 判断第一个时间是否比后一个时间早
     * params time01 ,time02
     * return bool
     */

    static firstTimeEarler(time01,time02){
        if (!time01 && !time02) return null;

        let firstTime,secondTime ;
        if (typeof time01 === 'string'){
            firstTime = new Date(time01.replace(/\-/g, '/'));
        }else if (time01 instanceof Date){
            firstTime = time01;
        }else {
            return null;
        }

        if (typeof time02 === 'string'){
            secondTime = new Date(time02.replace(/\-/g, '/'));
        }else if (time02 instanceof Date){
            secondTime = time02;
        }else {
            return null;
        }
        return firstTime < secondTime;
    }

    /**
     * 时间格式转换
     */
    static changeTimeValue(time){
        if (!time) return;
        return time.replace(/\//g, '-')
    }

    /**
     * 判断计划/记录的状态
     *  计划 0-过期计划 1-开始时间在本周~今天 有效计划 （编辑删除完成) 2-开始时间在今天之后 有效计划 （编辑删除）
     *  记录 0-只可查看 1-可编辑可查看 2-不存在
     * params startTime
     * return string
     */
    static judgePlanState(startTime){
        let time ;
        if (typeof startTime === 'string'){
            time = new Date(startTime.replace(/\-/g, '/'));
        }else if (startTime instanceof Date){
            time = startTime;
        }else {
            return null;
        }
        let today = this.getDate(0);
        let thisMonday = this.getDate(-today.getDay());

        // 开始时间在本周之前 过期计划
        if (time - thisMonday < 0) {
            return 0;
        } else {
            // 开始时间在本周~今天 有效计划 （编辑删除完成）
            if (time - today < 3600 * 24 * 1000) {
                if (this.firstTimeEarler(new Date(),time)){
                    return 2;
                }
                return 1;
            } else {
                // 开始时间在今天之后 有效计划 （编辑删除）
                return 2;
            }
        }
    }

    /**
     * 获取今天前后N天的时间
     * return Date(年月日)
     */
    static getDate(n) {
        let dd = new Date();
        dd.setDate(dd.getDate() + n);//获取AddDayCount天后的日期
        let y = dd.getFullYear();
        let m = (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
        let d = dd.getDate();//获取当前几号，不足10补0
        return new Date(y + "/" + m + "/" + d);
    }


    /**
     * 验证手机号格式是否正确
     * return bool
     */
    static judgePhoneNum(phone) {
        let _phone = phone.trim();
        const regExp = /^0?1[3|4|5|8|7][0-9]\d{8}$/;
        return regExp.test(_phone);
    }

    /**
     * 获取本周的第一天
     * return date
     */
    static getFirstWeekday() {
        let today = this.getDate(0);
        return this.getDate(-today.getDay());
    }


    /**
     * 判断计划时间规则
     * id
     * startTime
     * endTime
     * planBeginDay
     * planEndDay
     * IsAllDay
     * return bool
     */
    static judgePlanTime(id, startTime,endTime,planBeginDay,planEndDay,IsAllDay) {
        if (id) {
            if (JudgeUtils.firstTimeEarler(startTime,planBeginDay)) {
                console.log('开始时间必须在计划所在日');
                return false;
            }
            if (!JudgeUtils.firstTimeEarler(endTime,planEndDay)) {
                console.log('结束时间必须在计划所在日');
                return false;
            }
        } else {
            if (IsAllDay) {
                let today = JudgeUtils.getDate(0);//当天凌晨
                if (!JudgeUtils.firstTimeEarler(today, startTime)) {
                    console.log('开始时间必须大于当天零点');
                    return false;
                }
            } else {
                if (!JudgeUtils.firstTimeEarler(new Date(), startTime)) {
                    console.log('开始时间必须大于当前时间');
                    return false;
                }
            }
        }
        return true;
    }


    /**
     * 判断记录时间规则
     * id
     * startTime
     * endTime
     * planBeginDay
     * planEndDay
     * IsAllDay
     * return bool
     */

    static judgeRecordTime(id, startTime,endTime,planBeginDay,planEndDay,IsAllDay){
        let nextDay = JudgeUtils.getDate(1); // 第二天凌晨
        let getFirstWeekday = JudgeUtils.getFirstWeekday();

        if (id) {
            if (IsAllDay && !JudgeUtils.firstTimeEarler(endTime, nextDay)) {
                console.log('结束时间必须小于当天23:59分');
                return false;
            }
            if (JudgeUtils.firstTimeEarler(startTime,planBeginDay)) {
                console.log('开始时间必须在记录所在日');
                return false;
            }
            if (!JudgeUtils.firstTimeEarler(endTime,planEndDay)) {
                console.log('结束时间必须在记录所在日');
                return false;
            }
        } else {
            if (JudgeUtils.firstTimeEarler(startTime, getFirstWeekday)) {
                console.log('开始时间不能在本周之前');
                return false;
            }
            if (IsAllDay) {
                if (!JudgeUtils.firstTimeEarler(endTime, nextDay)) {
                    console.log('结束时间必须小于当天23:59分');
                    return false;
                }
            } else {
                if (!JudgeUtils.firstTimeEarler(endTime, new Date())) {
                    console.log('结束时间必须小于当前时间');
                    return false;
                }
            }
        }
        return true;
    }

}