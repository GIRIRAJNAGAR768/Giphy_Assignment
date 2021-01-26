import React from 'react'

import HomeScreen from '../Screens/HomeScreen'
import DetailsScreen from '../Screens/DetailsScreen'
import FavoriteListScreen from '../Screens/FavoriteListScreen'

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="homeScreen">
        <Stack.Screen name="detailScreen" component={DetailsScreen} options={navigationOptions("Detail Screen",true)} />
        <Stack.Screen name="favoriteScreen" component={FavoriteListScreen} options={navigationOptions("Favorite Gifs",true)} />
        <Stack.Screen name="homeScreen" component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const navigationOptions = (title,isLeft) => {
  return {
    title: title,
    headerStyle: {
      backgroundColor: '#c53434',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign: isLeft?'left':'center'
    },
  }
}

export default RootNavigation