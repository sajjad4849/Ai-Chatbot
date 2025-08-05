import React from 'react';
import {
  StatusBar,
  StyleSheet,
} from 'react-native';
import Home from './src/screens/Home';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Home />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;