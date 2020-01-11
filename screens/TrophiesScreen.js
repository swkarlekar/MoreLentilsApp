import React, { Component } from 'react';
import {
    ScrollView, 
    StyleSheet, 
    FlatList, 
    SafeAreaView, 
    Text, 
    View, 
    Dimensions, 
    TouchableOpacity, 
    TouchableHighlight, 
    Button
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { NavigationScreenProps } from 'react-navigation';
import CarbonBreakdownPieChart from '../components/CarbonBreakdownPieChart'
import ItemizedCarbonReceipt from '../components/ItemizedCarbonReceipt'
import TrophyGrid from '../components/TrophyGrid'


const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function TrophiesScreen(props) {
  const { navigate } = props.navigation;
  let serverReply = props.navigation.getParam('data', ''); 

  const curr_user_trophies = [2, 3, 7, 8]
  console.log("trophy grid: ", TrophyGrid); 

    return (
        <View>
            <TrophyGrid />
        </View>
    );
}

TrophiesScreen.navigationOptions = {
    title: 'Trophies',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#5f5f5f',
    },
    BoldText: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 20,
        lineHeight: 20,
        color: '#5f5f5f',
    },
    BoldTextR: {
        textAlign: 'right',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 20,
        lineHeight: 20,
        color: '#5f5f5f',
    },
    Container : {
        paddingLeft: 0.05 * screenWidth,
        paddingRight: 0.05 * screenHeight,
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
    rightJustified: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        color: '#5f5f5f',
    },
    submit:{
        marginRight:40,
        marginLeft:40,
        marginTop:10,
        paddingTop:20,
        paddingBottom:20,
        backgroundColor:'#68a0cf',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
  },
  submitText:{
      color:'#fff',
      textAlign:'center',
  }

});
