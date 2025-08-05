import { getRandomUser } from '../db/SQLiteService';
import { updateWidget, configureWidget } from 'react-native-android-widget';
import AppWidget from '../widgets/AppWidget';

// Widget configuration
const WIDGET_NAME = 'MyWidgetProvider';
const UPDATE_INTERVAL = 30000; // 30 seconds

let updateInterval = null;

export const initializeWidget = async () => {
  try {
    console.log('🚀 Initializing widget...');
    
    // Configure the widget
    await configureWidget({
      name: WIDGET_NAME,
      label: 'Random User Widget',
      description: 'Shows random user avatars and names',
      minWidth: 2,
      minHeight: 2,
      targetCellWidth: 2,
      targetCellHeight: 2,
      previewImage: 'widget_preview', // Make sure you have this image in your drawable resources
      updatePeriodMillis: UPDATE_INTERVAL,
      resizeMode: 'horizontal|vertical',
    });

    console.log('✅ Widget configured successfully');
    
    // Initial widget update
    await pushWidgetData();
    
    // Start periodic updates
    startPeriodicUpdates();
    
    console.log('✅ Widget initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing widget:', error);
    throw error;
  }
};

export const pushWidgetData = async () => {
  try {
    console.log('🔄 Updating widget data...');
    
    // Get random user from database
    const user = await getRandomUser();
    
    if (!user) {
      console.warn('⚠️ No user data available for widget update');
      return;
    }

    console.log('📊 User data for widget:', user);

    // Update the widget with new data
    await updateWidget({
      widgetName: WIDGET_NAME,
      renderWidget: () => (
        <AppWidget 
          name={user.name} 
          avatar={user.avatar} 
        />
      ),
      widgetNotFound: () => {
        console.warn('⚠️ Widget not found on home screen');
      },
    });

    console.log('✅ Widget updated successfully with user:', user.name);
  } catch (error) {
    console.error('❌ Error updating widget:', error);
    
    // Fallback update with default data
    try {
      await updateWidget({
        widgetName: WIDGET_NAME,
        renderWidget: () => (
          <AppWidget 
            name="Unknown User" 
            avatar="" 
          />
        ),
        widgetNotFound: () => {
          console.warn('⚠️ Widget not found on home screen');
        },
      });
      console.log('🔄 Widget updated with fallback data');
    } catch (fallbackError) {
      console.error('❌ Error with fallback widget update:', fallbackError);
    }
  }
};

export const startPeriodicUpdates = () => {
  // Clear any existing interval
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  console.log('⏰ Starting periodic widget updates every', UPDATE_INTERVAL / 1000, 'seconds');
  
  updateInterval = setInterval(async () => {
    try {
      await pushWidgetData();
    } catch (error) {
      console.error('❌ Error in periodic widget update:', error);
    }
  }, UPDATE_INTERVAL);
};

export const stopPeriodicUpdates = () => {
  if (updateInterval) {
    console.log('⏹️ Stopping periodic widget updates');
    clearInterval(updateInterval);
    updateInterval = null;
  }
};

export const forceWidgetUpdate = async () => {
  console.log('🔄 Force updating widget...');
  await pushWidgetData();
};

// Widget lifecycle methods
export const onWidgetAdded = async () => {
  console.log('➕ Widget added to home screen');
  await pushWidgetData();
  startPeriodicUpdates();
};

export const onWidgetRemoved = () => {
  console.log('➖ Widget removed from home screen');
  stopPeriodicUpdates();
};

export const onWidgetClick = async () => {
  console.log('👆 Widget clicked - updating with new random user');
  await pushWidgetData();
};

// Cleanup function
export const cleanup = () => {
  stopPeriodicUpdates();
  console.log('🧹 Widget service cleanup completed');
};