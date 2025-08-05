import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

const HomeWidget = ({ user }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const hasAvatar = user?.avatar && user.avatar.trim() !== '';
  console.log('hasAvatar', hasAvatar);

  return (
    <View style={styles.card}>
      <View style={styles.avatarWrapper}>
        {hasAvatar ? (
          <>
            {isImageLoading && (
              <ActivityIndicator
                size="small"
                color="#6C63FF"
                style={styles.loader}
              />
            )}
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
              onLoadStart={() => setIsImageLoading(true)}
              onLoadEnd={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          </>
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{user?.name?.[0]?.toUpperCase() || '?'}</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{user?.name || 'Unknown User'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 20,
    color: '#555',
    fontWeight: 'bold',
  },
  info: {
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default HomeWidget;