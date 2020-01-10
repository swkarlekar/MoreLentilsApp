import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';

export default function IconsForButtons(props) {

	const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    console.log("horizontal padding", screenWidth*props.alignHorizontal)

  return (
      <TouchableOpacity
          style={{ 
              position: 'absolute',
              top:  props.alignVertical * screenHeight,
              left: props.alignHorizontal * screenWidth,
              width: props.widthPercentage * screenWidth
          }}
          onPress={props.onPress}>
          <Ionicons
            name={props.name}
            size={props.widthPercentage * screenWidth}
            color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
      </TouchableOpacity>
  );
}
