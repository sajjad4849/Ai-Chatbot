import React from 'react';
import { FlexWidget, TextWidget, ImageWidget } from 'react-native-android-widget';

const AppWidget = ({ name, avatar }) => {
  const hasAvatar = avatar && avatar.trim() !== '';
  
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
      }}
    >
      {/* Avatar Section */}
      <FlexWidget
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: hasAvatar ? 'transparent' : '#e0e0e0',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        {hasAvatar ? (
          <ImageWidget
            image={avatar}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
            }}
          />
        ) : (
          <TextWidget
            text={name?.[0]?.toUpperCase() || '?'}
            style={{
              fontSize: 32,
              color: '#666666',
              fontWeight: 'bold',
            }}
          />
        )}
      </FlexWidget>

      {/* Name Section */}
      <TextWidget
        text={name || 'Unknown User'}
        style={{
          fontSize: 16,
          color: '#333333',
          fontWeight: 'bold',
          textAlign: 'center',
          maxLines: 2,
        }}
      />
    </FlexWidget>
  );
};

export default AppWidget;