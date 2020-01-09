import { createBrowserApp } from '@react-navigation/web';
import { createSwitchNavigator } from 'react-navigation';
import LinksScreen from '../screens/LinksScreen';

import MainTabNavigator from './MainTabNavigator';

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  });
// LinksStack.path = '';

const switchNavigator = createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  // Main: MainTabNavigator,
  Links: LinksStack, 
}
// ,
//     {
//       initialRouteName: 'Main',
//     }
    );
switchNavigator.path = '';

export default createBrowserApp(switchNavigator, { history: 'hash' });
