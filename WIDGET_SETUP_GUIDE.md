# React Native Widget Setup Guide

This guide will help you set up the React Native widget to display random user data from your local SQLite database.

## Project Structure

```
UserListApp/
├── src/
│   ├── models/
│   │   └── User.js                    # User data model
│   ├── services/
│   │   ├── ApiService.js              # API service for fetching users
│   │   ├── DatabaseService.js         # SQLite database service
│   │   ├── WidgetService.js           # Main widget service
│   │   └── AndroidWidgetBridge.js     # Android widget bridge
│   ├── viewmodels/
│   │   └── UserViewModel.js           # MVVM view model
│   ├── screens/
│   │   └── Home.js                    # Main home screen
│   ├── components/
│   │   └── UserItem.js                # User list item component
│   └── widgets/
│       └── UserWidget.js              # React Native widget component
├── ios/
│   └── UserListAppWidget/
│       ├── UserListAppWidget.swift    # iOS widget implementation
│       └── Info.plist                 # iOS widget configuration
├── android/
│   └── app/src/main/
│       ├── java/com/userlistapp/widget/
│       │   └── UserWidgetProvider.java # Android widget provider
│       ├── res/
│       │   ├── layout/
│       │   │   └── user_widget.xml    # Android widget layout
│       │   ├── drawable/
│       │   │   ├── widget_background.xml
│       │   │   └── circle_background.xml
│       │   ├── xml/
│       │   │   └── user_widget_info.xml # Android widget config
│       │   └── values/
│       │       └── strings.xml        # String resources
│       └── AndroidManifest.xml        # Updated manifest
└── App.js                             # Main app component
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

Key dependencies:
- `react-native-sqlite-storage`: SQLite database
- `react-native-fast-image`: Optimized image loading
- `react-native-shared-group-preferences`: iOS data sharing
- `@react-native-async-storage/async-storage`: Data persistence

### 2. iOS Widget Setup

#### Step 1: Add Widget Extension Target
1. Open your project in Xcode
2. Go to File → New → Target
3. Choose "Widget Extension"
4. Name it "UserListAppWidget"
5. Set Bundle Identifier: `com.userlistapp.widget`

#### Step 2: Configure App Groups
1. Select your main app target
2. Go to Signing & Capabilities
3. Add "App Groups" capability
4. Create group: `group.com.userlistapp.widget`
5. Repeat for widget extension target

#### Step 3: Add Widget Code
- Replace the generated widget code with the Swift code from `ios/UserListAppWidget/UserListAppWidget.swift`

### 3. Android Widget Setup

#### Step 1: Update AndroidManifest.xml
The manifest has been updated to include the widget provider.

#### Step 2: Add Widget Resources
All necessary Android resources have been created:
- Layout files in `res/layout/`
- Drawable resources in `res/drawable/`
- Widget configuration in `res/xml/`
- String resources in `res/values/`

### 4. React Native Integration

#### Key Components:

1. **WidgetService**: Main service for widget data management
2. **AndroidWidgetBridge**: Android-specific widget communication
3. **UserViewModel**: Automatically updates widget when data changes

#### How It Works:

1. App fetches users from API (`https://reqres.in/api/users`)
2. Users are stored in SQLite database
3. Widget service gets random user from database
4. Data is shared with native widgets:
   - iOS: Uses App Groups and SharedGroupPreferences
   - Android: Uses AsyncStorage and widget provider

## Widget Features

### Display Elements:
- **User Avatar**: Circular image with loading indicator
- **User Name**: Full name from first_name + last_name
- **Last Updated**: Timestamp of last data refresh

### Functionality:
- **Auto Refresh**: Widget updates every 15 minutes
- **Tap to Open**: Tapping widget opens the main app
- **Random Selection**: Shows different random user each time

## Troubleshooting

### Common Issues:

1. **Widget Not Showing Data**:
   - Ensure app has fetched and stored users first
   - Check console logs for widget service errors
   - Verify database has users stored

2. **iOS Widget Issues**:
   - Verify App Groups are configured correctly
   - Check bundle identifiers match
   - Ensure widget extension is added to project

3. **Android Widget Issues**:
   - Verify widget provider is declared in manifest
   - Check widget layout files are correct
   - Ensure AsyncStorage permissions

### Debug Steps:

1. **Check Data Flow**:
   ```javascript
   // In your app, check if data is being stored
   import DatabaseService from './src/services/DatabaseService';
   
   const users = await DatabaseService.getAllUsers();
   console.log('Stored users:', users.length);
   
   const randomUser = await DatabaseService.getRandomUser();
   console.log('Random user for widget:', randomUser);
   ```

2. **Test Widget Service**:
   ```javascript
   import WidgetService from './src/services/WidgetService';
   
   const widgetData = await WidgetService.updateWidgetData();
   console.log('Widget data:', widgetData);
   ```

## Key Files to Focus On

If you're having widget display issues, check these files:

1. **`src/services/WidgetService.js`** - Main widget logic
2. **`src/services/DatabaseService.js`** - Ensure `getRandomUser()` works
3. **iOS: `ios/UserListAppWidget/UserListAppWidget.swift`** - iOS widget display
4. **Android: `android/app/src/main/java/com/userlistapp/widget/UserWidgetProvider.java`** - Android widget display

## Testing the Widget

1. **Run the App**:
   ```bash
   npx react-native run-ios
   # or
   npx react-native run-android
   ```

2. **Add Widget to Home Screen**:
   - iOS: Long press home screen → Add Widget → Find "Random User"
   - Android: Long press home screen → Widgets → Find "UserListApp"

3. **Verify Data Flow**:
   - Open app and ensure users are loaded
   - Check that widget shows user data
   - Test widget refresh functionality

## Next Steps

1. Run the app and fetch users from the API
2. Add the widget to your device's home screen
3. Check that random user data appears in the widget
4. Test refresh functionality by pulling to refresh in the app

The widget should now display a random user with their avatar and name, updating automatically as you refresh the app data.