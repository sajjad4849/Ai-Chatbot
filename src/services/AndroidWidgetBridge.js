import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AndroidWidgetBridge {
  constructor() {
    this.widgetDataKey = 'widget_user_data';
  }

  // Update widget data and trigger widget refresh
  async updateWidget(userData) {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      // Store data in AsyncStorage for widget access
      await AsyncStorage.setItem(this.widgetDataKey, JSON.stringify(userData));
      
      // Trigger widget update via native module (if available)
      if (NativeModules.WidgetModule) {
        NativeModules.WidgetModule.updateWidget();
      }
      
      console.log('Android widget updated with data:', userData);
    } catch (error) {
      console.error('Failed to update Android widget:', error);
    }
  }

  // Get widget data
  async getWidgetData() {
    if (Platform.OS !== 'android') {
      return null;
    }

    try {
      const dataString = await AsyncStorage.getItem(this.widgetDataKey);
      return dataString ? JSON.parse(dataString) : null;
    } catch (error) {
      console.error('Failed to get Android widget data:', error);
      return null;
    }
  }
}

export default new AndroidWidgetBridge();