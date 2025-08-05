import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
} from 'react-native';
import Home from './src/screens/Home';
import SplashScreen from './src/screens/SplashScreen';
import AdvancedSplashScreen from './src/screens/AdvancedSplashScreen';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    // Use AdvancedSplashScreen for better UX with real initialization
    return <AdvancedSplashScreen onFinish={handleSplashFinish} />;
    // Or use simple SplashScreen: return <SplashScreen onFinish={handleSplashFinish} />;
  }

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