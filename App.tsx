import React from 'react';
import {ScrollView, StatusBar, Text, useColorScheme, View} from 'react-native';
import Home from './src/Screens/Home';

export default function App() {
  //const isDarkMode = useColorScheme() === 'dark';
  const isDarkMode = 'dark';

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        hidden={true}
      />
      <Home />
    </>
  );
}
