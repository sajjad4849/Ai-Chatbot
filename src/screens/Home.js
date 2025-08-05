import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useHomeViewModel } from '../viewmodels/HomeViewModel';
import UserItem from '../components/UserItem';
import UserWidget from '../widgets/UserWidget';
import WidgetDataService from '../services/WidgetDataService';
import TestWidget from '../utils/TestWidget';

const Home = () => {
  const { users, loading, error, refreshing, refreshData } = useHomeViewModel();

  // Update widget data whenever users change
  useEffect(() => {
    if (users.length > 0) {
      WidgetDataService.updateWidgetData();
    }
  }, [users]);

  const renderUserItem = ({ item }) => <UserItem user={item} />;

  const handleWidgetRefresh = async () => {
    await WidgetDataService.updateWidgetData();
  };

  const runWidgetTest = async () => {
    console.log('🚀 Running Widget Test from Home Screen...');
    await TestWidget.runFullTest();
  };

  const runQuickTest = async () => {
    console.log('⚡ Running Quick Widget Test...');
    await TestWidget.quickTest();
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No users found</Text>
      <Text style={styles.emptySubText}>Pull to refresh</Text>
    </View>
  );

  const renderErrorComponent = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Error: {error}</Text>
      <Text style={styles.errorSubText}>Pull to refresh</Text>
    </View>
  );

  if (loading && users.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Users</Text>
          <Text style={styles.headerSubtitle}>
            {users.length} user{users.length !== 1 ? 's' : ''} found
          </Text>
          
          {/* Debug Buttons */}
          <View style={styles.debugButtons}>
            <TouchableOpacity style={styles.debugButton} onPress={runQuickTest}>
              <Text style={styles.debugButtonText}>Quick Test</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.debugButton} onPress={runWidgetTest}>
              <Text style={styles.debugButtonText}>Full Test</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Widget Section */}
        <UserWidget onRefresh={handleWidgetRefresh} />
        
        {/* Users List */}
        <View style={styles.usersSection}>
          <Text style={styles.sectionTitle}>All Users</Text>
          {loading && users.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading users...</Text>
            </View>
          ) : error && users.length === 0 ? (
            renderErrorComponent()
          ) : users.length === 0 ? (
            renderEmptyComponent()
          ) : (
            users.map((user) => (
              <UserItem key={user.id.toString()} user={user} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  debugButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  debugButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  usersSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3B30',
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default Home;