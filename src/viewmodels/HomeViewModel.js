import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import DatabaseService from '../services/DatabaseService';

export const useHomeViewModel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Initialize database
      const dbResult = await DatabaseService.initDatabase();
      if (!dbResult.success) {
        throw new Error(dbResult.error);
      }

      // Load users from local database first
      await loadUsersFromDatabase();

      // Fetch fresh data from API
      await fetchAndStoreUsers();
    } catch (err) {
      console.error('Initialize data error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsersFromDatabase = async () => {
    try {
      const result = await DatabaseService.getAllUsers();
      if (result.success) {
        setUsers(result.users);
      }
    } catch (err) {
      console.error('Load users from database error:', err);
    }
  };

  const fetchAndStoreUsers = async () => {
    try {
      const apiResult = await ApiService.fetchAllUsers();
      if (apiResult.success) {
        // Store in database
        const dbResult = await DatabaseService.insertUsers(apiResult.users);
        if (dbResult.success) {
          // Update UI with fresh data
          setUsers(apiResult.users);
        }
      } else {
        throw new Error(apiResult.error);
      }
    } catch (err) {
      console.error('Fetch and store users error:', err);
      // Don't set error if we already have users from database
      if (users.length === 0) {
        setError(err.message);
      }
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    setError(null);

    try {
      await fetchAndStoreUsers();
    } catch (err) {
      console.error('Refresh data error:', err);
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const getRandomUser = async () => {
    try {
      const result = await DatabaseService.getRandomUser();
      return result;
    } catch (err) {
      console.error('Get random user error:', err);
      return { success: false, error: err.message, user: null };
    }
  };

  return {
    users,
    loading,
    error,
    refreshing,
    refreshData,
    getRandomUser,
  };
};