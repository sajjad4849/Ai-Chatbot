import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import WidgetDataService from '../services/WidgetDataService';
import WidgetDebugger from '../utils/WidgetDebugger';

const { width } = Dimensions.get('window');

const UserWidget = ({ onRefresh }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  // Debug state changes
  useEffect(() => {
    WidgetDebugger.logWidgetState('UserWidget', { user, loading, error });
  }, [user, loading, error]);

  const loadUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('UserWidget: Loading user data...');
      
      // Debug widget data
      await WidgetDebugger.debugWidgetData();
      
      // Try to get data from shared preferences first
      let result = await WidgetDataService.getWidgetData();
      console.log('UserWidget: Shared preferences result:', result);
      
      if (!result.success || !result.data) {
        console.log('UserWidget: No shared data, trying database directly...');
        // If no shared data, get directly from database
        result = await WidgetDataService.getRandomUserForWidget();
        console.log('UserWidget: Database result:', result);
        
        if (result.success && result.user) {
          const userData = {
            id: result.user.id,
            name: result.user.name,
            avatar: result.user.avatar,
            email: result.user.email,
          };
          console.log('UserWidget: Setting user data:', userData);
          setUser(userData);
        } else {
          console.log('UserWidget: No user found');
          setError('No user data available');
        }
      } else {
        const userData = {
          id: result.data.id,
          name: result.data.name,
          avatar: result.data.avatar,
          email: result.data.email,
        };
        console.log('UserWidget: Setting shared data:', userData);
        setUser(userData);
      }
    } catch (err) {
      console.error('UserWidget: Load user data error:', err);
      setError(`Failed to load user data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadUserData();
    if (onRefresh) {
      onRefresh();
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading user...</Text>
        </View>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || 'No user data'}
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handleRefresh}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Random User</Text>
          <Text style={styles.subtitle}>Tap to refresh</Text>
        </View>
        
        <View style={styles.userContainer}>
          <View style={styles.avatarContainer}>
            {imageLoading && (
              <ActivityIndicator
                size="small"
                color="#007AFF"
                style={styles.imageLoadingIndicator}
              />
            )}
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                console.log('Image load error for:', user.avatar);
              }}
            />
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={2}>
              {user.name}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user.email}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 120,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
  },
  imageLoadingIndicator: {
    position: 'absolute',
    top: 13,
    left: 13,
    zIndex: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default UserWidget;