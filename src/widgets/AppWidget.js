import React from 'react';
import { FlexWidget, TextWidget, ImageWidget } from 'react-native-android-widget';

const AppWidget = ({ name, avatar, email }) => {
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
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: hasAvatar ? 'transparent' : '#e0e0e0',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        {hasAvatar ? (
          <ImageWidget
            image={avatar}
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
            }}
          />
        ) : (
          <TextWidget
            text={name?.[0]?.toUpperCase() || '?'}
            style={{
              fontSize: 28,
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
          fontSize: 14,
          color: '#333333',
          fontWeight: 'bold',
          textAlign: 'center',
          maxLines: 1,
          marginBottom: 4,
        }}
      />

      {/* Email Section */}
      {email && (
        <TextWidget
          text={email}
          style={{
            fontSize: 11,
            color: '#666666',
            textAlign: 'center',
            maxLines: 1,
          }}
        />
      )}
    </FlexWidget>
  );
};

export default AppWidget;