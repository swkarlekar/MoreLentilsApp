import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
    Dimensions
} from 'react-native';
import Colors from '../constants/Colors';

export default function SummaryToProgressIcon(props) {

	const screenWidth = Dimensions.get("window").width;

	const pad_horizontal = (props.align === 'right' ? .75 : 0)

  return (
    <Ionicons
      name={props.name}
      size={60}
      style={{ 
      	paddingHorizontal: screenWidth * pad_horizontal}}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
