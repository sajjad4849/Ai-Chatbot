import SQLite from 'react-native-sqlite-storage';
import { User } from '../models/User';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

class DatabaseService {
  static database = null;

  static async initDatabase() {
    try {
      this.database = await SQLite.openDatabase({
        name: 'UserDatabase.db',
        location: 'default',
      });

      await this.createTables();
      console.log('Database initialized successfully');
      return { success: true };
    } catch (error) {
      console.error('Database initialization error:', error);
      return { success: false, error: error.message };
    }
  }

  static async createTables() {
    const createUserTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        email TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        avatar TEXT NOT NULL
      );
    `;

    await this.database.executeSql(createUserTableQuery);
  }

  static async insertUsers(users) {
    try {
      await this.database.transaction(async (tx) => {
        // Clear existing users
        await tx.executeSql('DELETE FROM users');
        
        // Insert new users
        for (const user of users) {
          const userObj = user.toDbObject();
          await tx.executeSql(
            'INSERT INTO users (id, email, first_name, last_name, avatar) VALUES (?, ?, ?, ?, ?)',
            [userObj.id, userObj.email, userObj.first_name, userObj.last_name, userObj.avatar]
          );
        }
      });

      console.log('Users inserted successfully');
      return { success: true };
    } catch (error) {
      console.error('Insert users error:', error);
      return { success: false, error: error.message };
    }
  }

  static async getAllUsers() {
    try {
      const results = await this.database.executeSql('SELECT * FROM users ORDER BY id');
      const users = [];
      
      for (let i = 0; i < results[0].rows.length; i++) {
        const row = results[0].rows.item(i);
        users.push(User.fromDbObject(row));
      }

      return { success: true, users };
    } catch (error) {
      console.error('Get all users error:', error);
      return { success: false, error: error.message, users: [] };
    }
  }

  static async getRandomUser() {
    try {
      const results = await this.database.executeSql('SELECT * FROM users ORDER BY RANDOM() LIMIT 1');
      
      if (results[0].rows.length > 0) {
        const row = results[0].rows.item(0);
        const user = User.fromDbObject(row);
        return { success: true, user };
      } else {
        return { success: false, error: 'No users found', user: null };
      }
    } catch (error) {
      console.error('Get random user error:', error);
      return { success: false, error: error.message, user: null };
    }
  }

  static async getUserCount() {
    try {
      const results = await this.database.executeSql('SELECT COUNT(*) as count FROM users');
      const count = results[0].rows.item(0).count;
      return { success: true, count };
    } catch (error) {
      console.error('Get user count error:', error);
      return { success: false, count: 0 };
    }
  }
}

export default DatabaseService;