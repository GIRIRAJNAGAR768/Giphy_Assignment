
import React, { useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
} from 'react-native';
import RootNavigation from './src/Navigators/RootNavigation'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import combineReducers from './src/Reducer/indexReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.disableYellowBox = true;

const App = () => {

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const userId = await AsyncStorage.getItem("@userId")
    if (userId == null) {
      let random = Math.floor(Math.random() * 1000000) + 100000;
      let userId = "user" + random;
      await AsyncStorage.setItem("@userId", userId)
    }
  }

  let store = createStore(combineReducers);

  return (
    <Provider store={store}>
      <StatusBar backgroundColor={'#c53434'} barStyle={'light-content'} />
      <RootNavigation />
    </Provider>
  );
};

const styles = StyleSheet.create({

});

export default App;
