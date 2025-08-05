import SQLite from 'react-native-sqlite-storage';
import { User } from '../models/User';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

class DatabaseService {
  constructor() {
    this.database = null;
  }

  async initDB() {
    try {
      this.database = await SQLite.openDatabase({
        name: 'UserDB.db',
        location: 'default',
      });
      
      await this.createTable();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        email TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        avatar TEXT NOT NULL
      )
    `;
    
    try {
      await this.database.executeSql(query);
      console.log('Users table created successfully');
    } catch (error) {
      console.error('Create table failed:', error);
      throw error;
    }
  }

  async saveUsers(users) {
    try {
      // Clear existing data
      await this.database.executeSql('DELETE FROM users');
      
      // Insert new data
      for (const user of users) {
        const query = `
          INSERT INTO users (id, email, first_name, last_name, avatar)
          VALUES (?, ?, ?, ?, ?)
        `;
        await this.database.executeSql(query, [
          user.id,
          user.email,
          user.first_name,
          user.last_name,
          user.avatar
        ]);
      }
      console.log('Users saved successfully');
    } catch (error) {
      console.error('Save users failed:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const results = await this.database.executeSql('SELECT * FROM users ORDER BY id');
      const users = [];
      
      for (let i = 0; i < results[0].rows.length; i++) {
        const row = results[0].rows.item(i);
        users.push(User.fromDatabase(row));
      }
      
      return users;
    } catch (error) {
      console.error('Get all users failed:', error);
      throw error;
    }
  }

  async getRandomUser() {
    try {
      const results = await this.database.executeSql('SELECT * FROM users ORDER BY RANDOM() LIMIT 1');
      
      if (results[0].rows.length > 0) {
        const row = results[0].rows.item(0);
        return User.fromDatabase(row);
      }
      
      return null;
    } catch (error) {
      console.error('Get random user failed:', error);
      throw error;
    }
  }

  async closeDB() {
    if (this.database) {
      await this.database.close();
      console.log('Database closed');
    }
  }
}

export default new DatabaseService();