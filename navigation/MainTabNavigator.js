import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import BottomTabBar from "react-navigation-selective-tab-bar";


import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TrophiesScreen from '../screens/TrophiesScreen';


const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Snap',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={ 
        Platform.OS === 'ios'
          ? `ios-camera`
           : 'md-camera'
      }
    />
  ),
};

HomeStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Progress',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-stats' : 'md-analytics'} />
  ),
};

SettingsStack.path = '';

const TrophiesStack = createStackNavigator(
  {
    Trophies: TrophiesScreen,
  },
  config
);

TrophiesStack.navigationOptions = {
  tabBarLabel: 'Trophies',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-trophy' : 'md-trophy'} />
  ),
};

TrophiesStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  SettingsStack,
  TrophiesStack
  });

tabNavigator.path = '';

export default tabNavigator;
