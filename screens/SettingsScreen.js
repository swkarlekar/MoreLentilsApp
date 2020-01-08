import React, { Component } from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert, 
    Dimensions,
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';


import CarbonBreakdownPieChart from '../components/CarbonBreakdownPieChart'
import FootprintProgressChart from '../components/FootprintProgressChart'

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

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

let ids = [
    '995d4fa9-09d8-46fc-bfdb-e1a16925a47b',
    'cc2e3485-2e5a-4eb7-8ddd-1fef785577f7',
    '3a98992b-bc48-49f8-9bb7-55ae0b4777c2',
    'c1a7f2a3-4e7b-4e23-bc4b-af53de6399ba',
    '3a98992b-bc48-49f8-9bb7-55ae0b4777c3',
    'c1a7f2a3-4e7b-4e23-bc4b-af53de6399bb',
];

let mockTripSummary = [
        {'footprint': 9.2558, 'source': 'fruits'},
        {'footprint': 8.1, 'source': 'vegetables'},
        {'footprint': 19.2558, 'source': 'poultry'},
        {'footprint': 15.2558, 'source': 'diary'},
        {'footprint': 20.2558, 'source': 'red meat'},
        {'footprint': 9.2558, 'source': 'fish'},
        {'footprint': 1, 'source': 'lentils'}
    ];

let curIdIter = 0;

let lastMonthCarbonFootprints = [
    {'total': 4.5078, 'date': 7},
    {'total': 24.399, 'date': 13},
    {'total': 12.055, 'date': 20},
    {'total': 14.696, 'date': 27},
]

let thisMonthCarbonFootprints = [
    {'total': 12.05574, 'date': 1},
    {'total': 14.69642, 'date': 9},
]

export default class SettingsScreen extends Component {
    render() {
        return (
            <ScrollView style={styles.Container}>
            <FootprintProgressChart
                lastMonthCarbonFootprints={lastMonthCarbonFootprints}
                thisMonthCarbonFootprints={thisMonthCarbonFootprints}
            />
            <Text>CO2 Footprint Breakdown (2020/01/02):</Text>
            <CarbonBreakdownPieChart
                    breakdown={mockTripSummary}
                    width={screenWidth}
                    height={0.3 * screenHeight}
                    backgroundColor="transparent"
                />
            <Text>Itemized Receipt:</Text>
            </ScrollView>
        );
    }
}

SettingsScreen.navigationOptions = {
    title: 'Progress',
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        paddingTop: 15,
        paddingLeft : 0.05 * screenWidth,
        paddingRight: 0.05 * screenWidth,
    },
});
