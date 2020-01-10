import React, { useState, useEffect, useRef } from 'react';

import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator
} from 'react-native';

import { NavigationScreenProps } from 'react-navigation';

import GLOBALS from '../globals';

const server_addr = "http://f46870c0.ngrok.io";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const cur_year = 2019;
const cur_month = 12;

const fetchMonthData = async (year, month) => {
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
};


export default function LoadingScreen(props) {
    const { navigate } = props.navigation;

    const thisMonthData = fetchMonthData(cur_year, cur_month);
    const lastMonthData = thisMonthData.then((curMonthData) => {
        return fetchMonthData(cur_year, cur_month - 1).then((lastMonthData) => {
            return {
                'curMonthData': curMonthData,
                'lastMonthData': lastMonthData
            };
        });
    });

    lastMonthData.then((data) => {
        GLOBALS.curMonthData = data.curMonthData;
        GLOBALS.lastMonthData = data.lastMonthData;
        navigate('Main', {});
    });

    return (
        <View style={{backgroundColor: '#39DBAA', flex: 1}}>
            <Image
                source={require("../assets/images/logo.png")}
                style={{
                    position: "absolute",
                    top: 0.4 * screenWidth,
                    left: 0.3 * screenWidth,
                    width: 0.4 * screenWidth,
                    height: 0.4 * screenWidth,
                }}
            />
        </View>
    );
}
