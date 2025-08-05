import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { initializeWidget, forceWidgetUpdate } from './src/services/WidgetService';
import Home from './src/screens/Home';
import { useUserViewModel } from './src/viewmodels/UserViewModel';

const App = () => {
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [error, setError] = useState(null);
  const { viewModel } = useUserViewModel();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing app...');
        
        // Initialize widget
        console.log('📱 Initializing widget...');
        await initializeWidget();
        setIsWidgetReady(true);
        console.log('✅ Widget initialized');

        console.log('🎉 App initialization complete');
      } catch (err) {
        console.error('❌ App initialization error:', err);
        setError(err.message);
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Widget Initialization Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setIsWidgetReady(false);
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <Home />
      
      {/* Widget Status Bar */}
      <View style={styles.widgetStatusBar}>
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: isWidgetReady ? '#4CAF50' : '#FFC107' }]} />
          <Text style={styles.statusText}>
            Widget: {isWidgetReady ? 'Ready' : 'Initializing...'}
          </Text>
        </View>
        {isWidgetReady && (
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={async () => {
              try {
                await forceWidgetUpdate();
                Alert.alert('Success', 'Widget updated!');
              } catch (err) {
                Alert.alert('Error', 'Failed to update widget');
              }
            }}
          >
            <Text style={styles.updateButtonText}>Update Widget</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  widgetStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  updateButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;