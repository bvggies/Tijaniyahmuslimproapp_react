import { StyleSheet } from 'react-native';
import { colors } from './theme';

/**
 * Common screen styles to ensure proper scrolling and bottom padding
 * to prevent content from being covered by the bottom tab bar
 */
export const commonScreenStyles = StyleSheet.create({
  // Container for screens with bottom tab navigation
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // ScrollView container for screens that need scrolling
  scrollContainer: {
    flex: 1,
  },
  
  // Content container for ScrollView with proper bottom padding
  scrollContent: {
    paddingBottom: 100, // Extra padding to clear bottom tab bar (usually ~80px + margin)
  },
  
  // For screens with fixed content that need bottom padding
  contentWithBottomPadding: {
    paddingBottom: 100,
  },
  
  // For FlatList components that need bottom padding
  flatListContent: {
    paddingBottom: 100,
  },
  
  // For sections that should have proper spacing from bottom
  sectionWithBottomSpacing: {
    marginBottom: 20,
  },
});

/**
 * Helper function to get bottom padding based on platform
 * @param extraPadding - Additional padding to add (default: 0)
 * @returns Bottom padding value
 */
export const getBottomPadding = (extraPadding: number = 0): number => {
  return 100 + extraPadding; // Base padding for bottom tab bar + extra
};

/**
 * Helper function to get content container style with proper bottom padding
 * @param extraPadding - Additional padding to add (default: 0)
 * @returns Style object for content container
 */
export const getContentContainerStyle = (extraPadding: number = 0) => ({
  paddingBottom: getBottomPadding(extraPadding),
});
