import * as WebBrowser from 'expo-web-browser';
import withUnmounted from '@ishawnwang/withunmounted'
import React, { useState, useEffect, useRef } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';

import { MonoText } from '../components/StyledText';
import { RNCamera } from 'react-native-camera';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { NavigationScreenProps } from 'react-navigation';
import LinksScreen from './LinksScreen';


const url = "https://api.ocr.space/parse/image"
async function apiCall(path, file) {
  try{
    console.log("apiCall", path);
    let formData = new FormData();
    const manipResult = await ImageManipulator.manipulateAsync(
          file["uri"],
          [],
          { compress: 0, }
        );

    const base64 = await FileSystem.readAsStringAsync(manipResult.uri, { encoding: 'base64' });

    const base64string = "data:image/jpeg;base64," + base64 
    formData.append('base64Image', base64string);
    formData.append('apikey','7e5dcf14b188957');
    formData.append('language', 'eng');
    formData.append('filetype', 'image/jpg')
    formData.append('detectOrientation', true)
    formData.append('isOverlayRequired', true)
    formData.append('isTable', true)
    formData.append('scale', true)
    const response = await fetch(url + path, {
        method: 'POST',
        mode: 'cors',
        body: formData
    })
    if (!response.ok) {
        console.log(response.json())
        throw await response.json()
    }
    return await response.json()
  }
  catch (error) {
    console.log(error)
  } 
    
}

// This will upload the file after having read it
const upload = async (file) => {
  try{
    const resp = await apiCall("", file)
    const lines = resp.ParsedResults[0].TextOverlay.Lines
    var r = /^\$?[0-9]+[.,][0-9]?[0-9]?$/;
    const rowY = []
    const remainingLines = []

    for (const el of lines){
        let isDollar = el.LineText.split(" ").some(word => r.test(word)) && !(el.LineText.includes("lb") || el.LineText.includes("kg") || el.LineText.includes("@"))
        if (isDollar) {
            rowY.push(el)
        } else {
            remainingLines.push(el)
        }
    }
    function closest(arr, goal) {
        return arr.reduce(function({prev, idx}, curr, i) {
        return (Math.abs(curr.MinTop - goal) < Math.abs(prev.MinTop - goal) ? {prev: curr, idx: i} : {prev, idx});
    }, {prev: arr[0], idx:0})
    };
    
    remainingLines.sort(function (a, b) {
        return a.MinTop - b.MinTop;
    });
    
    // group by line
    const textByLines = []
    let prev;
    let curr = []
    let epsilon = 10;
    for (const el of remainingLines) {
            if (!prev) { prev = el}
            
            if (Math.abs(el.MinTop - prev.MinTop) > epsilon) {
                textByLines.push(curr)
                curr = [el]
            } else {
                curr.push(el)
            }
            prev = el
    }
    const items = []
    let total;
    for (let i=0; i < textByLines.length; i++) {
        const name = textByLines[i].map(el => el.LineText).join(" ").toLowerCase()
        if (name.includes("total")) {
            if (rowY.length) {
              total = closest(rowY, textByLines[i][0].MinTop).LineText
            }
        }
        let item;
        let descriptor = i + 1 < textByLines.length ? textByLines[i + 1].map(el => el.LineText).join(" ") : ""
        let unitStrings = descriptor.replace(/\s+/g, '').split('kg')
        if (unitStrings.length > 1) {
            item = {name, quantity: unitStrings[0], unit: 'kg'}
        } else {
            unitStrings = descriptor.replace(/\s+/g, '').split('lb')
            if (unitStrings.length > 1) {
                item = {name, quantity: unitStrings[0], unit: 'lb'}
            }
        }
        if (item) { 
            items.push(item)
            i += 1
        }
        else {
            items.push({name, quantity: 1.0, unit: 'ea'})
        }
    }
    console.log('items: ', items)
    const server_addr = "http://d1ecb8f2.ngrok.io";
    const response = await fetch(server_addr + "/query_receipt",
        {
            method: 'POST',
            mode: 'cors',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                receipt: items,
                total
            })
        })

    return await response.json(); 
  }
  catch(error){
    console.log(error)
  }
    
};


export default function HomeScreen(props) {
  const { navigate } = props.navigation;
  const [hasPermission, setHasPermission] = useState(null);
  const [showSpinner, setSpinner] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const camera = useRef(Camera); 


  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={(ref: any) => {
                      camera.current = ref;
                    }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={ async () => {
              setSpinner(true)
              if (camera.current) {
                 try {
                    const photo = await camera.current.takePictureAsync();
                    var file = {
                        uri: photo['uri'],
                        type: 'image/jpg',
                        name: 'photo.jpg',
                    };
                    const parsedReceipt = await upload(file);
                    console.log(parsedReceipt);
                    setSpinner(false)
                    navigate('Links', {data: JSON.stringify(parsedReceipt)})
                  } catch (error) {
                    console.log(error)
                  } 
              } 
              //setSpinner(false)

            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Snap </Text>
          </TouchableOpacity>
        </View>
        <Spinner
          visible={showSpinner}
          textContent={'Loading...'}
        />
      </Camera>
    </View>
  );
  
};




HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}


function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
