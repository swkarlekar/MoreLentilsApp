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
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';


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

let mockItemizedReceipt = [
    {'footprint': 0.87, 'goodness': 0.9275, 'name': 'potatoes'},
    {'footprint': 12.2472, 'goodness': 0.325, 'name': 'beef'},
    {'footprint': 1.0, 'goodness': 0.95, 'name': 'tofu'},
    {'footprint': 3.0618, 'goodness': 0.325, 'name': 'ground beef'},
    {'footprint': 7.22, 'goodness': 0.9525, 'name': 'milk'}
]

let mockCurMonthData = {"trips": {"3a98992b-bc48-49f8-9bb7-55ae0b4777c3": {"next_id": "c1a7f2a3-4e7b-4e23-bc4b-af53de6399bb", "day": 20, "carbon_footprint": 1.05574, "month": 12, "last_id": null, "parsed_receipt": [{"footprint": 0.51, "name": "broccoli", "goodness": 0.95}, {"footprint": 3.05, "name": "tuna", "goodness": 0.8474999999999999}, {"footprint": 1.37214, "name": "pork", "goodness": 0.6975}, {"footprint": 1.0, "name": "cabbage", "goodness": 0.95}, {"footprint": 6.1236, "name": "rice", "goodness": 0.9324999999999999}], "id": "3a98992b-bc48-49f8-9bb7-55ae0b4777c3", "breakdown_summary": [{"footprint": 1.37214, "source": "red meat"}, {"footprint": 6.1236, "source": "grains"}, {"footprint": 1.51, "source": "vegetables"}, {"footprint": 3.05, "source": "fish"}], "year": 2019}, "c1a7f2a3-4e7b-4e23-bc4b-af53de6399bb": {"next_id": null, "day": 21, "carbon_footprint": 14.69642, "month": 12, "last_id": "3a98992b-bc48-49f8-9bb7-55ae0b4777c3", "parsed_receipt": [{"footprint": 4.11642, "name": "pork", "goodness": 0.6975}, {"footprint": 1.36, "name": "cucumber", "goodness": 0.95}, {"footprint": 2.0, "name": "eggplant", "goodness": 0.95}, {"footprint": 7.22, "name": "milk", "goodness": 0.9525}], "id": "c1a7f2a3-4e7b-4e23-bc4b-af53de6399bb", "breakdown_summary": [{"footprint": 4.11642, "source": "red meat"}, {"footprint": 7.22, "source": "diary"}, {"footprint": 3.3600000000000003, "source": "vegetables"}], "year": 2019}}, "last_trip": "c1a7f2a3-4e7b-4e23-bc4b-af53de6399bb", "first_trip": "3a98992b-bc48-49f8-9bb7-55ae0b4777c3"}

