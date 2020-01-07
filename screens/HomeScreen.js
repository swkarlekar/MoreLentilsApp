import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  Platform,
  ScrollView,
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


const url = "https://api.ocr.space/parse/image"
async function apiCall(path, file) {
    console.log("apiCall", path);
    let formData = new FormData();
    const manipResult = await ImageManipulator.manipulateAsync(
          file["uri"],
          [],
          { compress: 0, }
        );
    console.log(manipResult); 

    const base64 = await FileSystem.readAsStringAsync(manipResult.uri, { encoding: 'base64' });
    console.log("heres your image in base64", base64)

    const base64string = "data:image/jpeg;base64," + base64 
    formData.append('base64Image', base64string);
    formData.append('apikey','7e5dcf14b188957');
    formData.append('language', 'eng');
    formData.append('filetype', 'image/jpg')
    formData.append('detectOrientation', true)
    formData.append('isOverlayRequired', true)
    formData.append('isTable', true)
    formData.append('scale', true)
    console.log(formData)
    const response = await fetch(url + path, {
        method: 'POST',
        mode: 'cors',
        body: formData
    })
    if (!response.ok) {
        console.log("something bad happened x( ")
        console.log(response.json())
        throw await response.json()
    }
    else {
      console.log("got a response!")
    }
    return await response.json()
    
}

// This will upload the file after having read it
const upload = async (file) => {
    console.log(file)
    const resp = await apiCall("", file)
    console.log(resp)
    const lines = resp.ParsedResults[0].TextOverlay.Lines
    var r = /^\$?[0-9]+[.,]?[0-9]?[0-9]?$/;
    // var r = /^\$?\d+(,\d{3})*\.?[0-9]?[0-9]?$/
    const rowY = []
    const remainingLines = []

    for (const el of lines){
        let isDollar = r.test(el.LineText)
        console.log(el.LineText, isDollar)
        if (isDollar) {
            rowY.push(el.MinTop)
        } else {
            remainingLines.push(el)
        }
    }

    const indices = []
    for (const goal of rowY) {
        const res = remainingLines.reduce(function({prev, idx}, curr, i) {
            return (Math.abs(curr.MinTop - goal) < Math.abs(prev.MinTop - goal) ? {prev: curr, idx: i} : {prev, idx});
        }, {prev: remainingLines[0], idx:0});
        console.log(res)
        indices.push(res.idx)
    }
    
    const items = []
    for (let i=0; i < indices.length - 1; i++) {
        const start = indices[i]
        const end = indices[i+1]
        const name = remainingLines[start].LineText
        let item;
        if (end - start > 1){
            let descriptor = remainingLines[start + 1].LineText
            let unitStrings = descriptor.replace(/\s+/g, '').split('kg')
            if (unitStrings.length > 1) {
                item = {name, quantity: unitStrings[0], unit: 'kg'}
            } else {
                unitStrings = descriptor.replace(/\s+/g, '').split('lb')
                if (unitStrings.length > 1) {
                    item = {name, quantity: unitStrings[0], unit: 'lb'}
                }
            }
        }
        if (item) { items.push(item)}
        else {
            items.push({name, quantity: 1.0, unit: 'ea'})
        }
        // items.push(remainingLines.slice(start, end))
    }
    console.log(items)
    // const response = await fetch("http://localhost:8000/query_receipt",
    //     {
    //         method: 'POST',
    //         mode: 'cors',
    //         headers: new Headers({ 'Content-Type': 'application/json' }),
    //         body: JSON.stringify({
    //             receipt: items
    //         })
    // })
    // console.log(await response.json())
};


export default function HomeScreen() {
  const [hasPermission, setHasPermission] = useState(null);
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
            onPress={ async() => {
              console.log("hi")
              if (camera.current) {
                 try {
                    const photo = await camera.current.takePictureAsync();
                    console.log(photo);
                    var file = {
                        uri: photo['uri'],
                        type: 'image/jpg',
                        name: 'photo.jpg',
                    };
                    await upload(file); 
                  } catch (error) {
                    console.log(error)
                  } 
              } 
              console.log("whats up")
              Alert.alert(
              'Good news!',
              'I took a picture!',
              [
                {
                  text: 'Close',
                  onPress: () => console.log('Close Pressed'),
                  style: 'cancel',
                },
              ],
              { cancelable: false }
            );
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Snap </Text>
          </TouchableOpacity>
        </View>
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
