# Task 7: Local DB, Web Services, MVVM & Widget

A well-structured React Native app using **MVVM architecture**, **API handling**, and a **widget** to display stored data from reqres.in API.

## 🚀 Features

### 1️⃣ Main Screen (Home.js)
- ✅ **API Integration**: Fetches data from https://reqres.in/api/users
- ✅ **SQLite Database**: Stores user data locally (name, avatar, email)
- ✅ **FlatList Display**: Shows users with avatar and name
- ✅ **Progress Indicators**: Loading states for avatar images
- ✅ **Pull to Refresh**: Sync latest data from API
- ✅ **MVVM Architecture**: Clean separation of concerns

### 2️⃣ Home Screen Widget
- ✅ **Random User Display**: Shows one random user from local DB
- ✅ **Auto-refresh**: Updates every 30 seconds
- ✅ **Avatar Support**: Displays user avatars with fallback to initials
- ✅ **Manual Refresh**: Tap widget to update immediately
- ✅ **Error Handling**: Robust fallbacks and API sync

### 🏗️ Architecture
- ✅ **MVVM Pattern**: ViewModel manages business logic
- ✅ **API Service**: Centralized API handling
- ✅ **SQLite Service**: Database operations
- ✅ **Widget Service**: Widget lifecycle management

## 📱 Screenshots

The widget displays:
- User avatar (or initials if no avatar)
- User name
- Clean, modern design
- Automatic updates

## 🛠️ Setup Instructions

### Prerequisites

- Node.js >= 16
- React Native development environment
- Android Studio
- Android device or emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd random-user-widget
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies (if needed)**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the application**
   ```bash
   # Start Metro bundler
   npm start

   # Run on Android
   npm run android
   ```

### Widget Setup

1. **Build and install the app** on your Android device
2. **Long press** on your home screen
3. Select **"Widgets"** from the menu
4. Find **"Random User Widget"**
5. **Drag and drop** it to your home screen
6. The widget will start showing random users immediately

## 📁 Project Structure

```
src/
├── components/
│   ├── HomeWidget.js      # In-app widget component
│   └── AppWidget.js       # Preview component for testing
├── widgets/
│   └── AppWidget.js       # Actual Android widget component
├── db/
│   └── SQLiteService.js   # Database operations
└── services/
    └── WidgetService.js   # Widget management service

App.js                     # Main application component
index.js                   # Entry point with widget registration
package.json              # Dependencies and scripts
```

## 🔧 Key Components

### 1. SQLiteService (`src/db/SQLiteService.js`)
- Manages user database
- Provides sample data with avatars
- Handles random user selection
- Includes fallback mechanisms

### 2. WidgetService (`src/services/WidgetService.js`)
- Manages widget lifecycle
- Handles periodic updates
- Provides manual refresh functionality
- Error handling and fallbacks

### 3. AppWidget (`src/widgets/AppWidget.js`)
- Android widget component using `react-native-android-widget`
- Displays avatar and name
- Handles click events
- Responsive design

### 4. Preview Components
- `HomeWidget.js`: In-app display component
- `AppWidget.js` (in components): Testing and preview component

## 🎯 Widget Features

### Automatic Updates
- Updates every 30 seconds automatically
- Shows different random users each time
- Maintains smooth transitions

### Manual Updates
- Tap the widget to force an immediate update
- In-app "Force Update" button for testing
- Click handling for user interaction

### Error Handling
- Fallback to initials when avatar fails to load
- Database connection error handling
- Network timeout handling for avatar loading
- Default user data when database is empty

### Avatar Display
- High-quality avatar images from randomuser.me
- Circular avatar design
- Fallback to user initials with colored background
- Loading indicators during image fetch

## 🐛 Troubleshooting

### Widget Not Appearing
1. Ensure the app is installed and has been opened at least once
2. Check that widget permissions are granted
3. Try restarting the device
4. Rebuild and reinstall the app

### Avatar Images Not Loading
1. Check internet connection
2. Verify avatar URLs in database
3. Check network permissions in AndroidManifest.xml
4. Images will fallback to initials automatically

### Database Issues
1. App includes sample data as fallback
2. Database will auto-initialize on first run
3. Clear app data to reset database if needed

### Widget Not Updating
1. Check if app is running in background
2. Verify update intervals in WidgetService
3. Force update using in-app button
4. Check Android battery optimization settings

## 📦 Dependencies

### Main Dependencies
- `react-native`: Core framework
- `react-native-sqlite-storage`: Database management
- `react-native-android-widget`: Widget functionality

### Sample Data
The app includes 10 sample users with avatars from randomuser.me:
- Alice Johnson, Bob Smith, Carol Davis, etc.
- Each with unique avatar images
- Stored in SQLite database on app initialization

## 🔄 Update Mechanism

1. **App Launch**: Database initializes with sample data
2. **Widget Registration**: Widget registers with Android system
3. **Periodic Updates**: Every 30 seconds, widget fetches new random user
4. **Manual Updates**: User can tap widget or use in-app button
5. **Background Updates**: Continues even when app is closed

## 🎨 Customization

### Changing Update Interval
Edit `UPDATE_INTERVAL` in `src/services/WidgetService.js`:
```javascript
const UPDATE_INTERVAL = 30000; // 30 seconds
```

### Adding More Users
Add users to the `sampleUsers` array in `src/db/SQLiteService.js`:
```javascript
{
  id: 11,
  name: 'New User',
  avatar: 'https://example.com/avatar.jpg'
}
```

### Styling the Widget
Modify styles in `src/widgets/AppWidget.js` using the FlexWidget API.

## 📄 License

MIT License - See LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review console logs for error messages
3. Ensure all dependencies are properly installed
4. Verify Android development environment setup

---

**Task_7 - Bitbucket Implementation Complete** ✅