let mockLastMonthData = {"trips": {"c1a7f2a3-4e7b-4e23-bc4b-af53de6399ba": {"next_id": null, "day": 27, "carbon_footprint": 14.69642, "month": 11, "last_id": "3a98992b-bc48-49f8-9bb7-55ae0b4777c2", "parsed_receipt": [{"footprint": 4.11642, "name": "pork", "goodness": 0.6975}, {"footprint": 1.36, "name": "cucumber", "goodness": 0.95}, {"footprint": 2.0, "name": "eggplant", "goodness": 0.95}, {"footprint": 7.22, "name": "milk", "goodness": 0.9525}], "id": "c1a7f2a3-4e7b-4e23-bc4b-af53de6399ba", "breakdown_summary": [{"footprint": 4.11642, "source": "red meat"}, {"footprint": 7.22, "source": "diary"}, {"footprint": 3.3600000000000003, "source": "vegetables"}], "year": 2019}, "cc2e3485-2e5a-4eb7-8ddd-1fef785577f7": {"next_id": "3a98992b-bc48-49f8-9bb7-55ae0b4777c2", "day": 13, "carbon_footprint": 24.399, "month": 11, "last_id": "995d4fa9-09d8-46fc-bfdb-e1a16925a47b", "parsed_receipt": [{"footprint": 0.87, "name": "potatoes", "goodness": 0.9275}, {"footprint": 12.2472, "name": "beef", "goodness": 0.325}, {"footprint": 1.0, "name": "tofu", "goodness": 0.95}, {"footprint": 3.0618, "name": "ground beef", "goodness": 0.325}, {"footprint": 7.22, "name": "milk", "goodness": 0.9525}], "id": "cc2e3485-2e5a-4eb7-8ddd-1fef785577f7", "breakdown_summary": [{"footprint": 15.309, "source": "red meat"}, {"footprint": 1.0, "source": "tofu"}, {"footprint": 0.87, "source": "vegetables"}, {"footprint": 7.22, "source": "diary"}], "year": 2019}, "3a98992b-bc48-49f8-9bb7-55ae0b4777c2": {"next_id": "c1a7f2a3-4e7b-4e23-bc4b-af53de6399ba", "day": 20, "carbon_footprint": 12.05574, "month": 11, "last_id": "cc2e3485-2e5a-4eb7-8ddd-1fef785577f7", "parsed_receipt": [{"footprint": 0.51, "name": "broccoli", "goodness": 0.95}, {"footprint": 3.05, "name": "tuna", "goodness": 0.8474999999999999}, {"footprint": 1.37214, "name": "pork", "goodness": 0.6975}, {"footprint": 1.0, "name": "cabbage", "goodness": 0.95}, {"footprint": 6.1236, "name": "rice", "goodness": 0.9324999999999999}], "id": "3a98992b-bc48-49f8-9bb7-55ae0b4777c2", "breakdown_summary": [{"footprint": 1.37214, "source": "red meat"}, {"footprint": 6.1236, "source": "grains"}, {"footprint": 1.51, "source": "vegetables"}, {"footprint": 3.05, "source": "fish"}], "year": 2019}, "995d4fa9-09d8-46fc-bfdb-e1a16925a47b": {"next_id": "cc2e3485-2e5a-4eb7-8ddd-1fef785577f7", "day": 7, "carbon_footprint": 4.50784, "month": 11, "last_id": null, "parsed_receipt": [{"footprint": 3.12984, "name": "chicken", "goodness": 0.8275}, {"footprint": 0.87, "name": "potatoes", "goodness": 0.9275}, {"footprint": 0.288, "name": "carrots", "goodness": 0.95}, {"footprint": 0.22, "name": "onion", "goodness": 0.95}], "id": "995d4fa9-09d8-46fc-bfdb-e1a16925a47b", "breakdown_summary": [{"footprint": 1.378, "source": "vegetables"}, {"footprint": 3.12984, "source": "poultry"}], "year": 2019}}, "last_trip": "c1a7f2a3-4e7b-4e23-bc4b-af53de6399ba", "first_trip": "995d4fa9-09d8-46fc-bfdb-e1a16925a47b"}

let mockTripId = "c1a7f2a3-4e7b-4e23-bc4b-af53de6399bb"

const server_addr = "http://d1ecb8f2.ngrok.io";

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80
};

const monthNameMapper = (m) => {
    switch (m) {
        case 1:
            return "Janurary";
            break;
        case 2:
            return "Feburary";
            break;
        case 3:
            return "March";
            break;
        case 4:
            return "April";
            break;
        case 5:
            return "May";
            break;
        case 6:
            return "June";
            break;
        case 7:
            return "July";
            break;
        case 8:
            return "August";
            break;
        case 9:
            return "September";
            break;
        case 10:
            return "October";
            break;
        case 11:
            return "November";
            break;
        case 12:
            return "December";
            break;
    }
}


