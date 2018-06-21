import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import Login from '../login/Login';
import HomePage from './HomePage';
import Launch from '../launch/Launch';
import NoticeInfomation from '../shouYe/noticeInformation/NoticeInfomation'
import storage from '../../asyncStorage/RNAsyncStorage';
import '../../../appProperty';
import SecurityChatroom from '../shouYe/securityChatroom/SecurityChatroom'
import CreateChatroom from '../shouYe/securityChatroom/CreateChatroom'
import TaskList from '../shouYe/taskList/TaskList'
import PoliceCondition from '../shouYe/policeCondition/PoliceCondition'
import PoliceStatus from '../shouYe/policeCondition/PoliceStatus'
import Sign from '../shouYe/sign/Sign'
import ChatroomDetail from '../shouYe/securityChatroom/ChatroomDetail'
import TaskListDetail from '../shouYe/taskList/TaskDetail'
import SelectTime from '../shouYe/taskList/SelectTime'
import AddressBook from '../addressBook/AddressBook'
import SignHistory from '../my/SignHistory'
import ChangePhone from '../my/ChangePhone'
import ChangePhoneNumber from '../my/ChangePhoneNumber'
import ChangePassword from '../my/ChangePassword'
import PoliceShowPage from '../shouYe/policeCondition/PoliceShowPage'
import Help from '../shouYe/help/Help'
import TaskPublishAgain from '../shouYe/taskList/TaskPublishAgain'
import Suggestion from '../my/Suggestion'
import DiscussionSetting from '../shouYe/securityChatroom/DiscussionSetting'

export default (
    StackNav = StackNavigator(
        {
            Launch: {screen: Launch},
            Login: {screen: Login},
            HomePage: {screen: HomePage},
            NoticeInfomation: {screen: NoticeInfomation},
            SecurityChatroom: {screen: SecurityChatroom},
            CreateChatroom: {screen: CreateChatroom},
            TaskList: {screen: TaskList},
            PoliceCondition: {screen: PoliceCondition},
            PoliceStatus: {screen: PoliceStatus},
            Sign: {screen: Sign},
            ChatroomDetail: {screen: ChatroomDetail},
            TaskListDetail: {screen: TaskListDetail},
            SelectTime: {screen: SelectTime},
            AddressBook: {screen: AddressBook},
            SignHistory: {screen: SignHistory},
            ChangePhone: {screen: ChangePhone},
            ChangePhoneNumber: {screen: ChangePhoneNumber},
            ChangePassword: {screen: ChangePassword},
            PoliceShowPage: {screen: PoliceShowPage},
            Help: {screen: Help},
            TaskPublishAgain: {screen: TaskPublishAgain},
            Suggestion: {screen: Suggestion},
            DiscussionSetting: {screen: DiscussionSetting},
        },
        {
            navigationOptions: {
                header: null
            }
        }
    )
)