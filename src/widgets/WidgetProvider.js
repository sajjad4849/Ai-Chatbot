import React from 'react';
import { AppRegistry } from 'react-native';
import UserWidget from './UserWidget';
import WidgetDataService from '../services/WidgetDataService';

// Widget Provider Component
const WidgetProvider = () => {
  return <UserWidget />;
};

// Widget update function for background updates
const updateWidget = async () => {
  try {
    console.log('Updating widget data...');
    const result = await WidgetDataService.updateWidgetData();
    if (result.success) {
      console.log('Widget data updated successfully:', result.data);
    } else {
      console.log('Failed to update widget data:', result.error);
    }
  } catch (error) {
    console.error('Widget update error:', error);
  }
};

// Export for widget registration
export { WidgetProvider, updateWidget };

// Register the widget
AppRegistry.registerComponent('UserWidget', () => WidgetProvider);