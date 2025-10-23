import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NotificationService from '../services/notificationService';

interface EmergencyStopProps {
  onStop?: () => void;
}

export const EmergencyStop: React.FC<EmergencyStopProps> = ({ onStop }) => {
  const handleEmergencyStop = async () => {
    try {
      Alert.alert(
        'Emergency Stop',
        'This will stop all notifications and audio. Continue?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Stop All',
            style: 'destructive',
            onPress: async () => {
              const notificationService = NotificationService.getInstance();
              await notificationService.emergencyStop();
              await notificationService.disableAllNotifications();
              
              Alert.alert('Success', 'All notifications and audio have been stopped.');
              onStop?.();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error in emergency stop:', error);
      Alert.alert('Error', 'Failed to stop notifications. Please restart the app.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleEmergencyStop}>
        <Ionicons name="stop-circle" size={24} color="#fff" />
        <Text style={styles.buttonText}>EMERGENCY STOP</Text>
      </TouchableOpacity>
      <Text style={styles.warningText}>
        ⚠️ Use this if notifications are playing continuously
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#ff4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  warningText: {
    color: '#ff6666',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default EmergencyStop;
