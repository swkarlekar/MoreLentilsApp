import React, { Component } from 'react';
import {
    ScrollView, StyleSheet, FlatList, Text, View, Dimensions, TouchableOpacity, TouchableHighlight, Button
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { NavigationScreenProps } from 'react-navigation';
import CarbonBreakdownPieChart from '../components/CarbonBreakdownPieChart'
import ItemizedCarbonReceipt from '../components/ItemizedCarbonReceipt'


const toEnglishCase = (str) => {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(' '); 
};

let serverReply_1 = {'breakdown': [{'footprint': 0.87, 'source': 'vegetables'},
               {'footprint': 1.0, 'source': 'tofu'},
               {'footprint': 7.22, 'source': 'diary'},
               {'footprint': 15.309, 'source': 'red meat'}],
 'itemized': [{'footprint': 0.87, 'goodness': 0.9275, 'name': 'potatoes'},
              {'footprint': 12.2472, 'goodness': 0.325, 'name': 'beef'},
              {'footprint': 1.0, 'goodness': 0.95, 'name': 'tofu'},
              {'footprint': 3.0618, 'goodness': 0.325, 'name': 'ground beef'},
              {'footprint': 7.22, 'goodness': 0.9525, 'name': 'milk'}],
 'total_carbon_footprint': 24.399}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function LinksScreen(props) {
  const { navigate } = props.navigation;
  let serverReply = props.navigation.getParam('data', ''); 
  console.log("this is the server reply: ", serverReply)
  if(serverReply == ''){
    serverReply = serverReply_1
  }else{
    serverReply = JSON.parse(serverReply)
  }

    return (
        <ScrollView>
        <View style={styles.Container}>
            <TouchableHighlight
                onPress={ () => {
                    console.log("accepted summary"); 
                    navigate('Settings');
                }}
                style={styles.submit}>
                <Text style={styles.BoldText}>
                        Accept
                </Text>
            </TouchableHighlight>
        
            <CarbonBreakdownPieChart
                breakdown={serverReply.breakdown}
                width={0.9 * screenWidth}
                height={0.4 * screenHeight}
                backgroundColor="transparent"
                paddingLeft={0.07 * screenWidth}
            />

        <View style={styles.ReceiptItem}>
            <View style={styles.TextSpan}>
                <Text numberOfLines={1} style={styles.BoldText}>
                    Carbon Footprint (kg of CO2-e)
                </Text>
            </View>
            <View style={styles.rightJustified}>
                <Text style={styles.BoldTextR}>
                    {serverReply.total_carbon_footprint.toFixed(1)}
                </Text>
            </View>
        </View>
            <ItemizedCarbonReceipt
                rowStyling = {styles.ReceiptItem}
                itemized={serverReply.itemized}
                fontSize={18}
                lineHeight={18}
            />
        </View>
        </ScrollView>
    );
}

LinksScreen.navigationOptions = {
    title: 'Summary',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#5f5f5f',
    },
    BoldText: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 20,
        lineHeight: 20,
        color: '#5f5f5f',
    },
    BoldTextR: {
        textAlign: 'right',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 20,
        lineHeight: 20,
        color: '#5f5f5f',
    },
    Container : {
        paddingLeft: 0.05 * screenWidth,
        paddingRight: 0.05 * screenHeight,
    },
    ReceiptItem: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 0.05 * screenWidth,
        paddingRight: 0.05 * screenWidth,
        color: '#5f5f5f',
    },
    TextSpan: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        color: '#5f5f5f',
    },
    Text: {
        flex: 1,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 18,
        lineHeight: 18,
        color: '#5f5f5f',
    },
    rightJustified: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        color: '#5f5f5f',
    },
    submit:{
        marginRight:40,
        marginLeft:40,
        marginTop:10,
        paddingTop:20,
        paddingBottom:20,
        backgroundColor:'#68a0cf',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
  },
  submitText:{
      color:'#fff',
      textAlign:'center',
  }

});
