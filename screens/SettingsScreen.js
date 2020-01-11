import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
} from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

import {
    server_addr,
    fetchMonthData,
    getNextMonth,
    getLastMonth
} from './LoadingScreen';

import GLOBALS from '../globals';

import CarbonBreakdownPieChart from '../components/CarbonBreakdownPieChart'
import FootprintProgressChart from '../components/FootprintProgressChart'
import ItemizedCarbonReceipt from '../components/ItemizedCarbonReceipt'

console.log("Server Addr", server_addr);

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

// FIXME magic number tested on iPhone10 and Pixel2 & OnePlus5
// TODO either test this on more phones or make 
const ios_scale = screenWidth / 380;
export const scaleTextSize = (size) => {
    const newSize = size * ios_scale 
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1.5
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) + 2
    }
}

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

        let mostRecentTripId = GLOBALS.curMonthData.last_trip;
        let mostRecentTrip = GLOBALS.curMonthData.trips[mostRecentTripId];

        this.state = {
            'curYear': (new Date().getFullYear()),
            'curMonth': (new Date().getMonth()),
            'tripSummary': mostRecentTrip.breakdown_summary,
            'year': mostRecentTrip.year,
            'month': mostRecentTrip.month,
            'day': mostRecentTrip.day,
            'itemized': mostRecentTrip.parsed_receipt,
            'currentOne': mostRecentTrip.day,
            'curMonthData': GLOBALS.curMonthData,
            'lastMonthData': GLOBALS.lastMonthData,
            'curTripId': mostRecentTripId,
        }

        let y = mostRecentTrip.year;
        let m = mostRecentTrip.month;

        let [ tY, tm ] = getLastMonth(y, m);
        [tY, tm] = getLastMonth(tY, tm);

        //console.log((ty, tm));

        this.state.prefetchingPrev = fetchMonthData(tY, tm);

        [ tY, tm ] = getNextMonth(getNextMonth(y, m));
        this.state.nextMonthData = GLOBALS.nextMonthData;
        console.log("SettingsScreen" + "=".repeat(60));
        console.log("=".repeat(60));
        this.state.nextTwoPrefetching = null;
        if (this.state.nextMonthData.last_trip != null) {
            this.state.nextTwoPrefetching = fetchMonthData(tY, tm);
        }
    }

    upToDate = () => {
        return (this.state.curMonth === this.state.month && this.state.curYear === this.state.year);
    }

    onSwipePerformed = (action) => {
        //console.log("action ", action);
        switch (action) {
            case 'left':
                this.showBreakdownFromLastTrip();
                break;
            case 'right':
                this.showBreakdownFromNextTrip();
                break;
        }
    }

    getFootprintGraphData = (tripData) => {
        let trips = tripData.trips;
        let curTrip = trips[tripData.first_trip];
        let footprints = [];

        console.log(curTrip);

        if (curTrip == null) {
            return footprints;
        }

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
        console.log(summary);

        //console.log("summary", summary);

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
        if (this.state.curMonthData.trips[this.state.curTripId].last_id == null)
            return this.state.lastMonthData.last_trip != null
        return true;
    }

    canGoRight = () => {
        if (this.state.curMonthData.trips[this.state.curTripId].next_id == null)
            return this.state.nextMonthData.last_trip != null
        return true;
    }

    showBreakdownFromLastTrip = async () => {
        if (this.canGoLeft()) {
            let newId = this.state.curMonthData.trips[this.state.curTripId].last_id;

            if (newId === null) {
                console.log("trying to scoll left month-wise");
                // this means we are at the boundary!
                let twoMonthsAgo = await this.state.prefetchingPrev;
                console.log(twoMonthsAgo);

                this.state.nextTwoPrefetching = Promise.resolve(this.state.nextMonthData);
                this.state.nextMonthData = this.state.curMonthData; 
                this.state.curMonthData = this.state.lastMonthData;
                this.state.lastMonthData = twoMonthsAgo;

                console.log(this.state.lastMonthData);

                let y = this.state.lastMonthData.year;
                let m = this.state.lastMonthData.month;

                let [ tY, tm ] = getLastMonth(y, m);
                this.state.prefetchingPrev = fetchMonthData(tY, tm);

                newId = this.state.curMonthData.last_trip;
            }

            this.updateToTripId(newId);
        }
    }

    showBreakdownFromNextTrip = async () => {
        if (this.canGoRight()) {
            let newId = this.state.curMonthData.trips[this.state.curTripId].next_id;

            if (newId === null) {
                let nextTwoMonths = await this.state.nextTwoPrefetching;

                this.state.prefetchingPrev = Promise.resolve(this.state.lastMonthData);
                this.state.lastMonthData = this.state.curMonthData;
                this.state.curMonthData = this.state.nextMonthData;
                this.state.nextMonthData = nextTwoMonths;

                let y = this.state.nextMonthData.year;
                let m = this.state.nextMonthData.month;

                let [ tY, tm ] = getNextMonth(y, m);
                this.state.nextTwoPrefetching = fetchMonthData(tY, tm);

                newId = this.state.curMonthData.first_trip;

            }

            this.updateToTripId(newId);
        }
    }

    render = () => {
        return (
            <View style={styles.Container}>
            <View style={{
                paddingLeft: 0.05 * screenWidth,
                    paddingRight: 0.05 * screenWidth,
            }}>
            <Text style={{
                fontSize: scaleTextSize(16),
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
            hasCompleted={!this.upToDate()}
            />

            <Text style={{
                fontSize: scaleTextSize(16),
                    fontWeight: "bold",
                    marginBottom: 5
            }}>Footprint Breakdown
            ({this.state.year + "/" + this.state.month + "/" + this.state.day})
            </Text>


            </View>



            <View style={{
                paddingLeft: 0.01 * screenWidth,
                    paddingRight: 0.01 * screenWidth,
                    flex: 1,
                    flexDirection:'row',
                    paddingBottom: 0.05 * screenHeight}}>

            <View style={{ flex: 1 }}>
            <TouchableOpacity
            onPress={this.showBreakdownFromLastTrip}
            activeOpacity={
                this.canGoLeft() ? 0.2 : 1.0
            }
            style={{ flex: 1 }}>
            <Text style={{
                fontSize: 30,
                    fontWeight: 'bold',
                    opacity: this.canGoLeft() ? 1.0 : 0.2,
                    paddingTop: 0.16 * screenHeight,
                    textAlign: 'center',
            }}>⟨</Text>
            </TouchableOpacity>
            </View>

            <Card containerStyle={{flex: 18}}>
            <ScrollView>
            <GestureRecognizer
            onSwipeLeft={this.showBreakdownFromNextTrip}
            onSwipeRight={this.showBreakdownFromLastTrip}
            config={swipeConfig}>

            <Text style={{ fontSize: scaleTextSize(16) }}>
            Total:&nbsp;
            {this.state.curMonthData.trips[this.state.curTripId].carbon_footprint.toFixed(1)} kg of CO2-e
            </Text>


            <CarbonBreakdownPieChart
            breakdown={this.state.tripSummary}
            width={0.7 * screenWidth}
            height={0.2 * screenHeight}
            backgroundColor="transparent"
            paddingLeft={0.0 * screenWidth}
            />
            <Divider
            style={{
                marginBottom: 10
            }}
            />
            <View style={{
                flex: 1,
                    flexDirection: 'row',
                    marginBottom: 10
            }}>
            <Text style={{
                flex: 1,
                    lineHeight: scaleTextSize(16),
                    fontSize: scaleTextSize(16),
            }}>Itemized Receipt:</Text>
            <Text style={{
                lineHeight: scaleTextSize(16),
                    fontSize: scaleTextSize(16),
                    flex: 1,
                    textAlign: 'right'
            }}>
            CO2-e (kg)
            </Text>
            </View>

            <ItemizedCarbonReceipt
            rowStyling = {styles.ReceiptItem}
            itemized={this.state.itemized}
            fontSize={scaleTextSize(16)}
            lineHeight={scaleTextSize(16)}
            />
            </GestureRecognizer>

            </ScrollView>
            </Card>

            <View containerStyle={{flex: 1}}>
            <TouchableOpacity
            onPress={this.showBreakdownFromNextTrip}
            activeOpacity={
                this.canGoRight() ? 0.2 : 1.0
            }
            style={{flex: 1}}>
            <Text style={{
                fontSize: 30,
                    fontWeight: 'bold',
                    opacity: this.canGoRight() ? 1.0 : 0.2,
                    paddingTop: 0.16 * screenHeight,
                    textAlign: 'left'
            }}>⟩</Text>

            </TouchableOpacity>
            </View>
            </View>

            </View>
        );
    }
}

SettingsScreen.navigationOptions = {
    title: 'Progress',
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        marginTop: 0.01 * screenHeight,
        //paddingLeft : 0.02 * screenWidth,
        //paddingRight: 0.02 * screenWidth,
    },
    ReceiptItem: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#5f5f5f',
    },

});
