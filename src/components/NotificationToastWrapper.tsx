import React, { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp, CommonActions } from '@react-navigation/native';
import InAppNotificationToast from './InAppNotificationToast';
import { useNotifications } from '../contexts/NotificationContext';

interface NotificationToastWrapperProps {
  children: React.ReactNode;
}

const NotificationToastWrapper: React.FC<NotificationToastWrapperProps> = ({ children }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { currentToast, dismissToast, fetchNotifications } = useNotifications();
  const navigationRef = useRef(navigation);
  navigationRef.current = navigation;

  const handleToastPress = useCallback(() => {
    if (!currentToast) return;

    const { type, deepLink } = currentToast;

    try {
      // Navigate based on notification type and deep link
      if (deepLink) {
        if (deepLink.includes('/chat/')) {
          const conversationId = deepLink.split('/chat/')[1];
          navigationRef.current.dispatch(
            CommonActions.navigate({
              name: 'Chat',
              params: { conversationId },
            })
          );
        } else if (deepLink.includes('/posts/')) {
          const postId = deepLink.split('/posts/')[1];
          navigationRef.current.dispatch(
            CommonActions.navigate({
              name: 'Community',
              params: { screen: 'PostDetail', params: { postId } },
            })
          );
        } else if (deepLink.includes('/events/')) {
          navigationRef.current.dispatch(
            CommonActions.navigate({
              name: 'More',
              params: { screen: 'Events' },
            })
          );
        } else {
          // Default: go to notifications
          navigationRef.current.dispatch(
            CommonActions.navigate({
              name: 'More',
              params: { screen: 'Notifications' },
            })
          );
        }
      } else {
        // Navigate based on type
        switch (type) {
          case 'MESSAGE':
            navigationRef.current.dispatch(
              CommonActions.navigate({
                name: 'Chat',
              })
            );
            break;
          case 'LIKE':
          case 'COMMENT':
            navigationRef.current.dispatch(
              CommonActions.navigate({
                name: 'Community',
              })
            );
            break;
          default:
            navigationRef.current.dispatch(
              CommonActions.navigate({
                name: 'More',
                params: { screen: 'Notifications' },
              })
            );
        }
      }
    } catch (error) {
      console.error('Navigation error from toast:', error);
    }

    // Refresh notifications after navigation
    fetchNotifications(true);
  }, [currentToast, fetchNotifications]);

  const handleDismiss = useCallback(() => {
    dismissToast();
  }, [dismissToast]);

  return (
    <View style={styles.container}>
      {children}
      <InAppNotificationToast
        visible={!!currentToast}
        title={currentToast?.title || ''}
        body={currentToast?.body || ''}
        type={currentToast?.type}
        deepLink={currentToast?.deepLink}
        senderName={currentToast?.senderName}
        onPress={handleToastPress}
        onDismiss={handleDismiss}
        duration={5000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NotificationToastWrapper;

