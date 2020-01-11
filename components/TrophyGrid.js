import React, { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
    Dimensions, 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    Modal, 
    TouchableHighlight
} from 'react-native';
import { Tooltip } from 'react-native-elements';
import Colors from '../constants/Colors';
import TrophiesMasterList from './TrophiesList.js'


function TrophyIcon({id, title, description, imageIcon, focused, icon_color, funcOnPressed, funcChangeTitle, funcChangeDescrip}) {  
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;    

  return (
    <Tooltip popover={<Text>{title}</Text>}>
        <Ionicons
          name={Platform.OS === 'ios'
              ? `ios-`+imageIcon
               : 'md-'+imageIcon}
          style={{ textAlign: 'center' }}
          size={screenWidth / 4.40}
          color={icon_color}
        />
    </Tooltip>
  );
}

export default function TrophyGrid(props) {
  const userTrophies = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, ]//props.userTrophies 
  const [showPopup, setPopup] = useState(false);
  const [showTitle, setTitle] = useState(""); 
  const [showDescrip, setDescrip] = useState("");

  const mySetPopup = (bool) => { console.log("hello im on this popup"); setPopup(bool); }
  const mySetTitle = (str) => { console.log(""); setTitle(str);}
  const mySetDescrip = (str) => { console.log(""); setDescrip(str);}
  let data = []
  userTrophies.forEach(function(item, index, array) {
    data.push(TrophiesMasterList[item])
  })

  return (
    <View>
     <FlatList
        data={data}
        renderItem={({ item }) => (
         <View style={{ flex: 1, flexDirection: 'row', margin: 9, justifyContent:'center'}}>
          <TrophyIcon
            id={item.id}
            title={item.trophy_data.Title}
            description={item.trophy_data.Description}
            imageIcon={item.trophy_data.ImageIcon}
            focused={props.focused}
            icon_color={item.trophy_data.Color}
            funcOnPressed={mySetPopup}
            funcChangeTitle={mySetTitle}
            funcChangeDescrip={mySetDescrip}
          />
          </View>
        )}
        horizontal={false}
        numColumns={4}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
