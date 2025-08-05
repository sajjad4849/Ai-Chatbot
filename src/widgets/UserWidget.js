import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import WidgetService from '../services/WidgetService';

const UserWidget = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWidgetData();
  }, []);

  const loadWidgetData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get existing widget data
      let widgetData = await WidgetService.getWidgetData();
      
      // If no data exists, create new random user data
      if (!widgetData) {
        widgetData = await WidgetService.refreshWidgetData();
      }
      
      if (widgetData) {
        setUserData(widgetData);
      } else {
        setError('No user data available');
      }
    } catch (err) {
      console.error('Load widget data failed:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const newData = await WidgetService.refreshWidgetData();
      if (newData) {
        setUserData(newData);
      }
    } catch (err) {
      console.error('Refresh widget data failed:', err);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error || !userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {error || 'No data available'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Image
          source={{ uri: userData.avatar }}
          style={styles.avatar}
          defaultSource={require('../assets/placeholder-avatar.png')}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {userData.name}
          </Text>
          <Text style={styles.lastUpdated} numberOfLines={1}>
            Updated: {new Date(userData.lastUpdated).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#666',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    fontSize: 12,
    color: '#ff3b30',
    textAlign: 'center',
  },
});

export default UserWidget;