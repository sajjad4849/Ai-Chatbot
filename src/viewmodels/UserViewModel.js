import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import { initDatabase, syncUsersFromAPI, getAllUsers, getRandomUser } from '../db/SQLiteService';

class UserViewModel {
  constructor() {
    this.users = [];
    this.isLoading = false;
    this.error = null;
    this.isApiSyncing = false;
    this.lastSyncTime = null;
    this.listeners = [];
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of state changes
  notify() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  // Get current state
  getState() {
    return {
      users: this.users,
      isLoading: this.isLoading,
      error: this.error,
      isApiSyncing: this.isApiSyncing,
      lastSyncTime: this.lastSyncTime,
    };
  }

  // Set loading state
  setLoading(loading) {
    this.isLoading = loading;
    this.notify();
  }

  // Set error state
  setError(error) {
    this.error = error;
    this.notify();
  }

  // Set API syncing state
  setApiSyncing(syncing) {
    this.isApiSyncing = syncing;
    this.notify();
  }

  // Set users
  setUsers(users) {
    this.users = users;
    this.notify();
  }

  // Initialize database
  async initializeDatabase() {
    try {
      this.setLoading(true);
      this.setError(null);
      
      console.log('🔄 ViewModel: Initializing database...');
      await initDatabase();
      console.log('✅ ViewModel: Database initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ ViewModel: Database initialization failed:', error);
      this.setError(error.message);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  // Sync users from API to local database
  async syncFromAPI() {
    try {
      this.setApiSyncing(true);
      this.setError(null);
      
      console.log('🔄 ViewModel: Syncing users from API...');
      const result = await syncUsersFromAPI();
      
      if (result.success) {
        this.lastSyncTime = new Date();
        console.log(`✅ ViewModel: Successfully synced ${result.count} users`);
        
        // Refresh local users list
        await this.loadUsersFromDB();
        
        return { success: true, count: result.count };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('❌ ViewModel: API sync failed:', error);
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setApiSyncing(false);
    }
  }

  // Load users from local database
  async loadUsersFromDB() {
    try {
      this.setLoading(true);
      this.setError(null);
      
      console.log('🔄 ViewModel: Loading users from database...');
      const users = await getAllUsers();
      
      this.setUsers(users);
      console.log(`✅ ViewModel: Loaded ${users.length} users from database`);
      
      return users;
    } catch (error) {
      console.error('❌ ViewModel: Failed to load users from database:', error);
      this.setError(error.message);
      return [];
    } finally {
      this.setLoading(false);
    }
  }

  // Get random user for widget
  async getRandomUserForWidget() {
    try {
      console.log('🎲 ViewModel: Getting random user for widget...');
      const user = await getRandomUser();
      console.log('✅ ViewModel: Random user retrieved:', user);
      return user;
    } catch (error) {
      console.error('❌ ViewModel: Failed to get random user:', error);
      throw error;
    }
  }

  // Initialize app data (database + API sync)
  async initializeAppData() {
    try {
      console.log('🚀 ViewModel: Initializing app data...');
      
      // Step 1: Initialize database
      const dbInitialized = await this.initializeDatabase();
      if (!dbInitialized) {
        throw new Error('Database initialization failed');
      }

      // Step 2: Check if we have existing users
      const existingUsers = await this.loadUsersFromDB();
      
      // Step 3: If no users exist, sync from API
      if (existingUsers.length === 0) {
        console.log('📥 ViewModel: No users found, syncing from API...');
        const syncResult = await this.syncFromAPI();
        
        if (!syncResult.success) {
          throw new Error(`API sync failed: ${syncResult.error}`);
        }
      } else {
        console.log(`📊 ViewModel: Found ${existingUsers.length} existing users`);
      }

      console.log('✅ ViewModel: App data initialization complete');
      return true;
    } catch (error) {
      console.error('❌ ViewModel: App data initialization failed:', error);
      this.setError(error.message);
      return false;
    }
  }

  // Refresh data from API
  async refreshFromAPI() {
    console.log('🔄 ViewModel: Refreshing data from API...');
    return await this.syncFromAPI();
  }

  // Get user count
  getUserCount() {
    return this.users.length;
  }

  // Check if data is available
  hasData() {
    return this.users.length > 0;
  }

  // Check if sync is needed (e.g., data is older than 1 hour)
  needsSync() {
    if (!this.lastSyncTime) return true;
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    return (Date.now() - this.lastSyncTime.getTime()) > oneHour;
  }
}

// Create singleton instance
const userViewModel = new UserViewModel();

// React hook for using the ViewModel
export const useUserViewModel = () => {
  const [state, setState] = useState(userViewModel.getState());

  useEffect(() => {
    const unsubscribe = userViewModel.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    ...state,
    viewModel: userViewModel,
  };
};

export default userViewModel;