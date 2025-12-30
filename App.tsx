import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import PrayerTimesScreen from './src/screens/PrayerTimesScreen';
import QiblaScreen from './src/screens/QiblaScreen';
import DuasScreen from './src/screens/DuasScreen';
// import QuranScreen from './src/screens/QuranScreen'; // Old Quran screen
import { QuranHome, SurahReader } from './src/features/quran'; // New Quran screens
import TasbihScreen from './src/screens/TasbihScreen';
import WazifaScreen from './src/screens/WazifaScreen';
import TijaniyahFeaturesScreen from './src/screens/TijaniyahFeaturesScreen';
import TariqaTijaniyyahScreen from './src/screens/TariqaTijaniyyahScreen';
import TijaniyaFiqhScreen from './src/screens/TijaniyaFiqhScreen';
import TijaniyaLazimScreen from './src/screens/TijaniyaLazimScreen';
import AzanScreen from './src/screens/AzanScreen';
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
import NotificationsScreen from './src/screens/NotificationsScreen';
import ChatScreen from './src/screens/ChatScreen';
import ConversationDetailScreen from './src/screens/ConversationDetailScreen';
import ZakatCalculatorScreen from './src/screens/ZakatCalculatorScreen';
import HajjScreen from './src/screens/HajjScreen';
import HajjUmrahScreen from './src/screens/HajjUmrahScreen';
import HajjJourneyScreen from './src/screens/HajjJourneyScreen';
import AdminMainScreen from './src/screens/AdminMainScreen';
import DuasTijaniyaScreen from './src/screens/DuasTijaniyaScreen';
import DuaKhatmulWazifaScreen from './src/screens/DuaKhatmulWazifaScreen';
import DuaRabilIbadiScreen from './src/screens/DuaRabilIbadiScreen';
import DuaHasbilMuhaiminuScreen from './src/screens/DuaHasbilMuhaiminuScreen';

// Import auth components
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { AdminAuthProvider } from './src/contexts/AdminAuthContext';
import AuthWrapper from './src/components/AuthWrapper';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { LanguageProvider, useLanguage } from './src/contexts/LanguageContext';
import { TimeFormatProvider } from './src/contexts/TimeFormatContext';
import { IslamicCalendarProvider } from './src/contexts/IslamicCalendarContext';
import GlassTabBar from './src/components/GlassTabBar';
import { QueryProvider } from './src/providers/QueryProvider';
import NotificationToastWrapper from './src/components/NotificationToastWrapper';
import { useNotifications } from './src/contexts/NotificationContext';

// Import types
import { TabBarIconProps } from './src/types';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    console.error('Unhandled error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 16 }}>Something went wrong. Please restart the app.</Text>
        </View>
      );
    }
    return this.props.children as any;
  }
}

// Tab Bar Icon Component
const TabBarIcon = ({ focused, color, size, name }: TabBarIconProps & { name: string }) => (
  <Ionicons name={name as any} size={size} color={color} />
);

// Main Tab Navigator
function MainTabNavigator() {
  const { t } = useLanguage();
  
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: t('nav.home') }}
      />
      <Tab.Screen 
        name="Tijaniyah Features" 
        component={TijaniyahFeaturesScreen}
        options={{ tabBarLabel: t('nav.tijaniyah_features') }}
      />
      <Tab.Screen 
        name="Qibla" 
        component={QiblaScreen}
        options={{ tabBarLabel: t('nav.qibla') }}
      />
      <Tab.Screen 
        name="Quran" 
        component={QuranStackNavigator}
        options={{ tabBarLabel: t('nav.quran') }}
      />
      <Tab.Screen 
        name="Duas" 
        component={DuasScreen}
        options={{ tabBarLabel: t('nav.duas') }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreStackNavigator}
        options={{ tabBarLabel: t('nav.more') }}
      />
    </Tab.Navigator>
  );
}

// Quran Stack Navigator
function QuranStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 300 } },
          close: { animation: 'timing', config: { duration: 300 } },
        },
      }}
    >
      <Stack.Screen name="QuranHome" component={QuranHome} />
      <Stack.Screen name="SurahReader" component={SurahReader} />
    </Stack.Navigator>
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
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
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
        name="TijaniyaLazim" 
        component={TijaniyaLazimScreen}
        options={{ title: 'Tijaniya Lazim' }}
      />
      <Stack.Screen 
        name="Azan" 
        component={AzanScreen}
        options={{ title: 'Azan' }}
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
        name="Chat" 
        component={ChatScreen}
        options={{ title: 'Messages' }}
      />
      <Stack.Screen 
        name="ConversationDetail" 
        component={ConversationDetailScreen}
        options={{ title: 'Messages' }}
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
        name="Notifications" 
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen name="Hajj" component={HajjScreen} options={{ title: 'Hajj' }} />
      <Stack.Screen name="HajjUmrah" component={HajjUmrahScreen} options={{ title: 'Hajj & Umrah' }} />
      <Stack.Screen name="HajjJourney" component={HajjJourneyScreen} options={{ title: 'Hajj Journey' }} />
      <Stack.Screen 
        name="AdminPanel" 
        component={AdminMainScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ZakatCalculator"
        component={ZakatCalculatorScreen}
        options={{ title: 'Zakat Calculator' }}
      />
      <Stack.Screen 
        name="DuasTijaniya" 
        component={DuasTijaniyaScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="DuaKhatmulWazifa" 
        component={DuaKhatmulWazifaScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="DuaRabilIbadi" 
        component={DuaRabilIbadiScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="DuaHasbilMuhaiminu" 
        component={DuaHasbilMuhaiminuScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}


// Authentication Stack Navigator
function AuthStackNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
        },
      }}
    >
      <Stack.Screen name="GuestMode" component={GuestModeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Main App Navigator with Toast Notifications
function AppNavigatorWithToast() {
  const { authState, isAdmin, isModerator } = useAuth();

  // Only show toast wrapper for authenticated users
  if (authState.isAuthenticated || authState.isGuest) {
    // Check if user is admin/moderator and redirect to admin panel
    if (authState.isAuthenticated && authState.user && (isAdmin() || isModerator())) {
      return (
        <NotificationToastWrapper>
          <AdminMainScreen navigation={{ navigate: () => {} }} />
        </NotificationToastWrapper>
      );
    }
    return (
      <NotificationToastWrapper>
        <MainTabNavigator />
      </NotificationToastWrapper>
    );
  } else {
    return <AuthStackNavigator />;
  }
}

// Main App Navigator
function AppNavigator() {
  return <AppNavigatorWithToast />;
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
    <SafeAreaProvider>
      <QueryProvider>
        <LanguageProvider>
          <TimeFormatProvider>
            <IslamicCalendarProvider>
              <AuthProvider>
                <AdminAuthProvider>
                  <NotificationProvider>
                    <AuthWrapper>
                      <NavigationContainer>
                        <StatusBar style="light" backgroundColor="#2E7D32" />
                        <ErrorBoundary>
                          <AppNavigator />
                        </ErrorBoundary>
                      </NavigationContainer>
                    </AuthWrapper>
                  </NotificationProvider>
                </AdminAuthProvider>
              </AuthProvider>
            </IslamicCalendarProvider>
          </TimeFormatProvider>
        </LanguageProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});