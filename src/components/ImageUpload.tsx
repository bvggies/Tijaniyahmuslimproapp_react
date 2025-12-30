import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import CloudinaryService from '../services/cloudinaryService';
import { colors } from '../utils/theme';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  folder?: string;
  placeholder?: string;
  aspectRatio?: [number, number];
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  label?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'tijaniyah',
  placeholder = 'Add Photo',
  aspectRatio = [1, 1],
  size = 'medium',
  showLabel = false,
  label = 'Photo',
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const cloudinaryService = CloudinaryService.getInstance();

  const sizeMap = {
    small: { container: 80, icon: 24 },
    medium: { container: 120, icon: 32 },
    large: { container: 160, icon: 40 },
  };
  const { container: containerSize, icon: iconSize } = sizeMap[size];

  const handleImagePick = async (source: 'camera' | 'library') => {
    try {
      let result;

      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: aspectRatio,
          quality: 0.8,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission Required', 'Photo library permission is needed to select images.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: aspectRatio,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setShowPicker(false);
        setIsUploading(true);

        const uploadResult = await cloudinaryService.uploadImage(result.assets[0].uri, { folder });

        if (uploadResult.success && uploadResult.url) {
          onChange(uploadResult.url);
        } else {
          Alert.alert('Upload Failed', uploadResult.error || 'Failed to upload image');
        }

        setIsUploading(false);
      } else {
        setShowPicker(false);
      }
    } catch (error) {
      setShowPicker(false);
      setIsUploading(false);
      console.error('Image pick error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleRemove = () => {
    Alert.alert('Remove Image', 'Are you sure you want to remove this image?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => onChange(undefined) },
    ]);
  };

  return (
    <View style={styles.wrapper}>
      {showLabel && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[styles.container, { width: containerSize, height: containerSize }]}
        onPress={() => !disabled && !isUploading && setShowPicker(true)}
        disabled={disabled || isUploading}
        activeOpacity={0.7}
      >
        {isUploading ? (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color="#00BFA5" />
            <Text style={styles.uploadingText}>Uploading...</Text>
          </View>
        ) : value ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: value }} style={styles.image} />
            {!disabled && (
              <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
                <Ionicons name="close-circle" size={24} color="#FF5252" />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <LinearGradient
            colors={['rgba(0,191,165,0.1)', 'rgba(0,191,165,0.05)']}
            style={styles.placeholder}
          >
            <Ionicons name="camera-outline" size={iconSize} color="#00BFA5" />
            <Text style={styles.placeholderText}>{placeholder}</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>

      {/* Image Picker Modal */}
      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.modalContent}>
            <LinearGradient colors={['#0B3F39', '#052F2A']} style={styles.modalGradient}>
              <Text style={styles.modalTitle}>Add Photo</Text>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleImagePick('camera')}
              >
                <View style={styles.modalOptionIcon}>
                  <Ionicons name="camera" size={24} color="#00BFA5" />
                </View>
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Take Photo</Text>
                  <Text style={styles.modalOptionDesc}>Use your camera</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleImagePick('library')}
              >
                <View style={styles.modalOptionIcon}>
                  <Ionicons name="images" size={24} color="#00BFA5" />
                </View>
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Choose from Library</Text>
                  <Text style={styles.modalOptionDesc}>Select existing photo</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxImages?: number;
  disabled?: boolean;
}

export function MultiImageUpload({
  value = [],
  onChange,
  folder = 'tijaniyah',
  maxImages = 4,
  disabled = false,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const cloudinaryService = CloudinaryService.getInstance();

  const pickImage = async () => {
    if (value.length >= maxImages) {
      Alert.alert('Limit Reached', `Maximum ${maxImages} images allowed.`);
      return;
    }

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Photo library permission is needed to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploading(true);

        const uploadResult = await cloudinaryService.uploadPostImage(result.assets[0].uri);

        if (uploadResult.success && uploadResult.url) {
          onChange([...value, uploadResult.url]);
        } else {
          Alert.alert('Upload Failed', uploadResult.error || 'Failed to upload image');
        }

        setIsUploading(false);
      }
    } catch (error) {
      setIsUploading(false);
      console.error('Image pick error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.multiContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {value.map((uri, index) => (
          <View key={index} style={styles.multiImageWrapper}>
            <Image source={{ uri }} style={styles.multiImage} />
            {!disabled && (
              <TouchableOpacity
                style={styles.multiRemoveButton}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close-circle" size={22} color="#FF5252" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {value.length < maxImages && (
          <TouchableOpacity
            style={styles.multiAddButton}
            onPress={pickImage}
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#00BFA5" />
            ) : (
              <>
                <Ionicons name="add" size={28} color="#00BFA5" />
                <Text style={styles.multiAddText}>Add</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      <Text style={styles.multiCountText}>
        {value.length}/{maxImages} images
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  uploadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
  },
  uploadingText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 8,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#0B3F39',
    borderRadius: 12,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(0,191,165,0.3)',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#00BFA5',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  modalOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,191,165,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 2,
  },
  modalOptionDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  modalCancel: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },

  // Multi Image Upload Styles
  multiContainer: {
    width: '100%',
  },
  multiImageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  multiImage: {
    width: 100,
    height: 75,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  multiRemoveButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.background,
    borderRadius: 11,
  },
  multiAddButton: {
    width: 100,
    height: 75,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0,191,165,0.3)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,191,165,0.05)',
  },
  multiAddText: {
    color: '#00BFA5',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  multiCountText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
});

