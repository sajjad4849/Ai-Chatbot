# React Native User Widget App - Setup Instructions

## Installation

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. iOS Setup

```bash
cd ios
pod install
cd ..
```

### 3. Android Setup

Make sure you have Android SDK and React Native development environment set up.

## Running the App

### iOS
```bash
npx react-native run-ios
```

### Android
```bash
npx react-native run-android
```

## Widget Implementation

### Key Features Implemented:

1. **MVVM Architecture**
   - Models: `User.js`
   - ViewModels: `HomeViewModel.js`
   - Views: `Home.js`, `UserWidget.js`
   - Services: `ApiService.js`, `DatabaseService.js`, `WidgetDataService.js`

2. **Professional Splash Screen**
   - Advanced splash with real initialization progress
   - Animated logo and progress bar
   - Shows actual app setup steps
   - Smooth transitions to main app

3. **API Integration**
   - Fetches users from https://reqres.in/api/users
   - Handles pagination automatically
   - Error handling and retry logic

4. **Local Database (SQLite)**
   - Stores user data locally
   - Provides offline access
   - Random user selection for widget

5. **Widget Implementation**
   - Displays random user with avatar and name
   - Refresh functionality
   - Proper error handling
   - Image loading indicators

## Widget Troubleshooting

### If Widget Not Showing Data:

1. **Check Console Logs**
   - Use the debug buttons in the app
   - Look for error messages in console

2. **Verify Database**
   - Ensure users are fetched from API
   - Check if data is stored in SQLite

3. **Test Widget Data Service**
   - Use `TestWidget.runFullTest()` for comprehensive testing
   - Check shared preferences functionality

### Common Issues & Solutions:

#### Issue: Avatar/Name Not Displaying
**Solution:**
1. Tap "Quick Test" button to verify data flow
2. Check console for detailed error messages
3. Ensure network connection is available
4. Verify image URLs are accessible

#### Issue: Widget Not Updating
**Solution:**
1. Tap the widget to refresh manually
2. Check if database has users
3. Verify WidgetDataService is working

#### Issue: Images Not Loading
**Solution:**
1. Check network permissions
2. Verify image URLs from reqres.in
3. Try alternative image component (see troubleshooting guide)

## Testing the Widget

### Using Debug Buttons:
1. **Quick Test**: Tests basic widget functionality
2. **Full Test**: Comprehensive test of all components

### Manual Testing:
1. Launch the app
2. Wait for users to load
3. Check the widget section shows a random user
4. Tap widget to refresh
5. Verify avatar and name display correctly

## Project Structure

```
src/
├── components/
│   └── UserItem.js          # Individual user list item
├── models/
│   └── User.js              # User data model
├── screens/
│   ├── Home.js              # Main screen
│   ├── SplashScreen.js      # Simple splash screen
│   └── AdvancedSplashScreen.js # Advanced splash with progress
├── services/
│   ├── ApiService.js        # API communication
│   ├── DatabaseService.js   # SQLite operations
│   └── WidgetDataService.js # Widget data management
├── utils/
│   ├── TestWidget.js        # Testing utilities
│   └── WidgetDebugger.js    # Debugging helpers
├── viewmodels/
│   └── HomeViewModel.js     # Home screen logic
└── widgets/
    ├── UserWidget.js        # Main widget component
    └── WidgetProvider.js    # Widget provider
```

## Key Fixes Applied

1. **Proper Data Flow**: Widget gets data from database or shared preferences
2. **Error Handling**: Comprehensive error handling throughout
3. **Image Loading**: Progress indicators and error handling for images
4. **Debug Tools**: Built-in testing and debugging utilities
5. **Fallback Mechanisms**: Multiple ways to get widget data
6. **Logging**: Detailed console logging for troubleshooting

## Next Steps

1. Run the app and check console logs
2. Use debug buttons to test functionality
3. Verify widget displays random user data
4. Test refresh functionality
5. Check image loading works properly

If you encounter any issues, check the `WIDGET_TROUBLESHOOTING.md` file for detailed solutions.