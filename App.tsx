import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import PrayerTimesScreen from './src/screens/PrayerTimesScreen';
import QiblaScreen from './src/screens/QiblaScreen';
import DuasScreen from './src/screens/DuasScreen';
import QuranScreen from './src/screens/QuranScreen';
import TasbihScreen from './src/screens/TasbihScreen';
import WazifaScreen from './src/screens/WazifaScreen';
import TijaniyahFeaturesScreen from './src/screens/TijaniyahFeaturesScreen';
import TariqaTijaniyyahScreen from './src/screens/TariqaTijaniyyahScreen';
import TijaniyaFiqhScreen from './src/screens/TijaniyaFiqhScreen';
import ResourcesForBeginnersScreen from './src/screens/ResourcesForBeginnersScreen';
import ProofOfTasawwufPart1Screen from './src/screens/ProofOfTasawwufPart1Screen';
import LazimScreen from './src/screens/LazimScreen';
import ZikrJummaScreen from './src/screens/ZikrJummaScreen';
import JournalScreen from './src/screens/JournalScreen';
import ScholarsScreen from './src/screens/ScholarsScreen';
import LessonsScreen from './src/screens/LessonsScreen';
import LessonDetailScreen from './src/screens/LessonDetailScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import MosqueScreen from './src/screens/MosqueScreen';
import MakkahLiveScreen from './src/screens/MakkahLiveScreen';
import AINoorScreen from './src/screens/AINoorScreen';
import DonateScreen from './src/screens/DonateScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import GuestModeScreen from './src/screens/GuestModeScreen';
import { colors } from './src/utils/theme';
import { Image, ActivityIndicator } from 'react-native';
import ScholarDetailScreen from './src/screens/ScholarDetailScreen';
import MoreFeaturesScreen from './src/screens/MoreFeaturesScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';

// Import auth components
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import AuthWrapper from './src/components/AuthWrapper';
import { NotificationProvider } from './src/contexts/NotificationContext';
import GlassTabBar from './src/components/GlassTabBar';

// Import types
import { TabBarIconProps } from './src/types';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Bar Icon Component
const TabBarIcon = ({ focused, color, size, name }: TabBarIconProps & { name: string }) => (
  <Ionicons name={name as any} size={size} color={color} />
);

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tijaniyah Features" component={TijaniyahFeaturesScreen} />
      <Tab.Screen name="Qibla" component={QiblaScreen} />
      <Tab.Screen name="Quran" component={QuranScreen} />
      <Tab.Screen name="Duas" component={DuasScreen} />
      <Tab.Screen name="More" component={MoreStackNavigator} />
    </Tab.Navigator>
  );
}

// More Stack Navigator for additional features
function MoreStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: colors.textPrimary,
        },
      }}
    >
      <Stack.Screen 
        name="MoreFeatures" 
        component={MoreFeaturesScreen}
        options={{ title: 'More Features' }}
      />
      <Stack.Screen 
        name="Tasbih" 
        component={TasbihScreen}
        options={{ title: 'Digital Tasbih' }}
      />
      <Stack.Screen 
        name="PrayerTimes" 
        component={PrayerTimesScreen}
        options={{ title: 'Prayer Times' }}
      />
      <Stack.Screen 
        name="TariqaTijaniyyah" 
        component={TariqaTijaniyyahScreen}
        options={{ title: 'Tariqa Tijaniyyah' }}
      />
      <Stack.Screen 
        name="TijaniyaFiqh" 
        component={TijaniyaFiqhScreen}
        options={{ title: 'Tijaniya Fiqh' }}
      />
      <Stack.Screen 
        name="ResourcesForBeginners" 
        component={ResourcesForBeginnersScreen}
        options={{ title: 'Resources for Beginners' }}
      />
      <Stack.Screen 
        name="ProofOfTasawwufPart1" 
        component={ProofOfTasawwufPart1Screen}
        options={{ title: 'Proof of Tasawwuf Part 1' }}
      />
      <Stack.Screen 
        name="Wazifa" 
        component={WazifaScreen}
        options={{ title: 'Wazifa' }}
      />
      <Stack.Screen 
        name="Lazim" 
        component={LazimScreen}
        options={{ title: 'Lazim Tracker' }}
      />
      <Stack.Screen 
        name="ZikrJumma" 
        component={ZikrJummaScreen}
        options={{ title: 'Zikr Jumma' }}
      />
      <Stack.Screen 
        name="Journal" 
        component={JournalScreen}
        options={{ title: 'Islamic Journal' }}
      />
      <Stack.Screen 
        name="Scholars" 
        component={ScholarsScreen}
        options={{ title: 'Scholars' }}
      />
      <Stack.Screen 
        name="Lessons" 
        component={LessonsScreen}
        options={{ title: 'Islamic Lessons' }}
      />
      <Stack.Screen 
        name="LessonDetail" 
        component={LessonDetailScreen}
        options={{ title: 'Lesson' }}
      />
      <Stack.Screen 
        name="Makkah Live" 
        component={MakkahLiveScreen}
        options={{ title: 'Makkah Live' }}
      />
      <Stack.Screen 
        name="AI Noor" 
        component={AINoorScreen}
        options={{ title: 'AI Noor' }}
      />
      <Stack.Screen 
        name="ScholarDetail" 
        component={ScholarDetailScreen}
        options={{ title: 'Biography' }}
      />
      <Stack.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ title: 'Community' }}
      />
      <Stack.Screen 
        name="Mosque" 
        component={MosqueScreen}
        options={{ title: 'Mosque Locator' }}
      />
      
      <Stack.Screen 
        name="Donate" 
        component={DonateScreen}
        options={{ title: 'Donate' }}
      />
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettingsScreen}
        options={{ title: 'Notification Settings' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}


// Authentication Stack Navigator
function AuthStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GuestMode" component={GuestModeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Main App Navigator
function AppNavigator() {
  const { authState } = useAuth();

  if (authState.isAuthenticated || authState.isGuest) {
    return <MainTabNavigator />;
  } else {
    return <AuthStackNavigator />;
  }
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch {}
      setTimeout(async () => {
        try { await SplashScreen.hideAsync(); } catch {}
        setIsReady(true);
      }, 5000);
    };
    prepare();
  }, []);

  if (!isReady) {
    // Keep native splash visible
    return null;
  }
  return (
    <AuthProvider>
      <NotificationProvider>
        <AuthWrapper>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#2E7D32" />
            <AppNavigator />
          </NavigationContainer>
        </AuthWrapper>
      </NotificationProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});