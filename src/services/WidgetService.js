import AsyncStorage from '@react-native-async-storage/async-storage';
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import DatabaseService from './DatabaseService';
import AndroidWidgetBridge from './AndroidWidgetBridge';
import { Platform } from 'react-native';

class WidgetService {
  constructor() {
    this.appGroupId = 'group.com.userlistapp.widget'; // iOS App Group ID
    this.widgetDataKey = 'widget_user_data';
  }

  // Save random user data for widget consumption
  async updateWidgetData() {
    try {
      const randomUser = await DatabaseService.getRandomUser();
      
      if (!randomUser) {
        console.log('No users available for widget');
        return;
      }

      const widgetData = {
        id: randomUser.id,
        name: randomUser.fullName,
        avatar: randomUser.avatar,
        lastUpdated: new Date().toISOString()
      };

      // For iOS - use shared group preferences
      if (Platform.OS === 'ios') {
        try {
          await SharedGroupPreferences.setItem(
            this.widgetDataKey,
            JSON.stringify(widgetData),
            this.appGroupId
          );
        } catch (error) {
          console.error('Failed to save widget data to shared preferences:', error);
        }
      }

      // For Android - use dedicated bridge service
      if (Platform.OS === 'android') {
        await AndroidWidgetBridge.updateWidget(widgetData);
      } else {
        // Fallback for other platforms
        await AsyncStorage.setItem(this.widgetDataKey, JSON.stringify(widgetData));
      }
      
      console.log('Widget data updated:', widgetData);
      return widgetData;
    } catch (error) {
      console.error('Update widget data failed:', error);
      throw error;
    }
  }

  // Get current widget data
  async getWidgetData() {
    try {
      let widgetDataString;

      // For iOS - try shared group preferences first
      if (Platform.OS === 'ios') {
        try {
          widgetDataString = await SharedGroupPreferences.getItem(
            this.widgetDataKey,
            this.appGroupId
          );
        } catch (error) {
          console.warn('Failed to get widget data from shared preferences:', error);
        }
      }

      // Fallback to AsyncStorage
      if (!widgetDataString) {
        widgetDataString = await AsyncStorage.getItem(this.widgetDataKey);
      }

      if (widgetDataString) {
        return JSON.parse(widgetDataString);
      }

      return null;
    } catch (error) {
      console.error('Get widget data failed:', error);
      return null;
    }
  }

  // Refresh widget data with a new random user
  async refreshWidgetData() {
    return await this.updateWidgetData();
  }
}

export default new WidgetService();