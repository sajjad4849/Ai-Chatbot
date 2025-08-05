import { User } from '../models/User';

class ApiService {
  constructor() {
    this.baseUrl = 'https://reqres.in/api';
  }

  async fetchUsers(page = 1) {
    try {
      const response = await fetch(`${this.baseUrl}/users?page=${page}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert API response to User models
      const users = data.data.map(userData => User.fromApiResponse(userData));
      
      return {
        users,
        totalPages: data.total_pages,
        currentPage: data.page,
        total: data.total
      };
    } catch (error) {
      console.error('API fetch failed:', error);
      throw error;
    }
  }

  async fetchAllUsers() {
    try {
      // First, get the first page to know total pages
      const firstPageResult = await this.fetchUsers(1);
      let allUsers = [...firstPageResult.users];
      
      // Fetch remaining pages if any
      for (let page = 2; page <= firstPageResult.totalPages; page++) {
        const pageResult = await this.fetchUsers(page);
        allUsers = [...allUsers, ...pageResult.users];
      }
      
      return allUsers;
    } catch (error) {
      console.error('Fetch all users failed:', error);
      throw error;
    }
  }
}

export default new ApiService();