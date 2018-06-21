import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    DeviceEventEmitter,
    Image,
} from 'react-native';
import {TabNavigator} from 'react-navigation';
import sources from "../../../images/_sources";
import ShouYe from '../shouYe/ShouYe';
import TaskPublish from '../taskPublish/TaskPublish';
import My from '../my/My';
import AddressBook from '../addressBook/AddressBook'
import { gColors } from '../../utils/GlobalData';
function Label({name, focused}) {
    return (<Text style={{textAlign: 'center', fontSize: 12, color: focused ? '#ff7f00' : '#ccc'}}>
        {name}
    </Text>)
}
export default TabNavigator({
        ShouYe: {
            screen: ShouYe,
            navigationOptions: {
                tabBarLabel: props => (<Label name='首页' {...props} />),
                tabBarIcon: ({tintColor, focused}) => (
                        <Image source={focused ? sources.home_active : sources.home} resizeMode='contain' style={{width: 25, height: 25}}/> 
                )
            }
        },
        TaskPublish: {
            screen: TaskPublish,
            navigationOptions: {
                tabBarLabel: props => (<Label name='任务派遣' {...props} />),
                tabBarIcon: ({tintColor, focused}) => (
                        <Image source={focused ? sources.renwu_active : sources.renwu} resizeMode='contain' style={{width: 25, height: 25}}/>
                )
            }
        },
        // AddressBook: {
        //     screen: AddressBook,
        //     navigationOptions: {
        //         tabBarLabel: props => (<Label name='通讯录' {...props} />),
        //         tabBarIcon: ({tintColor, focused}) => (
        //                 <Image source={focused ? sources.addressBook_active : sources.addressBook} resizeMode='contain' style={{width: 25, height: 25}}/>
        //         )
        //     }
        // },
        My: {
            screen: My,
            navigationOptions: {
                tabBarLabel: props => (<Label name='我的' {...props} />),
                tabBarIcon: ({tintColor, focused,}) => (
                        <Image source={focused ? sources.my_active : sources.my} resizeMode='contain' style={{width: 25, height: 25}}/>
                )
            }
        },
    },
    {
        tabBarPosition: 'bottom',
        lazy: true,
        initialRouteName: 'ShouYe',
        animationEnabled: false,
        swipeEnabled: true,
        tabBarOptions: {
            showIcon: true,
            pressOpacity: 0.8,
            style: {
                height: 60,
                backgroundColor: '#ffffff',
                zIndex: 0,
                position: 'relative',
                borderTopColor: gColors.divider,
                borderTopWidth: 0.5,
            }, iconStyle: {
                width: 100,
                height: 35,
            },
            tabStyle: {
                backgroundColor: '#fff',
                padding: 8
            },
            indicatorStyle: {backgroundColor: 'transparent',}
        },
        // navigationOptions: ({ navigation}) => ({
        //     tabBarIcon: ({focused, tintColor}) => {
        //         const { routeName } = navigation.state;
        //         let source;
        //         if (routeName === 'ShouYe') {
        //             source = focused ? sources.tab_home_selecte : sources.tab_home_unselected;
        //         } else if (routeName === 'TaskPublish') {
        //             source = focused ? sources.tab_02_selected : sources.tab_02_unselected;
        //         } else if (routeName === 'My') {
        //             source = focused ? sources.tab_my_selected : sources.tab_my_unselected;
        //         }
        //         return <Image source={source} style={{height: 25, width: 25}} />
        //     },
        // })
    })
