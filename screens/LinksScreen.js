import React, { Component } from 'react';
import {
    ScrollView, StyleSheet, FlatList, Text, View, Dimensions
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

// let serverReply_2 = {'breakdown': [{'footprint': 6.1236, 'source': 'grains'},
//                {'footprint': 3.05, 'source': 'fish'},
//                {'footprint': 1.37214, 'source': 'red meat'},
//                {'footprint': 1.51, 'source': 'vegetables'}],
//  'itemized': [{'footprint': 0.51, 'goodness': 0.95, 'name': 'broccoli'},
//               {'footprint': 3.05,
//                'goodness': 0.8474999999999999,
//                'name': 'tuna'},
//               {'footprint': 1.37214, 'goodness': 0.6975, 'name': 'pork'},
//               {'footprint': 1.0, 'goodness': 0.95, 'name': 'cabbage'},
//               {'footprint': 6.1236,
//                'goodness': 0.9324999999999999,
//                'name': 'rice'}],
//  'total_carbon_footprint': 12.05574}

// let serverReply_3 = {'breakdown': [{'footprint': 3.3600000000000003, 'source': 'vegetables'},
//                {'footprint': 7.22, 'source': 'diary'},
//                {'footprint': 4.11642, 'source': 'red meat'}],
//  'itemized': [{'footprint': 4.11642, 'goodness': 0.6975, 'name': 'pork'},
//               {'footprint': 1.36, 'goodness': 0.95, 'name': 'cucumber'},
//               {'footprint': 2.0, 'goodness': 0.95, 'name': 'eggplant'},
//               {'footprint': 7.22, 'goodness': 0.9525, 'name': 'milk'}],
//  'total_carbon_footprint': 14.69642}

// let serverReply_4 = {'breakdown': [{'footprint': 1.378, 'source': 'vegetables'},
//                {'footprint': 3.12984, 'source': 'poultry'}],
//  'itemized': [{'footprint': 3.12984, 'goodness': 0.8275, 'name': 'chicken'},
//               {'footprint': 0.87, 'goodness': 0.9275, 'name': 'potatoes'},
//               {'footprint': 0.288, 'goodness': 0.95, 'name': 'carrots'},
//               {'footprint': 0.22, 'goodness': 0.95, 'name': 'onion'}],
//  'total_carbon_footprint': 4.50784}


// let serverReply_fake = {
//     'breakdown': [
//         {'footprint': 9.2558, 'source': 'fruits'},
//         {'footprint': 8.1, 'source': 'vegetables'},
//         {'footprint': 19.2558, 'source': 'poultry'},
//         {'footprint': 15.2558, 'source': 'diary'},
//         {'footprint': 20.2558, 'source': 'red meat'},
//         {'footprint': 9.2558, 'source': 'fish'},
//         {'footprint': 1, 'source': 'lentils'}
//     ],
//     'itemized': [
//         {
//             'footprint': 0.4862,
//             'goodness': 0.9724999999999999,
//             'name': 'BANANA CAVENDISH'
//         },
//         {
//             'footprint': 3.8512,
//             'goodness': 0.9275,
//             'name': 'POTATOES BRUSHED'
//         },
//         {'footprint': 1.616, 'goodness': 0.95, 'name': 'BROCCOLI'},
//         {
//             'footprint': 1.2914,
//             'goodness': 0.9724999999999999,
//             'name': 'GRAPES GREEN'
//         },
//         {'footprint': 0.436, 'goodness': 0.95, 'name': 'PEAS SNOW'},
//         {
//             'footprint': 0.49500000000000005,
//             'goodness': 0.9724999999999999,
//             'name': 'TOMATOES GRAPE'
//         },
//         {'footprint': 1.08, 'goodness': 0.95, 'name': 'LETTUCE ICEBERG'}
//     ],
//     'total_carbon_footprint': 9.2558,
//     'goodness': 0.5
// }

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function LinksScreen(props) {
  const { navigate } = props.navigation;
  let serverReply = props.navigation.getParam('data', ''); 
  if(serverReply == ''){
    serverReply = serverReply_1
  }else{
    serverReply = JSON.parse(serverReply)
  }

    return (
        <ScrollView>
        <View style={styles.Container}>
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

});
