import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { initDatabase } from './src/db/SQLiteService';
import { initializeWidget, forceWidgetUpdate } from './src/services/WidgetService';
import HomeWidget from './src/components/HomeWidget';
import AppWidget from './src/components/AppWidget';

const App = () => {
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing app...');
        
        // Initialize database first
        console.log('📊 Initializing database...');
        await initDatabase();
        setIsDatabaseReady(true);
        console.log('✅ Database initialized');

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

  const handleForceUpdate = async () => {
    try {
      console.log('🔄 Force updating widget...');
      await forceWidgetUpdate();
      Alert.alert('Success', 'Widget updated successfully!');
    } catch (err) {
      console.error('❌ Error force updating widget:', err);
      Alert.alert('Error', 'Failed to update widget: ' + err.message);
    }
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Initialization Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setIsDatabaseReady(false);
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
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Random User Widget</Text>
          <Text style={styles.subtitle}>Task_7 - Bitbucket Implementation</Text>
        </View>

        {/* Status Indicators */}
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: isDatabaseReady ? '#4CAF50' : '#FFC107' }]} />
            <Text style={styles.statusText}>
              Database: {isDatabaseReady ? 'Ready' : 'Initializing...'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: isWidgetReady ? '#4CAF50' : '#FFC107' }]} />
            <Text style={styles.statusText}>
              Widget: {isWidgetReady ? 'Ready' : 'Initializing...'}
            </Text>
          </View>
        </View>

        {/* Widget Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Widget Preview</Text>
          <Text style={styles.sectionDescription}>
            This shows how your widget will look on the home screen
          </Text>
          {isDatabaseReady ? (
            <AppWidget />
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading widget preview...</Text>
            </View>
          )}
        </View>

        {/* Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Widget Controls</Text>
          <TouchableOpacity 
            style={[styles.button, !isWidgetReady && styles.buttonDisabled]}
            onPress={handleForceUpdate}
            disabled={!isWidgetReady}
          >
            <Text style={[styles.buttonText, !isWidgetReady && styles.buttonTextDisabled]}>
              Force Update Widget
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Add Widget</Text>
          <View style={styles.instructionsList}>
            <Text style={styles.instructionItem}>1. Long press on your home screen</Text>
            <Text style={styles.instructionItem}>2. Select "Widgets" from the menu</Text>
            <Text style={styles.instructionItem}>3. Find "Random User Widget"</Text>
            <Text style={styles.instructionItem}>4. Drag it to your home screen</Text>
            <Text style={styles.instructionItem}>5. Widget will update every 30 seconds</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Widget Features</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>✅ Random user avatars from database</Text>
            <Text style={styles.featureItem}>✅ Fallback to initials when no avatar</Text>
            <Text style={styles.featureItem}>✅ Auto-updates every 30 seconds</Text>
            <Text style={styles.featureItem}>✅ Click to manually refresh</Text>
            <Text style={styles.featureItem}>✅ Error handling with fallbacks</Text>
            <Text style={styles.featureItem}>✅ Responsive design</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
  },
  button: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: '#999',
  },
  instructionsList: {
    paddingLeft: 10,
  },
  instructionItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  featuresList: {
    paddingLeft: 10,
  },
  featureItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
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