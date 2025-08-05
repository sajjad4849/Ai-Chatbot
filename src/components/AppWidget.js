import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getRandomUser } from '../db/SQLiteService';
import { pushWidgetData } from '../services/WidgetService';

const AppWidget = () => {
  const [user, setUser] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchRandomUser = async () => {
    try {
      console.log('Fetching random user...');
      setError(null);
      const randomUser = await getRandomUser();
      console.log('Random user fetched:', randomUser);
      setUser(randomUser);
    } catch (err) {
      console.error('❌ Error fetching user:', err.message);
      setError('Failed to fetch user');
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleUpdateWidget = async () => {
    try {
      setIsUpdating(true);
      await fetchRandomUser();
      // Also update the actual widget
      await pushWidgetData();
      console.log('✅ Both preview and widget updated');
    } catch (err) {
      console.error('❌ Error updating widget:', err);
      setError('Failed to update widget');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchRandomUser();
    
    // Auto-refresh every 30 seconds for preview
    const interval = setInterval(fetchRandomUser, 30000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <TouchableOpacity style={styles.widgetContainer} onPress={handleUpdateWidget}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.tapToRetry}>Tap to retry</Text>
      </TouchableOpacity>
    );
  }

  if (!user) {
    return (
      <View style={styles.widgetContainer}>
        <ActivityIndicator size="small" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const hasAvatar = user.avatar && user.avatar.trim() !== '';

  return (
    <TouchableOpacity 
      style={styles.widgetContainer} 
      onPress={handleUpdateWidget}
      disabled={isUpdating}
    >
      {isUpdating && (
        <View style={styles.updatingOverlay}>
          <ActivityIndicator size="small" color="#6C63FF" />
        </View>
      )}
      
      {hasAvatar ? (
        <>
          {isImageLoading && (
            <ActivityIndicator
              size="small"
              color="#6C63FF"
              style={styles.loader}
            />
          )}
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatar}
            onLoadStart={() => {
              console.log('📷 Avatar loading started...');
              setIsImageLoading(true);
            }}
            onLoadEnd={() => {
              console.log('✅ Avatar loaded.');
              setIsImageLoading(false);
            }}
            onError={e => {
              console.warn('⚠️ Avatar failed to load:', e.nativeEvent);
              setIsImageLoading(false);
              setUser({ ...user, avatar: '' });
            }}
          />
        </>
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitial}>
            {user.name?.[0]?.toUpperCase() || '?'}
          </Text>
        </View>
      )}
      <Text style={styles.name}>{user.name || 'Unknown User'}</Text>
      <Text style={styles.tapToUpdate}>Tap to update</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 140,
    position: 'relative',
  },
  updatingOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    color: '#666',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
    color: '#333',
    marginTop: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tapToUpdate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  tapToRetry: {
    fontSize: 12,
    color: '#6C63FF',
    marginTop: 4,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  errorText: {
    fontSize: 14,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default AppWidget;