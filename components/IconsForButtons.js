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
      size={screenWidth / 7.}
      style={{ 
        position: 'absolute',
        left: screenWidth * props.alignHorizontal,
        top: screenHeight * props.alignVertical,
      }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
