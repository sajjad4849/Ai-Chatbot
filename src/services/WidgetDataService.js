import SharedGroupPreferences from 'react-native-shared-group-preferences';
import DatabaseService from './DatabaseService';

const APP_GROUP_ID = 'group.com.userwidgetapp.shared';
const WIDGET_DATA_KEY = 'widget_user_data';

class WidgetDataService {
  static async updateWidgetData() {
    try {
      // Get a random user from the database
      const result = await DatabaseService.getRandomUser();
      
      if (result.success && result.user) {
        const widgetData = {
          id: result.user.id,
          name: result.user.fullName,
          avatar: result.user.avatar,
          email: result.user.email,
          lastUpdated: new Date().toISOString(),
        };

        // Save to shared preferences for widget access
        await SharedGroupPreferences.setItem(WIDGET_DATA_KEY, widgetData, APP_GROUP_ID);
        
        console.log('Widget data updated:', widgetData);
        return { success: true, data: widgetData };
      } else {
        console.log('No user found for widget');
        return { success: false, error: 'No user found' };
      }
    } catch (error) {
      console.error('Update widget data error:', error);
      return { success: false, error: error.message };
    }
  }

  static async getWidgetData() {
    try {
      const data = await SharedGroupPreferences.getItem(WIDGET_DATA_KEY, APP_GROUP_ID);
      return { success: true, data };
    } catch (error) {
      console.error('Get widget data error:', error);
      return { success: false, error: error.message, data: null };
    }
  }

  static async clearWidgetData() {
    try {
      await SharedGroupPreferences.removeItem(WIDGET_DATA_KEY, APP_GROUP_ID);
      return { success: true };
    } catch (error) {
      console.error('Clear widget data error:', error);
      return { success: false, error: error.message };
    }
  }

  // Alternative method using direct database access for widget
  static async getRandomUserForWidget() {
    try {
      // Initialize database if not already done
      await DatabaseService.initDatabase();
      
      // Get random user
      const result = await DatabaseService.getRandomUser();
      
      if (result.success && result.user) {
        return {
          success: true,
          user: {
            id: result.user.id,
            name: result.user.fullName,
            avatar: result.user.avatar,
            email: result.user.email,
          }
        };
      } else {
        return { success: false, error: 'No user found', user: null };
      }
    } catch (error) {
      console.error('Get random user for widget error:', error);
      return { success: false, error: error.message, user: null };
    }
  }
}

export default WidgetDataService;