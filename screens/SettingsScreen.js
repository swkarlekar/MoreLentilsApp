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

export default function SettingsScreen() {
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
   const goalTotalFootprint = 55; 
  return (
    <View >
  <Text>Bezier Line Chart</Text>
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
    width={Dimensions.get("window").width} // from react-native
    height={220}
    yAxisLabel={"kg CO2"}
    yAxisSuffix={""}
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
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 1,
      marginHorizontal:8,
    }}
  />
    </View>
  );
}

SettingsScreen.navigationOptions = {
  title: 'Progress',
};
