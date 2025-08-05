import SQLite from 'react-native-sqlite-storage';

// Enable debugging
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'UserDatabase.db';
const database_version = '1.0';
const database_displayname = 'User Database';
const database_size = 200000;

let db;

// Sample users with avatars from various sources
const sampleUsers = [
  {
    id: 1,
    name: 'Alice Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: 2,
    name: 'Bob Smith',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    id: 3,
    name: 'Carol Davis',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    id: 4,
    name: 'David Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  {
    id: 5,
    name: 'Emma Brown',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg'
  },
  {
    id: 6,
    name: 'Frank Miller',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
  },
  {
    id: 7,
    name: 'Grace Lee',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg'
  },
  {
    id: 8,
    name: 'Henry Taylor',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
  },
  {
    id: 9,
    name: 'Ivy Chen',
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg'
  },
  {
    id: 10,
    name: 'Jack Anderson',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg'
  }
];

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
            insertSampleData()
              .then(() => {
                console.log('✅ Sample data inserted successfully');
                resolve(db);
              })
              .catch(error => {
                console.error('❌ Error inserting sample data:', error);
                reject(error);
              });
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
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          avatar TEXT
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

const insertSampleData = () => {
  return new Promise((resolve, reject) => {
    // First, check if data already exists
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM users',
        [],
        (tx, results) => {
          const count = results.rows.item(0).count;
          if (count > 0) {
            console.log('📊 Sample data already exists, skipping insertion');
            resolve();
            return;
          }

          // Insert sample data
          console.log('📊 Inserting sample data...');
          sampleUsers.forEach((user, index) => {
            tx.executeSql(
              'INSERT INTO users (name, avatar) VALUES (?, ?)',
              [user.name, user.avatar],
              () => {
                if (index === sampleUsers.length - 1) {
                  console.log('✅ All sample data inserted');
                  resolve();
                }
              },
              error => {
                console.error('❌ Error inserting user:', error);
                reject(error);
              },
            );
          });
        },
        error => {
          console.error('❌ Error checking existing data:', error);
          reject(error);
        },
      );
    });
  });
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
            // Fallback to sample data if database is empty
            const randomIndex = Math.floor(Math.random() * sampleUsers.length);
            const fallbackUser = sampleUsers[randomIndex];
            console.log('🔄 Using fallback user:', fallbackUser);
            resolve(fallbackUser);
          }
        },
        error => {
          console.error('❌ Error fetching random user:', error);
          // Fallback to sample data on error
          const randomIndex = Math.floor(Math.random() * sampleUsers.length);
          const fallbackUser = sampleUsers[randomIndex];
          console.log('🔄 Using fallback user due to error:', fallbackUser);
          resolve(fallbackUser);
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