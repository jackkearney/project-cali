import React from 'react';
import { StyleSheet, Text, Button, TouchableOpacity, View, AsyncStorage, Alert } from 'react-native';
import phrases from './phrases/phrases.js';

// By switching to typesafe, can compile the code instead of having to run it on an emulator first
// Phillips hue or nest lightbulb to use a rest api. no hardware needed, big help.
let _saveCounter = async (current, resolve, reject) => {
  try {
    await AsyncStorage.setItem('counter',current + '');
    console.log('Saved data');
    resolve();
  } catch (error) {
    reject(error);
  }
};

let _fetchCounter = async (resolve,reject) => {
  try {
    const value = await AsyncStorage.getItem('counter');
    value = parseInt(value);
    console.log('Fetch stored counter:',value === null ? 'FAILED' : 'SUCCESS', value);
    resolve(value === null ? 0 : value);
  } catch (error) {
    console.error('Error fetching data', error.message || error);
    resolve(0);
  }
};   


export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state =  { phrase: "loading..." };
    let fetchCounterPromise = new Promise((resolve,reject) => {
       _fetchCounter(resolve, reject);// add a resolve() call
    })
    fetchCounterPromise.then((counter) => {
      console.log('promise completed', counter);
      this.counter = counter;
      this.getPhrase();
    })
    .catch((error) => {
      console.error('Promise rejected', error);
    })
    
  }

  // maybe have update every so often/ .5 or .25 chance to update. OR just after 3 hits
  getPhrase = () => {
    this.setState({ phrase: phrases[this.counter] }); 
    console.log(this.state.phrase);
  }

  onPress = () => {
    this.send();
    this.counter = (this.counter + 1) % phrases.length;
    let savePromise = new Promise((resolve,reject) => {
      _saveCounter(this.counter, resolve, reject);
    });
    savePromise.then((response) => {
      console.log('saved counter');
    }).catch((error) => {
      console.error('Failed to save counter', error);
    });
    this.getPhrase();
  }

  // Need to define a wait time for in between calls. Can either use real time 
  //    or a timer library or build in js callbacks for timeouts.
  send = () => {
    fetch('http://10.230.245.146:3000/hello', { 
      method:'GET'
    })
    .then((response) => response.json ? response.json() : response)
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      Alert.alert(
        'Http error :(',
        'some error happened when trying to send the message',
        [ {text: 'OK'} ] )
      console.error('Error during http fetch', error);
    })
  }

  render() {
    return (
      <View style={styles.container}>
      
        <TouchableOpacity 
            onPress={this.onPress} activeOpacity= { 0.5 } >
          <Text> {this.state.phrase} </Text>
        </TouchableOpacity>
      </View>
        // display a little buddy in the bottom
        // standing when unsent, cheering when sent
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    backgroundColor: '#aaa'
  }
});
