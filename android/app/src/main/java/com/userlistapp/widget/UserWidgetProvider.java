package com.userlistapp.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONObject;
import com.userlistapp.R;
import com.userlistapp.MainActivity;

public class UserWidgetProvider extends AppWidgetProvider {
    
    private static final String WIDGET_DATA_KEY = "widget_user_data";
    private static final String PREFS_NAME = "UserListAppPrefs";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.user_widget);
        
        try {
            // Get user data from shared preferences
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            String userData = prefs.getString(WIDGET_DATA_KEY, null);
            
            if (userData != null) {
                JSONObject userJson = new JSONObject(userData);
                String name = userJson.getString("name");
                String avatarUrl = userJson.getString("avatar");
                String lastUpdated = userJson.getString("lastUpdated");
                
                // Set user name
                views.setTextViewText(R.id.widget_user_name, name);
                views.setTextViewText(R.id.widget_last_updated, "Updated: " + formatDate(lastUpdated));
                
                // Load avatar image asynchronously
                new LoadImageTask(views, appWidgetManager, appWidgetId, context).execute(avatarUrl);
                
            } else {
                views.setTextViewText(R.id.widget_user_name, "No Data");
                views.setTextViewText(R.id.widget_last_updated, "Tap to refresh");
                views.setImageViewResource(R.id.widget_avatar, R.drawable.placeholder_avatar);
            }
            
        } catch (Exception e) {
            views.setTextViewText(R.id.widget_user_name, "Error");
            views.setTextViewText(R.id.widget_last_updated, "Failed to load data");
            views.setImageViewResource(R.id.widget_avatar, R.drawable.placeholder_avatar);
        }
        
        // Set up click intent to open the app
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);
        
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
    
    private static String formatDate(String isoDate) {
        try {
            // Simple date formatting - you can enhance this
            return isoDate.substring(0, 10); // Just return the date part
        } catch (Exception e) {
            return "Unknown";
        }
    }
    
    private static class LoadImageTask extends AsyncTask<String, Void, Bitmap> {
        private RemoteViews views;
        private AppWidgetManager appWidgetManager;
        private int appWidgetId;
        private Context context;
        
        public LoadImageTask(RemoteViews views, AppWidgetManager appWidgetManager, int appWidgetId, Context context) {
            this.views = views;
            this.appWidgetManager = appWidgetManager;
            this.appWidgetId = appWidgetId;
            this.context = context;
        }
        
        @Override
        protected Bitmap doInBackground(String... urls) {
            String imageUrl = urls[0];
            try {
                URL url = new URL(imageUrl);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setDoInput(true);
                connection.connect();
                InputStream input = connection.getInputStream();
                return BitmapFactory.decodeStream(input);
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
        
        @Override
        protected void onPostExecute(Bitmap bitmap) {
            if (bitmap != null) {
                views.setImageViewBitmap(R.id.widget_avatar, bitmap);
            } else {
                views.setImageViewResource(R.id.widget_avatar, R.drawable.placeholder_avatar);
            }
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}