import DatabaseService from '../services/DatabaseService';
import WidgetDataService from '../services/WidgetDataService';

class WidgetDebugger {
  static async debugWidgetData() {
    console.log('=== WIDGET DEBUG START ===');
    
    try {
      // Check database connection
      console.log('1. Checking database...');
      const dbResult = await DatabaseService.initDatabase();
      console.log('Database init result:', dbResult);
      
      // Check user count
      const countResult = await DatabaseService.getUserCount();
      console.log('User count:', countResult);
      
      // Check if we can get a random user
      console.log('2. Testing random user retrieval...');
      const randomUserResult = await DatabaseService.getRandomUser();
      console.log('Random user result:', randomUserResult);
      
      // Check widget data service
      console.log('3. Testing widget data service...');
      const widgetUpdateResult = await WidgetDataService.updateWidgetData();
      console.log('Widget update result:', widgetUpdateResult);
      
      // Check shared preferences
      console.log('4. Testing shared preferences...');
      const widgetDataResult = await WidgetDataService.getWidgetData();
      console.log('Widget data retrieval result:', widgetDataResult);
      
      // Test alternative method
      console.log('5. Testing alternative widget data method...');
      const altResult = await WidgetDataService.getRandomUserForWidget();
      console.log('Alternative method result:', altResult);
      
    } catch (error) {
      console.error('Widget debug error:', error);
    }
    
    console.log('=== WIDGET DEBUG END ===');
  }

  static async testImageUrls() {
    console.log('=== IMAGE URL TEST START ===');
    
    try {
      const users = await DatabaseService.getAllUsers();
      if (users.success && users.users.length > 0) {
        const testUser = users.users[0];
        console.log('Testing image URL:', testUser.avatar);
        
        // Test if image URL is accessible
        try {
          const response = await fetch(testUser.avatar, { method: 'HEAD' });
          console.log('Image URL response status:', response.status);
          console.log('Image URL accessible:', response.ok);
        } catch (fetchError) {
          console.error('Image URL fetch error:', fetchError);
        }
      }
    } catch (error) {
      console.error('Image URL test error:', error);
    }
    
    console.log('=== IMAGE URL TEST END ===');
  }

  static logWidgetState(componentName, state) {
    console.log(`[${componentName}] Widget State:`, {
      hasUser: !!state.user,
      loading: state.loading,
      error: state.error,
      userDetails: state.user ? {
        id: state.user.id,
        name: state.user.name,
        hasAvatar: !!state.user.avatar,
        avatarUrl: state.user.avatar,
      } : null,
    });
  }
}

export default WidgetDebugger;