import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
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

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;


const pieChartConfig = {
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
    'poultry': '#ffbfa5',
    'diary': '#f4e59a',
    'fish': '#b6afd8',
    'lentils': '#a6d2fc',
};



let tripSummary = [
        {'footprint': 9.2558, 'source': 'fruits'},
        {'footprint': 8.1, 'source': 'vegetables'},
        {'footprint': 19.2558, 'source': 'poultry'},
        {'footprint': 15.2558, 'source': 'diary'},
        {'footprint': 20.2558, 'source': 'red meat'},
        {'footprint': 9.2558, 'source': 'fish'},
        {'footprint': 1, 'source': 'lentils'}
    ];

let pieChartData = tripSummary.map(
    (item) => {
        return {
            'footprint': item.footprint,
            'name': toEnglishCase(item.source),
            'color': color_mapper[item.source],
            'legendFontColor': '#5f5f5f'
        };
    }
);

export default function SettingsScreen() {
    /**
     * Go ahead and delete ExpoConfigView and replace it with your content;
     * we just wanted to give you a quick view of your config.
     */
    const goalTotalFootprint = 55; 
    return (
        <ScrollView style={styles.Container}>
        <Text>CO2-e (kg)</Text>
        <LineChart
        data={{
            datasets: [
                {
                    data: [
                        Math.random() * 55*2,
                        Math.random() * 55*2,
                        Math.random() * 55*2,
                        Math.random() * 55*2,
                        Math.random() * 55*2,
                        Math.random() * 55*2
                    ]
                }
            ]
        }}
        width={0.90 * screenWidth} // from react-native
        height={220}
        verticalLabelRotation={30}
        //formatYLabel={label => "CO2-e " + label + "kg"}
        chartConfig={{
            backgroundColor: "#B7FFD8",
            backgroundGradientFrom: "#E2A0FF",
            backgroundGradientTo: "#C4F5FC",
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                borderRadius: 18
            },
            propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#67EBFC"
            },
        }}
        bezier
        style={{
            marginVertical: 8,
        }}
        />
        <Text>CO2 Footprint Breakdown (2020/01/02):</Text>
        <PieChart
                data={pieChartData}
                width={screenWidth}
                height={0.3 * screenHeight}
                chartConfig={pieChartConfig}
                accessor="footprint"
                backgroundColor="transparent"
            />
        <Text>Itemized Receipt:</Text>
        </ScrollView>
    );
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
