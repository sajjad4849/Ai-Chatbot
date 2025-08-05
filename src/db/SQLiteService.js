import SQLite from 'react-native-sqlite-storage';
import ApiService from '../services/ApiService';

// Enable debugging
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'UserDatabase.db';
const database_version = '1.0';
const database_displayname = 'User Database';
const database_size = 200000;

let db;

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    console.log('🔄 Initializing database...');
    SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
    )
      .then(DB => {
        db = DB;
        console.log('✅ Database opened successfully');
        createTables()
          .then(() => {
            console.log('✅ Tables created successfully');
            resolve(db);
          })
          .catch(error => {
            console.error('❌ Error creating tables:', error);
            reject(error);
          });
      })
      .catch(error => {
        console.error('❌ Error opening database:', error);
        reject(error);
      });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          avatar TEXT,
          email TEXT,
          first_name TEXT,
          last_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        [],
        () => {
          console.log('✅ Users table created successfully');
          resolve();
        },
        error => {
          console.error('❌ Error creating users table:', error);
          reject(error);
        },
      );
    });
  });
};

// Insert or update users from API
export const insertUsers = (users) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    console.log(`📊 Inserting/updating ${users.length} users...`);
    
    db.transaction(tx => {
      let completed = 0;
      let hasError = false;

      users.forEach((user) => {
        tx.executeSql(
          `INSERT OR REPLACE INTO users 
           (id, name, avatar, email, first_name, last_name, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          [user.id, user.name, user.avatar, user.email, user.first_name, user.last_name],
          () => {
            completed++;
            if (completed === users.length && !hasError) {
              console.log(`✅ All ${users.length} users inserted/updated successfully`);
              resolve();
            }
          },
          error => {
            hasError = true;
            console.error('❌ Error inserting user:', error);
            reject(error);
          },
        );
      });
    });
  });
};

// Sync users from API to local database
export const syncUsersFromAPI = async () => {
  try {
    console.log('🔄 Syncing users from API...');
    
    // Test API connection first
    const isConnected = await ApiService.testConnection();
    if (!isConnected) {
      throw new Error('API is not accessible');
    }

    // Fetch all users from API
    const apiUsers = await ApiService.fetchAllUsers();
    
    if (apiUsers.length === 0) {
      console.log('⚠️ No users received from API');
      return { success: false, message: 'No users found in API' };
    }

    // Insert users into local database
    await insertUsers(apiUsers);
    
    console.log(`✅ Successfully synced ${apiUsers.length} users from API`);
    return { success: true, count: apiUsers.length };
  } catch (error) {
    console.error('❌ Error syncing users from API:', error.message);
    throw error;
  }
};

export const getRandomUser = () => {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.log('🔄 Database not initialized, initializing now...');
      initDatabase()
        .then(() => getRandomUser())
        .then(resolve)
        .catch(reject);
      return;
    }

    console.log('🎲 Fetching random user...');
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users ORDER BY RANDOM() LIMIT 1',
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            const user = results.rows.item(0);
            console.log('✅ Random user fetched:', user);
            resolve(user);
          } else {
            console.log('⚠️ No users found in database');
            reject(new Error('No users found in database. Please sync from API first.'));
          }
        },
        error => {
          console.error('❌ Error fetching random user:', error);
          reject(error);
        },
      );
    });
  });
};

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    if (!db) {
      initDatabase()
        .then(() => getAllUsers())
        .then(resolve)
        .catch(reject);
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users',
        [],
        (tx, results) => {
          const users = [];
          for (let i = 0; i < results.rows.length; i++) {
            users.push(results.rows.item(i));
          }
          resolve(users);
        },
        error => {
          console.error('❌ Error fetching all users:', error);
          reject(error);
        },
      );
    });
  });
};

export const closeDatabase = () => {
  if (db) {
    console.log('🔒 Closing database...');
    db.close()
      .then(status => {
        console.log('✅ Database closed successfully');
      })
      .catch(error => {
        console.error('❌ Error closing database:', error);
      });
  }
};