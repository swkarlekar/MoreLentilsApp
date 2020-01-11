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

export const server_addr = "http://2ecd5bff.ngrok.io";

export const screenHeight = Dimensions.get("window").height;
export const screenWidth = Dimensions.get("window").width;

const cur_year = 2019;
const cur_month = 12;

export const fetchMonthData = async (year, month) => {
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

export const getNextMonth = (year, month) => {
    if (month === 12) {
        return [year + 1, 1];
    }
    return [ year, month + 1 ];
}

export const getLastMonth = (year, month) => {
    if (month === 1) {
        return [ year - 1, 12 ];
    }
    return [ year, month - 1 ];
}

export default function LoadingScreen(props) {
    const { navigate } = props.navigation;

    const thisMonthData = fetchMonthData(cur_year, cur_month);
    const lastMonthData = thisMonthData.then((curMonthData) => {
        GLOBALS.curMonthData = curMonthData;
        let [lY, lm] = getLastMonth(cur_year, cur_month);
        return fetchMonthData(lY, lm);
    });

    const nextMonthData = lastMonthData.then((lastMonthData) => {
        GLOBALS.lastMonthData = lastMonthData;
        let [nY, nm] = getNextMonth(cur_year, cur_month);
        return fetchMonthData(nY, nm)
    });

    nextMonthData.then((data) => {
        GLOBALS.nextMonthData = data;
        console.log(GLOBALS.nextMonthData);
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
