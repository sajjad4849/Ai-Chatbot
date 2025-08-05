import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Register the main app
AppRegistry.registerComponent(appName, () => App);

// Register the widget component for react-native-android-widget
import { registerWidget } from 'react-native-android-widget';
import AppWidget from './src/widgets/AppWidget';

// Register the widget with the system
registerWidget({
  name: 'MyWidgetProvider',
  component: AppWidget,
  width: 2,
  height: 2,
});