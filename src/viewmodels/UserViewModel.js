import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import DatabaseService from '../services/DatabaseService';
import WidgetService from '../services/WidgetService';

export const useUserViewModel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      await DatabaseService.initDB();
      await loadUsersFromDatabase();
    } catch (err) {
      console.error('Initialize data failed:', err);
      setError('Failed to initialize database');
    }
  };

  const loadUsersFromDatabase = async () => {
    try {
      setLoading(true);
      const dbUsers = await DatabaseService.getAllUsers();
      
      if (dbUsers.length === 0) {
        // No users in database, fetch from API
        await fetchAndStoreUsers();
      } else {
        setUsers(dbUsers);
      }
    } catch (err) {
      console.error('Load users from database failed:', err);
      setError('Failed to load users from database');
    } finally {
      setLoading(false);
    }
  };

  const fetchAndStoreUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUsers = await ApiService.fetchAllUsers();
      await DatabaseService.saveUsers(apiUsers);
      setUsers(apiUsers);
      
      // Update widget data after storing users
      await WidgetService.updateWidgetData();
    } catch (err) {
      console.error('Fetch and store users failed:', err);
      setError('Failed to fetch users from API');
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const apiUsers = await ApiService.fetchAllUsers();
      await DatabaseService.saveUsers(apiUsers);
      setUsers(apiUsers);
      
      // Update widget data after refreshing users
      await WidgetService.updateWidgetData();
    } catch (err) {
      console.error('Refresh users failed:', err);
      setError('Failed to refresh users');
    } finally {
      setRefreshing(false);
    }
  };

  const getRandomUser = async () => {
    try {
      const randomUser = await DatabaseService.getRandomUser();
      return randomUser;
    } catch (err) {
      console.error('Get random user failed:', err);
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    refreshing,
    refreshUsers,
    getRandomUser,
    fetchAndStoreUsers
  };
};