export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'tripSummary': mockTripSummary,
            'year': 2019,
            'month': 12,
            'day': 3,
            'itemized': mockItemizedReceipt,
            'currentOne': -1,
            'curMonthData': mockCurMonthData,
            'lastMonthData': mockLastMonthData,
            'curTripId': mockTripId,
            'firstCall': true
        }
    }

    async componentDidMount() {  
        if (this.state.firstCall) {
            let curMonthData = await this.fetchMonthData(this.state.year,
                this.state.month);
            this.state.curMonthData = curMonthData;
            let lastMonthData = await this.fetchMonthData(this.state.year,
                this.state.month - 1);
            this.state.lastMonthData = lastMonthData;
            this.state.curTripId = curMonthData.last_trip;
            this.state.firstCall=false;
            this.setState(this.state);

            this.updateToTripId(this.state.curTripId);
        }
    }

    onSwipePerformed = (action) => {
        console.log("action ", action);
        switch (action) {
            case 'left':
                this.showBreakdownFromLastTrip();
                break;
            case 'right':
                this.showBreakdownFromNextTrip();
                break;
        }
    }

    fetchMonthData = async (year, month) => {
        const response = await fetch(server_addr + "/query_month/",
            {
                method: 'POST',
                mode: 'cors',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    username: 'DevUser',
                    year: year,
                    month: month
                })
            });

        let monthlyData = await response.json();

        return monthlyData;
    }

    getFootprintGraphData = (tripData) => {
        let trips = tripData.trips;
        let curTrip = trips[tripData.first_trip];

        let footprints = [];

        while (curTrip.next_id) {
            footprints.push({
                'total': curTrip.carbon_footprint,
                'date': curTrip.day
            })

            curTrip = trips[curTrip.next_id];
        }

        footprints.push({
            'total': curTrip.carbon_footprint,
            'date': curTrip.day
        });

        return footprints;
    }

    updateToTripId = (tripId) => {
        let summary = this.state.curMonthData.trips[tripId];

        console.log("summary", summary);

        this.state.tripSummary = summary.breakdown_summary;
        this.state.year = summary.year;
        this.state.month = summary.month;
        this.state.day = summary.day;
        this.state.itemized = summary.parsed_receipt;

        this.state.currentOne = summary.day;
        this.state.curTripId = tripId;

        this.setState(this.state);
    }

    canGoLeft = () => {
        return this.state.curMonthData.trips[this.state.curTripId].last_id != null
    }

    canGoRight = () => {
        return this.state.curMonthData.trips[this.state.curTripId].next_id != null
    }

    showBreakdownFromLastTrip = () => {
        if (this.canGoLeft()) {
            const newId = this.state.curMonthData.trips[this.state.curTripId].last_id;
            this.updateToTripId(newId);
        }
    }

    showBreakdownFromNextTrip = () => {
        if (this.canGoRight()) {
            const newId = this.state.curMonthData.trips[this.state.curTripId].next_id;
            this.updateToTripId(newId);
        }
    }

    render = () => {
        return (
            <ScrollView style={styles.Container}>
            <Text style={{
                fontSize: 18,
                fontWeight: "bold"
            }}>Cumulative Carbon Footprint - {monthNameMapper(this.state.month)}, {this.state.year}</Text>

            <FootprintProgressChart
                lastMonthCarbonFootprints={
                    this.getFootprintGraphData(this.state.lastMonthData)
                }
                thisMonthCarbonFootprints={
                    this.getFootprintGraphData(this.state.curMonthData)
                }
                currentOne={this.state.currentOne}
            />
                    <Text style={{ fontSize: 18 }}>
                    Carbon Footprint
                    ({this.state.year + "/" + this.state.month + "/" + this.state.day}): 
            {this.state.curMonthData.trips[this.state.curTripId].carbon_footprint.toFixed(1)} kg of CO2-e
                    </Text>

            <View style={{flex: 1, flexDirection:'row', paddingBottom: 0.05 * screenHeight}}>
                <View style={{flex: 1}}>
                    <TouchableOpacity
                        onPress={this.showBreakdownFromLastTrip}
                        activeOpacity={
                            this.canGoLeft() ? 0.2 : 1.0
                        }>
                    <Text style={{
                        fontSize: 30,
                        fontWeight: 'bold',
                        opacity: this.canGoLeft() ? 1.0 : 0.2,
                        paddingTop: 0.1 * screenHeight,
                    }}>⟨</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flex: 18}}>
                    <GestureRecognizer
                        onSwipeLeft={this.showBreakdownFromNextTrip}
                        onSwipeRight={this.showBreakdownFromLastTrip}
                        config={swipeConfig}>


                    <CarbonBreakdownPieChart
                            breakdown={this.state.tripSummary}
                            width={0.9 * screenWidth}
                            height={0.3 * screenHeight}
                            backgroundColor="transparent"
                            paddingLeft={0.02 * screenWidth}
                        />
                    <Text style={{
                        fontSize: 18,
                        paddingLeft: 0.05 * screenWidth,
                        paddingRight: 0.05 * screenHeight,
                    }}>Itemized Receipt:</Text>
                    <ItemizedCarbonReceipt
                        rowStyling = {styles.ReceiptItem}
                        itemized={this.state.itemized}
                        fontSize={16}
                        lineHeight={16}
                    />
                    </GestureRecognizer>

                </View>

                <View style={{flex:1}}>
                    <TouchableOpacity
                        onPress={this.showBreakdownFromNextTrip}
                        activeOpacity={
                            this.canGoRight() ? 0.2 : 1.0
                        }>
                    <Text style={{
                        fontSize: 30,
                        fontWeight: 'bold',
                        opacity: this.canGoRight() ? 1.0 : 0.2,
                        paddingTop: 0.1 * screenHeight,
                    }}>⟩</Text>

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
        paddingLeft : 0.02 * screenWidth,
        paddingRight: 0.02 * screenWidth,
    },
    ReceiptItem: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#5f5f5f',
        paddingLeft: 0.05 * screenWidth,
        paddingRight: 0.05 * screenWidth
    },

});
