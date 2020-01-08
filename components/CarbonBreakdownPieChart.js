import React, { Component } from 'react';
import { Dimensions } from 'react-native';

import { View, } from 'react-native';

import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

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

const color_mapper = {
    'fruits': '#aefcbf',
    'vegetables': '#7fb88b',
    'red meat': '#ffb5bc',
    'poultry': '#ff996d',
    'diary': '#f4e59a',
    'fish': '#b6afd8',
    'lentils': '#a6d2fc',
    'tofu': '#fcf9e3',
    'grains': '#e0e0e0'
};

const chartConfig = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#fb8c00",
  backgroundGradientTo: "#ffa726",
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726"
  }
}

export default class CarbonBreakdownPieChart extends Component {
    render() {
        let pieChartData = this.props.breakdown.map(
            (item) => {
                return {
                    'footprint': item.footprint,
                    'name': toEnglishCase(item.source),
                    'color': color_mapper[item.source],
                    'legendFontColor': '#5f5f5f'
                };
            });
        return (
            <PieChart
                data={pieChartData}
                width={this.props.width}
                height={this.props.height}
                chartConfig={chartConfig}
                accessor="footprint"
                backgroundColor={this.props.backgroundColor}
                paddingLeft={0.02 * screenWidth}
            />
        );
    }
}
