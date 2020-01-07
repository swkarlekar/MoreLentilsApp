import React from 'react';
import {
    ScrollView, StyleSheet, FlatList, Text, View, Dimensions
} from 'react-native';
import styled from 'styled-components';
import { PieChart } from 'react-native-chart-kit';

let serverReply = {'breakdown':
    [
        {'footprint': 9.2558, 'source': 'fruits'},
        {'footprint': 8.1, 'source': 'vegetables'},
        {'footprint': 19.2558, 'source': 'poultry'},
        {'footprint': 15.2558, 'source': 'diary'},
        {'footprint': 20.2558, 'source': 'red meat'},
        {'footprint': 9.2558, 'source': 'fish'},
        {'footprint': 1, 'source': 'lentils'}
    ],
 'itemized': [{'footprint': 0.4862,
               'goodness': 0.9724999999999999,
               'name': 'BANANA CAVENDISH'},
              {'footprint': 3.8512,
               'goodness': 0.9275,
               'name': 'POTATOES BRUSHED'},
              {'footprint': 1.616, 'goodness': 0.95, 'name': 'BROCCOLI'},
              {'footprint': 1.2914,
               'goodness': 0.9724999999999999,
               'name': 'GRAPES GREEN'},
              {'footprint': 0.436, 'goodness': 0.95, 'name': 'PEAS SNOW'},
              {'footprint': 0.49500000000000005,
               'goodness': 0.9724999999999999,
               'name': 'TOMATOES GRAPE'},
              {'footprint': 1.08, 'goodness': 0.95, 'name': 'LETTUCE ICEBERG'}],
 'total_carbon_footprint': 9.2558,
'goodness': 0.5}

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
    'poultry': '#ffbfa5',
    'diary': '#f4e59a',
    'fish': '#b6afd8',
    'lentils': '#a6d2fc',
};

const getGreenToRed = (percent) => {
    console.log(percent);
    let r = percent<50 ? 255 : Math.floor(255-(percent*2-100)*255/100);
    let g = percent>50 ? 255 : Math.floor((percent*2)*255/100);
    let rv= 'rgb('+r+','+g+',0)';
    console.log(rv);
    return rv;
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

const ReceiptList = styled.FlatList`
    position: absolute;
    top: 40%;
    left: 5%;
`;

export default function LinksScreen() {
    let pieChartData = serverReply.breakdown.map(
        (item) => {
            return {
                'footprint': item.footprint,
                'name': toEnglishCase(item.source),
                'color': color_mapper[item.source],
                'legendFontColor': '#5f5f5f'
            };
        }
    );

    console.log(pieChartData);

    return (
        <ScrollView>
            <PieChart
                data={pieChartData}
                width={screenWidth}
                height={0.4 * screenHeight}
                chartConfig={chartConfig}
                accessor="footprint"
                backgroundColor="transparent"
                paddingLeft={0.05 * screenWidth}
            />
            <View style={styles.ReceiptItem}>
                <View style={styles.TextSpan}>
                    <Text numberOfLines={1} style={styles.BoldText}>
                        Carbon Footprint (kg of CO2-e)
                    </Text>
                </View>
                <View style={styles.rightJustified}>
                    <Text style={{
                        color:getGreenToRed(serverReply.goodness * 100),
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: 20,
                        lineHeight: 20,
                    }}>
                        {serverReply.total_carbon_footprint.toFixed(1)}
                    </Text>
                </View>
            </View>
            <FlatList styles={{
                position: 'absolute',
                top: '40%',
                left: '5%',
            }}
            data={serverReply.itemized}
            renderItem={({item}) => 
                <View style={styles.ReceiptItem}>
                    <View style={styles.TextSpan}>
                        <Text style={styles.Text}>
                            {toEnglishCase(item.name)}
                        </Text>
                    </View>
                    <View style={styles.rightJustified}>
                        <Text style={{
                            color:getGreenToRed(item.goodness * 100),
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontSize: 18,
                            lineHeight: 18,
                        }}>
                            {item.footprint.toFixed(1)}
                        </Text>
                    </View>
                </View>
            }
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#5f5f5f',
    },
    rightJustified: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        color: '#5f5f5f',
    },
    ReceiptItem: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 0.05 * screenWidth,
        paddingRight: 0.05 * screenWidth,
        color: '#5f5f5f',
    },
    TextSpan: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        color: '#5f5f5f',
    },
    Text: {
        flex: 1,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 18,
        lineHeight: 18,
        color: '#5f5f5f',
    },
    BoldText: {
        flex: 1,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 20,
        lineHeight: 20,
        color: '#5f5f5f',
    }

});
