import React, { Component } from 'react';

import {
    ScrollView, StyleSheet, FlatList, Text, View, Dimensions
} from 'react-native';
import styled from 'styled-components';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const getGreenToRed = (percent) => {
    console.log(percent);
    let r = percent<50 ? 255 : Math.floor(255-(percent*2-100)*255/100);
    let g = percent>50 ? 255 : Math.floor((percent*2)*255/100);
    let rv= 'rgb('+r+','+g+',0)';
    console.log(rv);
    return rv;
};

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


const ReceiptList = styled.FlatList`
    position: absolute;
    top: 40%;
    left: 5%;
`;

export default class ItemizedCarbonReceipt extends Component {
    renderItem = ({item}) => {
        return (
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
                        fontSize: this.props.fontSize,
                        lineHeight: this.props.lineHeight,
                    }}>
                        {item.footprint.toFixed(1)}
                    </Text>
                </View>
            </View>
        );
    }

    render() {
        return (
            <FlatList styles={{
                position: 'absolute',
                top: '40%',
                left: '5%',
            }}
            data={this.props.itemized}
            renderItem={this.renderItem}
            />
        );
    }
}

const styles = StyleSheet.create({
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
    rightJustified: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        color: '#5f5f5f',
    },
})
