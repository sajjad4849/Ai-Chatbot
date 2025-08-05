# Task 7: Local DB, Web Services, MVVM & Widget

React Native app implementing MVVM architecture with API handling and widget functionality.

## Task Requirements Implementation

✅ **3-Second Splash Screen** - Professional animated splash screen  
✅ **Main Screen (Home.js)** - Fetches and displays users from API  
✅ **Local SQLite Database** - Stores user data locally  
✅ **User List with FlatList** - Shows avatar and name for each user  
✅ **Widget Implementation** - Displays random user from local DB  
✅ **MVVM Architecture** - Clean separation of concerns  

## Features

- 🕐 **3-Second Splash Screen** as per task requirement
- 🏗️ **MVVM Architecture** (Models, Views, ViewModels, Services)
- 📱 **Home Screen Widget** showing random user data
- 🔄 **SQLite Database** for local data persistence
- 🌐 **API Integration** with https://reqres.in/api/users
- 🖼️ **Image Loading** with progress indicators for avatars
- 📋 **FlatList** displaying user name and avatar

## Quick Start

1. Install dependencies: `npm install`
2. iOS setup: `cd ios && pod install && cd ..`
3. Run the app: `npx react-native run-ios` or `npx react-native run-android`

## App Flow

1. **Splash Screen** (3 seconds) → **Home Screen**
2. **Home Screen** displays user list with avatars and names
3. **Widget** shows random user from local database
4. **Pull to refresh** updates data from API

See `SETUP_INSTRUCTIONS.md` for detailed information.