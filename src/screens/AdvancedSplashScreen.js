import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import DatabaseService from '../services/DatabaseService';
import ApiService from '../services/ApiService';

const { width, height } = Dimensions.get('window');

const AdvancedSplashScreen = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState('Initializing...');
  const [progress, setProgress] = useState(0);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    initializeApp();
  }, []);

  const updateProgress = (step, progressValue) => {
    setCurrentStep(step);
    setProgress(progressValue);
    
    Animated.timing(progressAnim, {
      toValue: progressValue / 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const initializeApp = async () => {
    try {
      // Step 1: Initialize Database
      updateProgress('Initializing database...', 20);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
      const dbResult = await DatabaseService.initDatabase();
      
      if (dbResult.success) {
        updateProgress('Database ready ✓', 40);
      } else {
        updateProgress('Database initialization failed', 40);
      }

      // Step 2: Check for existing users
      updateProgress('Checking local data...', 60);
      await new Promise(resolve => setTimeout(resolve, 300));
      const usersResult = await DatabaseService.getAllUsers();
      
      if (usersResult.success && usersResult.users.length > 0) {
        updateProgress('Local data found ✓', 80);
      } else {
        // Step 3: Fetch users from API if none exist locally
        updateProgress('Fetching user data...', 70);
        const apiResult = await ApiService.fetchAllUsers();
        
        if (apiResult.success) {
          updateProgress('Storing user data...', 85);
          await DatabaseService.insertUsers(apiResult.users);
          updateProgress('User data ready ✓', 90);
        } else {
          updateProgress('Failed to fetch users', 90);
        }
      }

      // Step 4: Final preparations
      updateProgress('Preparing app...', 95);
      await new Promise(resolve => setTimeout(resolve, 500));
      updateProgress('Ready to launch! ✓', 100);
      
      // Wait a moment before finishing
      setTimeout(() => {
        if (onFinish) {
          onFinish();
        }
      }, 800);

    } catch (error) {
      console.error('Splash initialization error:', error);
      updateProgress('Initialization complete', 100);
      setTimeout(() => {
        if (onFinish) {
          onFinish();
        }
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* App Icon/Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>👥</Text>
          </View>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>UserWidget</Text>
        <Text style={styles.appSubtitle}>Random User Display with MVVM</Text>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.stepText}>{currentStep}</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          
          <Text style={styles.progressText}>{progress}%</Text>
          
          {/* Loading Indicator */}
          {progress < 100 && (
            <ActivityIndicator 
              size="large" 
              color="#FFFFFF" 
              style={styles.loadingIndicator}
            />
          )}
        </View>
      </Animated.View>

      {/* Bottom Info */}
      <View style={styles.bottomContainer}>
        <Text style={styles.featureText}>✨ MVVM Architecture</Text>
        <Text style={styles.featureText}>🔄 SQLite Database</Text>
        <Text style={styles.featureText}>📱 Widget Support</Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 60,
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 50,
    textAlign: 'center',
  },
  progressSection: {
    alignItems: 'center',
    width: width * 0.8,
  },
  stepText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    textAlign: 'center',
    minHeight: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  loadingIndicator: {
    marginTop: 10,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  versionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10,
    fontWeight: '600',
  },
});

export default AdvancedSplashScreen;