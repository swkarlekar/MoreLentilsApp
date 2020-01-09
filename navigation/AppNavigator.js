import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { createStackNavigator } from 'react-navigation-stack';

// const HomeStack = createStackNavigator(
//   {
//     Home: HomeScreen,
//   });
const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  });
// const SettingsStack = createStackNavigator(
//   {
//     Settings: SettingsScreen,
//   });
// HomeStack.path = '';
LinksStack.path = '';
// SettingsStack.path = '';

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
  Links: LinksStack, 
  // Home: HomeStack, 
  // Settings: SettingsStack
}
// ,
//     {
//       initialRouteName: 'Home',

//   }
)

);
