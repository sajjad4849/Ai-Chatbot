# Widget Troubleshooting Guide

## Common Issues and Solutions

### 1. Widget Not Showing Avatar/Name

**Possible Causes:**
- Database not initialized
- No users in database
- Image loading issues
- Shared preferences not working
- App group configuration missing

**Solutions:**

#### Check Database Status
```javascript
// Add this to your Home screen to debug
import WidgetDebugger from '../utils/WidgetDebugger';

// In your component
useEffect(() => {
  WidgetDebugger.debugWidgetData();
  WidgetDebugger.testImageUrls();
}, []);
```

#### Verify App Group Configuration
1. Check `ios/UserWidgetApp/Info.plist` contains:
```xml
<key>com.apple.security.application-groups</key>
<array>
    <string>group.com.userwidgetapp.shared</string>
</array>
```

2. Ensure the App Group ID matches in `WidgetDataService.js`:
```javascript
const APP_GROUP_ID = 'group.com.userwidgetapp.shared';
```

#### Force Widget Data Update
```javascript
// In your Home screen, add a button to manually update widget data
const forceUpdateWidget = async () => {
  const result = await WidgetDataService.updateWidgetData();
  console.log('Force update result:', result);
};
```

### 2. Image Not Loading

**Check Image URLs:**
- Verify images are accessible from reqres.in
- Check network permissions
- Ensure FastImage is properly configured

**Alternative Image Component:**
If FastImage doesn't work, try using regular Image:
```javascript
import { Image } from 'react-native';

// Replace FastImage with:
<Image
  source={{ uri: user.avatar }}
  style={styles.avatar}
  onLoadStart={() => setImageLoading(true)}
  onLoadEnd={() => setImageLoading(false)}
  onError={(error) => {
    setImageLoading(false);
    console.log('Image load error:', error);
  }}
/>
```

### 3. Database Issues

**Reinitialize Database:**
```javascript
// Clear and reinitialize database
const resetDatabase = async () => {
  await DatabaseService.database?.close();
  DatabaseService.database = null;
  await DatabaseService.initDatabase();
};
```

### 4. Widget Not Updating

**Manual Refresh:**
```javascript
// Add refresh functionality
const refreshWidget = async () => {
  // Update widget data
  await WidgetDataService.updateWidgetData();
  
  // Reload widget component
  await loadUserData();
};
```

### 5. Debugging Steps

1. **Enable Debug Logging:**
   - Check console logs for detailed error messages
   - Use WidgetDebugger to trace data flow

2. **Test API Connection:**
   ```javascript
   fetch('https://reqres.in/api/users')
     .then(response => response.json())
     .then(data => console.log('API Test:', data))
     .catch(error => console.error('API Error:', error));
   ```

3. **Verify SQLite:**
   ```javascript
   // Test database directly
   const testDB = async () => {
     const result = await DatabaseService.getAllUsers();
     console.log('All users:', result);
   };
   ```

### 6. Platform-Specific Issues

#### iOS:
- Ensure app groups are configured in Xcode
- Check widget extension permissions
- Verify shared container access

#### Android:
- Check widget provider configuration
- Verify database file permissions
- Ensure widget update service is running

### 7. Performance Optimization

```javascript
// Optimize widget updates
const optimizedLoadUserData = async () => {
  try {
    // Use cached data if available and recent
    const cachedData = await WidgetDataService.getWidgetData();
    if (cachedData.success && cachedData.data) {
      const lastUpdated = new Date(cachedData.data.lastUpdated);
      const now = new Date();
      const diffMinutes = (now - lastUpdated) / (1000 * 60);
      
      if (diffMinutes < 5) { // Use cached data if less than 5 minutes old
        setUser(cachedData.data);
        return;
      }
    }
    
    // Fetch fresh data
    await loadUserData();
  } catch (error) {
    console.error('Optimized load error:', error);
  }
};
```

## Quick Fix Checklist

- [ ] Database initialized successfully
- [ ] Users fetched from API
- [ ] Users stored in database
- [ ] App groups configured
- [ ] Widget data service working
- [ ] Images loading properly
- [ ] Console shows no errors
- [ ] Widget component renders without crashes