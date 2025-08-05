import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useUserViewModel } from '../viewmodels/UserViewModel';

const UserItem = ({ user }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <View style={styles.userItem}>
      <View style={styles.avatarContainer}>
        {imageLoading && (
          <ActivityIndicator
            size="small"
            color="#6C63FF"
            style={styles.imageLoader}
          />
        )}
        {!imageError ? (
          <Image
            source={{ uri: user.avatar }}
            style={[styles.avatar, imageLoading && styles.avatarLoading]}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {user.first_name?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>
    </View>
  );
};

const Home = () => {
  const { users, isLoading, error, isApiSyncing, lastSyncTime, viewModel } = useUserViewModel();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      await viewModel.initializeAppData();
    } catch (error) {
      console.error('Failed to initialize app data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const result = await viewModel.refreshFromAPI();
      if (result.success) {
        Alert.alert('Success', `Refreshed ${result.count} users from API`);
      } else {
        Alert.alert('Error', result.error || 'Failed to refresh data');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRetry = async () => {
    await initializeData();
  };

  const renderUserItem = ({ item }) => <UserItem user={item} />;

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Users Found</Text>
      <Text style={styles.emptyText}>
        {error 
          ? 'Failed to load users. Please check your connection and try again.'
          : 'Pull down to refresh and fetch users from API.'
        }
      </Text>
      {error && (
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Users</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {users.length} users • Last sync: {lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Never'}
        </Text>
        {isApiSyncing && (
          <View style={styles.syncingContainer}>
            <ActivityIndicator size="small" color="#6C63FF" />
            <Text style={styles.syncingText}>Syncing...</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (isLoading && users.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      {error && users.length === 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#6C63FF']}
              tintColor="#6C63FF"
            />
          }
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  syncingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6C63FF',
  },
  listContainer: {
    padding: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarLoading: {
    opacity: 0.5,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  imageLoader: {
    position: 'absolute',
    zIndex: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;