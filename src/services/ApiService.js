import { Alert } from 'react-native';

const BASE_URL = 'https://reqres.in/api';

class ApiService {
  // Fetch users from reqres.in API
  static async fetchUsers(page = 1) {
    try {
      console.log(`🌐 Fetching users from API (page ${page})...`);
      
      const response = await fetch(`${BASE_URL}/users?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response received:', data);

      // Transform the API response to match our local structure
      const transformedUsers = data.data.map(user => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        avatar: user.avatar,
        email: user.email, // Additional field from API
        first_name: user.first_name,
        last_name: user.last_name,
      }));

      return {
        users: transformedUsers,
        total: data.total,
        total_pages: data.total_pages,
        page: data.page,
        per_page: data.per_page,
      };
    } catch (error) {
      console.error('❌ API Error:', error.message);
      
      // Handle different types of errors
      if (error.message.includes('Network request failed')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Request timeout. Please try again.');
      } else if (error.message.includes('HTTP error')) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error('Failed to fetch users from API.');
      }
    }
  }

  // Fetch all users from all pages
  static async fetchAllUsers() {
    try {
      console.log('🌐 Fetching all users from API...');
      let allUsers = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const response = await this.fetchUsers(currentPage);
        allUsers = [...allUsers, ...response.users];
        totalPages = response.total_pages;
        currentPage++;
        
        console.log(`📄 Fetched page ${currentPage - 1}/${totalPages}, Total users: ${allUsers.length}`);
      } while (currentPage <= totalPages);

      console.log(`✅ All users fetched successfully. Total: ${allUsers.length}`);
      return allUsers;
    } catch (error) {
      console.error('❌ Error fetching all users:', error.message);
      throw error;
    }
  }

  // Test API connectivity
  static async testConnection() {
    try {
      console.log('🔍 Testing API connection...');
      const response = await fetch(`${BASE_URL}/users?page=1`, {
        method: 'HEAD', // Just check if endpoint is reachable
        timeout: 5000,
      });
      
      const isConnected = response.ok;
      console.log(`🌐 API Connection: ${isConnected ? 'SUCCESS' : 'FAILED'}`);
      return isConnected;
    } catch (error) {
      console.error('❌ API Connection test failed:', error.message);
      return false;
    }
  }

  // Get user by ID
  static async getUserById(userId) {
    try {
      console.log(`🔍 Fetching user ${userId} from API...`);
      
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const user = data.data;

      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        avatar: user.avatar,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      };
    } catch (error) {
      console.error(`❌ Error fetching user ${userId}:`, error.message);
      throw error;
    }
  }
}

export default ApiService;