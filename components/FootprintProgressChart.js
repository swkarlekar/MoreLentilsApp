import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

import { YAxis, LineChart, AreaChart, Grid } from 'react-native-svg-charts'
import { Circle, Path } from 'react-native-svg'

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

// complex linear algebra to interpolate a few key points into a smooth line
// over the period of 31 days
const formatCarbonFootprint = (data, completed) => {
    let yValues = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

    let lastX = 0;
    let lastY = 0;
    let m;

    for (const item of data) {
        yValues[item.date] = item.total;
        
        m = (item.total - lastY) / (item.date - lastX);
        for (let i = lastX + 1 ; i < item.date ; i++) {
            yValues[i] = m * (i - lastX) + lastY;
        }

        lastX = item.date;
        lastY = item.total;
    }

    if (completed) {
        m = (0 - lastY) / (yValues.length - 1 - lastX);
        for (let i = lastX + 1 ; i < yValues.length ; i++) {
            yValues[i] = m * (i - lastX) + lastY;
        }
    }
    else {
        yValues = yValues.slice(0, lastX + 1);
    }

    return yValues;
}

const generateKeyPointsGenerator = (keypoints, currentOne) => {
    let decorator = ({ x, y, data }) => {
    return data.map((value, index) => 
        {
            if (index === currentOne) {
                return (
                    <Circle
                    key={ index }
                    cx={ x(index) }
                    cy={ y(value) }
                    r={ 5 }
                    stroke={ '#ff9d42' }
                    fill={ 'white' }
                    strokeWidth={3}
                    />
                );
            }
            if (keypoints.includes(index)) {
                return (
                    <Circle
                    key={ index }
                    cx={ x(index) }
                    cy={ y(value) }
                    r={ 4 }
                    stroke={ 'rgb(134, 65, 244)' }
                    fill={ 'white' }
                    />
                );
            }
            else {
                return null;
            }
       });
    }
    return decorator;
}

export default class FootprintProgressChart extends Component {
    render() {
        let lastMonthCarbonFootprints = this.props.lastMonthCarbonFootprints;
        let thisMonthCarbonFootprints = this.props.thisMonthCarbonFootprints;

        let data1 = formatCarbonFootprint(lastMonthCarbonFootprints, true);
        let data1KeyPoints = lastMonthCarbonFootprints.map((item) => item.date);
        let data2 = formatCarbonFootprint(thisMonthCarbonFootprints,
            this.props.hasCompleted);
        let data2KeyPoints = thisMonthCarbonFootprints.map((item) => item.date);

        const Graph1Decorator = generateKeyPointsGenerator(data1KeyPoints, -1);
        const Graph2Decorator = generateKeyPointsGenerator(data2KeyPoints,
            this.props.currentOne);

        let globalMax = Math.max.apply(Math, data1.concat(data2));

        return (
            <View>
                <Text>CO2-e (kg)</Text>
                <View style={ { height: 0.25 * screenHeight, flexDirection: 'row'} }>
                    <YAxis
                        style = {{flex: 1}}
                        data={data1.concat(data2)}
                        contentInset={ {top: 20, bottom: 20 } }
                        svg={{
                            fill: 'grey',
                            fontSize: 15,
                        }}
                        numberOfTicks={5}
                        formatLabel={(value) => `${value}kg`}
                    />
                    <View style={{flex: 8, leftMargin: 10}}>
                        <AreaChart
                            style={ { flex: 1 } }
                            data={ data1 }
                            svg={{ fill: 'rgba(160, 160, 160, 0.5)' }}
                            contentInset={ { top: 20, bottom: 20 } }
                            yMax = {globalMax}
                            xMax = { 31 }
                        >
                            <Grid
                            numberOfTicks={5}/>
                            <Graph1Decorator/>
                        </AreaChart>
                        <AreaChart
                            style={ StyleSheet.absoluteFill }
                            data={ data2 }
                            svg={{ fill: 'rgba(34, 128, 30, 0.5)' }}
                            contentInset={ { top: 20, bottom: 20 } }
                            yMax = { globalMax }
                            xMax = { 31 }
                        >
                            <Graph2Decorator/>
                        </AreaChart>
                    </View>
                </View>
            </View>
        )
    }
}
