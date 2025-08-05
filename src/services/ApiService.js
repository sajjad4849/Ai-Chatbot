import { User } from '../models/User';

class ApiService {
  static BASE_URL = 'https://reqres.in/api';

  static async fetchUsers(page = 1) {
    try {
      const response = await fetch(`${this.BASE_URL}/users?page=${page}`);
      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          users: data.data.map(userData => User.fromApiResponse(userData)),
          totalPages: data.total_pages,
          currentPage: data.page
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch users'
        };
      }
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async fetchAllUsers() {
    try {
      const firstPageResult = await this.fetchUsers(1);
      if (!firstPageResult.success) {
        return firstPageResult;
      }

      let allUsers = [...firstPageResult.users];
      const totalPages = firstPageResult.totalPages;

      // Fetch remaining pages
      for (let page = 2; page <= totalPages; page++) {
        const pageResult = await this.fetchUsers(page);
        if (pageResult.success) {
          allUsers = [...allUsers, ...pageResult.users];
        }
      }

      return {
        success: true,
        users: allUsers
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default ApiService;