import ApiService from '../services/ApiService';
import DatabaseService from '../services/DatabaseService';
import WidgetDataService from '../services/WidgetDataService';

class TestWidget {
  static async runFullTest() {
    console.log('🧪 Starting Widget Test Suite...');
    
    try {
      // Test 1: API Connection
      console.log('📡 Test 1: API Connection');
      const apiResult = await ApiService.fetchAllUsers();
      console.log('✅ API Result:', apiResult.success ? 'SUCCESS' : 'FAILED');
      if (!apiResult.success) {
        console.error('❌ API Error:', apiResult.error);
        return false;
      }
      
      // Test 2: Database Operations
      console.log('💾 Test 2: Database Operations');
      const dbInit = await DatabaseService.initDatabase();
      console.log('✅ DB Init:', dbInit.success ? 'SUCCESS' : 'FAILED');
      
      if (apiResult.users && apiResult.users.length > 0) {
        const insertResult = await DatabaseService.insertUsers(apiResult.users);
        console.log('✅ DB Insert:', insertResult.success ? 'SUCCESS' : 'FAILED');
        
        const getUsersResult = await DatabaseService.getAllUsers();
        console.log('✅ DB Get Users:', getUsersResult.success ? `SUCCESS (${getUsersResult.users.length} users)` : 'FAILED');
        
        const randomUserResult = await DatabaseService.getRandomUser();
        console.log('✅ DB Random User:', randomUserResult.success ? 'SUCCESS' : 'FAILED');
        if (randomUserResult.success) {
          console.log('👤 Random User:', {
            id: randomUserResult.user.id,
            name: randomUserResult.user.fullName,
            avatar: randomUserResult.user.avatar,
          });
        }
      }
      
      // Test 3: Widget Data Service
      console.log('🔧 Test 3: Widget Data Service');
      const widgetUpdateResult = await WidgetDataService.updateWidgetData();
      console.log('✅ Widget Update:', widgetUpdateResult.success ? 'SUCCESS' : 'FAILED');
      
      const widgetGetResult = await WidgetDataService.getWidgetData();
      console.log('✅ Widget Get:', widgetGetResult.success ? 'SUCCESS' : 'FAILED');
      
      const altWidgetResult = await WidgetDataService.getRandomUserForWidget();
      console.log('✅ Widget Alt Method:', altWidgetResult.success ? 'SUCCESS' : 'FAILED');
      
      // Test 4: Image URLs
      console.log('🖼️ Test 4: Image URLs');
      if (apiResult.users && apiResult.users.length > 0) {
        const testUser = apiResult.users[0];
        try {
          const imageResponse = await fetch(testUser.avatar, { method: 'HEAD' });
          console.log('✅ Image URL Test:', imageResponse.ok ? 'SUCCESS' : 'FAILED');
          console.log('📊 Image Status:', imageResponse.status);
        } catch (imageError) {
          console.log('❌ Image URL Test: FAILED');
          console.error('Image Error:', imageError.message);
        }
      }
      
      console.log('🎉 Widget Test Suite Completed Successfully!');
      return true;
      
    } catch (error) {
      console.error('💥 Widget Test Suite Failed:', error);
      return false;
    }
  }

  static async quickTest() {
    console.log('⚡ Quick Widget Test...');
    
    try {
      // Just test the essential widget functionality
      const result = await WidgetDataService.getRandomUserForWidget();
      
      if (result.success && result.user) {
        console.log('✅ Widget Quick Test: SUCCESS');
        console.log('👤 User Data:', {
          id: result.user.id,
          name: result.user.name,
          hasAvatar: !!result.user.avatar,
        });
        return true;
      } else {
        console.log('❌ Widget Quick Test: FAILED');
        console.log('Error:', result.error);
        return false;
      }
    } catch (error) {
      console.log('💥 Widget Quick Test: ERROR');
      console.error('Error:', error);
      return false;
    }
  }
}

export default TestWidget;