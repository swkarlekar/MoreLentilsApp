import React from 'react';
import {
    createAppContainer,
    createSwitchNavigator,
    SwitchNavigator
} from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoadingScreen from '../screens/LoadingScreen';
import { createStackNavigator } from 'react-navigation-stack';

export default createAppContainer(
    createSwitchNavigator({
        Main: MainTabNavigator,
        Links: { screen: LinksScreen },
        PostLoading: { screen: HomeScreen },
        Loading: { screen: LoadingScreen }
    },
    { initialRouteName: 'Loading' }));
