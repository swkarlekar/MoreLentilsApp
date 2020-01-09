import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
    Dimensions
} from 'react-native';
import Colors from '../constants/Colors';

export default function IconsForButtons(props) {

	const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  console.log("horizontal padding", screenWidth*props.alignHorizontal)

  return (
    <Ionicons
      name={props.name}
      size={60}
      style={{ 
        marginLeft: screenWidth * props.alignHorizontal,
        marginTop: screenHeight * props.alignVertical,
      }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
