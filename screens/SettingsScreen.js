import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';


import CarbonBreakdownPieChart from '../components/CarbonBreakdownPieChart'
import FootprintProgressChart from '../components/FootprintProgressChart'
import ItemizedCarbonReceipt from '../components/ItemizedCarbonReceipt'

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

let curIdIter = 3;

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

let mockItemizedReceipt = [{'footprint': 0.87, 'goodness': 0.9275, 'name': 'potatoes'},
              {'footprint': 12.2472, 'goodness': 0.325, 'name': 'beef'},
              {'footprint': 1.0, 'goodness': 0.95, 'name': 'tofu'},
              {'footprint': 3.0618, 'goodness': 0.325, 'name': 'ground beef'},
              {'footprint': 7.22, 'goodness': 0.9525, 'name': 'milk'}]

const server_addr = "http://4307a77d.ngrok.io";

export default class SettingsScreen extends Component {
    state = {
        'tripSummary': mockTripSummary,
        'year': 2020,
        'month': 1,
        'day': 3,
        'itemized': mockItemizedReceipt
    }

    updateToTripId = async (tripId) => {
        const response = await fetch(server_addr + "/query_trip/",
            {
                method: 'POST',
                mode: 'cors',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    trip_id: tripId,
                })
            });

        let summary = await response.json()

        this.state.tripSummary = summary.breakdown;
        this.state.year = summary.year;
        this.state.month = summary.month;
        this.state.day = summary.date;
        this.state.itemized = summary.itemized;

        console.log(this.state);

        this.setState(this.state);

    }

    showBreakdownFromLastTrip = async () => {
        if (curIdIter != 0) {
            curIdIter -= 1;
        }

        console.log(curIdIter);

        await this.updateToTripId(ids[curIdIter]);
    }

    showBreakdownFromNextTrip = async () => {
        if (curIdIter != ids.length - 1) {
            curIdIter += 1;
        }

        console.log(curIdIter);

        await this.updateToTripId(ids[curIdIter]);
    }


    render() {
        return (
            <ScrollView style={styles.Container}>
            <FootprintProgressChart
                lastMonthCarbonFootprints={lastMonthCarbonFootprints}
                thisMonthCarbonFootprints={thisMonthCarbonFootprints}
            />
            <View style={{flex: 1, flexDirection:'row'}}>
                <View style={{flex: 1}}>
                    <TouchableOpacity onPress={this.showBreakdownFromLastTrip}>
                    <Text> 	⟨ </Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 18}}>
                    <Text>
                    CO2 Footprint Breakdown
                    ({this.state.year + "/" + this.state.month + "/" + this.state.day}):
                    </Text>
                    <CarbonBreakdownPieChart
                            breakdown={this.state.tripSummary}
                            width={screenWidth}
                            height={0.3 * screenHeight}
                            backgroundColor="transparent"
                            paddingLeft={0}
                        />
                    <Text>Itemized Receipt:</Text>
                    <ItemizedCarbonReceipt
                        itemized={this.state.itemized}
                        fontSize={16}
                        lineHeight={16}
                    />
                </View>
                <View style={{flex:1}}>
                    <TouchableOpacity onPress={this.showBreakdownFromNextTrip}>
                    <Text> ⟩ </Text>
                    </TouchableOpacity>
                </View>
            </View>
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
