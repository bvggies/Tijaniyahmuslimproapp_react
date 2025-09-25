import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../utils/theme';

interface ProfileAvatarProps {
  profilePicture?: string;
  name?: string;
  size?: number;
  showBorder?: boolean;
  editable?: boolean;
  onImageChange?: (imageUri: string) => void;
}

export default function ProfileAvatar({ 
  profilePicture, 
  name, 
  size = 32, 
  showBorder = false,
  editable = false,
  onImageChange
}: ProfileAvatarProps) {
  const avatarSize = size;
  const borderRadius = avatarSize / 2;

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to select a profile picture.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    if (!editable || !onImageChange) return;

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert(
      'Select Profile Picture',
      'Choose how you want to add your profile picture',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Photo Library', onPress: openImageLibrary },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1.0,
    });

    if (!result.canceled && result.assets[0]) {
      onImageChange(result.assets[0].uri);
    }
  };

  const openImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1.0,
    });

    if (!result.canceled && result.assets[0]) {
      onImageChange(result.assets[0].uri);
    }
  };

  const AvatarContent = () => {
    if (profilePicture) {
      return (
        <Image
          source={{ uri: profilePicture }}
          style={[
            styles.image,
            { borderRadius }
          ]}
          resizeMode="cover"
          onError={() => {
            console.log('Profile picture failed to load');
          }}
        />
      );
    }

    return (
      <View style={[
        styles.fallback,
        { width: avatarSize, height: avatarSize, borderRadius }
      ]}>
        <Ionicons 
          name="person" 
          size={avatarSize * 0.6} 
          color="#FFFFFF" 
        />
      </View>
    );
  };

  const containerStyle = [
    styles.container,
    { width: avatarSize, height: avatarSize, borderRadius },
    showBorder && styles.border
  ];

  if (editable) {
    return (
      <TouchableOpacity onPress={pickImage} style={containerStyle}>
        <AvatarContent />
        <View style={[styles.editOverlay, { borderRadius }]}>
          <Ionicons name="camera" size={avatarSize * 0.3} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle}>
      <AvatarContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  fallback: {
    backgroundColor: colors.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  border: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
