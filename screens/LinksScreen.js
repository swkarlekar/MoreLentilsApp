import React, { Component } from 'react';
import {
    ScrollView, StyleSheet, FlatList, Text, View, Dimensions, TouchableOpacity, TouchableHighlight 
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { NavigationScreenProps } from 'react-navigation';
import CarbonBreakdownPieChart from '../components/CarbonBreakdownPieChart'
import ItemizedCarbonReceipt from '../components/ItemizedCarbonReceipt'
import { Card, Divider, Button } from 'react-native-elements';

import { scaleTextSize } from './SettingsScreen';


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
  if(serverReply == ''){
    serverReply = serverReply_1
  }else{
    serverReply = serverReply
  }

    return (
        <View style={{
            paddingTop: 0.07 * screenHeight,
            paddingLeft: 0.05 * screenWidth,
            paddingRight: 0.05 * screenWidth
        }}>
        <Text style={styles.BoldText}>
            Carbon Footprint Breakdown:
        </Text>
        <Text style={{
            textAlign: 'center',
            fontSize: scaleTextSize(30),
            paddingTop: 0.02 * screenHeight,
            fontStyle: 'normal',
            color: '#5f5f5f'
        }}>
            {serverReply.total_carbon_footprint.toFixed(1)} kg of CO2-e
        </Text>
        <Card>
        <ScrollView>
        <View style={styles.Container}>
        
            <CarbonBreakdownPieChart
                breakdown={serverReply.breakdown}
                width={0.75 * screenWidth}
                height={0.3 * screenHeight}
                backgroundColor="transparent"
                paddingLeft={0.04 * screenWidth}
            />

        <View style={styles.ReceiptItem}>
            <View style={styles.TextSpan}>
                <Text numberOfLines={1} style={styles.BoldText}>
                    Itemized
                </Text>
            </View>
            <View style={styles.rightJustified}>
                <Text style={styles.BoldTextR}>
                    CO2-e (kg)
                </Text>
            </View>
        </View>
            <ItemizedCarbonReceipt
                rowStyling = {styles.ReceiptItem}
                itemized={serverReply.itemized}
                fontSize={scaleTextSize(16)}
                lineHeight={scaleTextSize(16)}
            />
        </View>
        </ScrollView>
        </Card>
        <View style={{
            padding: 10,
            paddingTop: 10,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center'
        }}>
            <Button
                onPress={ () => { navigate('PostLoading', {}); }}
                containerStyle={{
                    marginRight: 0.01 * screenWidth,
                    flex: 1,
                }}
                buttonStyle={{
                    padding: 20,
                    backgroundColor: '#e26c6c'
                }}
                title='Retake Photo'/>
            <Button
                onPress={ () => { navigate('Settings', {}); }}
                containerStyle={{
                    marginLeft: 0.01 * screenWidth,
                    flex: 1,
                }}
                buttonStyle={{
                    padding: 20,
                    backgroundColor: '#39DBAA'
                }}
                title='Accept'/>
        </View>

        </View>
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
        fontSize: scaleTextSize(18),
        lineHeight: scaleTextSize(18),
        color: '#5f5f5f',
    },
    BoldTextR: {
        textAlign: 'right',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: scaleTextSize(18),
        lineHeight: scaleTextSize(18),
        color: '#5f5f5f',
    },
    ReceiptItem: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#5f5f5f',
    },
    TextSpan: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        color: '#5f5f5f',
    },
    Text: {
        flex: 1,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: scaleTextSize(16),
        lineHeight: scaleTextSize(16),
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
