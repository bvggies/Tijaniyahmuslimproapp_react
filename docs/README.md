# Tijaniyah Pro - Islamic Mobile App

A comprehensive Islamic mobile application built with React Native and Expo, featuring beautiful UI and smooth animations.

## Features

### ✅ Implemented
- **Prayer Times** - Accurate prayer times based on your location
- **Qibla Compass** - Find the direction of the Kaaba from anywhere
- **Duas & Supplications** - Comprehensive collection of Islamic prayers
- **Quran Reader** - Read the Holy Quran with translations
- **Digital Tasbih** - Count your dhikr with our digital tasbih
- **Wazifa** - Daily Islamic practices and routines tracker

### 🚧 Coming Soon
- **Lazim Tracker** - Track your daily Islamic commitments
- **Zikr Jumma** - Special Friday prayers and dhikr
- **Islamic Journal** - Reflect on your spiritual journey
- **Scholars** - Learn from Islamic scholars and teachers
- **Community** - Connect with fellow Muslims worldwide
- **Mosque Locator** - Find nearby mosques and prayer facilities
- **Makkah Live** - Watch live streams from the Holy Kaaba
- **AI Noor** - AI-powered Islamic assistant
- **Donate** - Support Islamic causes

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Expo Linear Gradient** for beautiful gradients
- **Expo Location** for location services
- **Expo Sensors** for compass functionality
- **Expo Haptics** for tactile feedback
- **React Native Animatable** for smooth animations

## ⚠️ Important: Permanent Database

**This project uses a PERMANENT database for ALL environments:**
- Local development
- Expo Go testing
- Production
- All future work

See [PERMANENT_DATABASE.md](./PERMANENT_DATABASE.md) for details.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Tijaniyahmuslimproapp
```

2. Install dependencies:
```bash
# Frontend
npm install

# Backend
cd api
npm install
```

3. Setup backend (uses permanent database):
```bash
cd api
# .env file should have permanent database connection string
npm run db:setup
npm run start:dev
```

4. Start the frontend:
```bash
# From project root
npm start
```

5. Run on your device:
   - Install Expo Go app on your mobile device
   - **Important:** For Expo Go on physical devices, use your local IP address (not localhost)
   - See [EXPO_GO_SETUP.md](./EXPO_GO_SETUP.md) for detailed setup
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)

### Development Guides

- [Local Development Setup](./LOCAL_DEVELOPMENT.md) - Complete local development guide
- [Expo Go Setup](./EXPO_GO_SETUP.md) - Expo Go specific configuration
- [Permanent Database](./PERMANENT_DATABASE.md) - Database configuration
- [Vercel Deployment](./VERCEL_DEPLOYMENT.md) - Production deployment

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)
- `npm run web` - Run in web browser

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # App screens
├── navigation/         # Navigation configuration
├── services/           # API services and utilities
├── utils/              # Helper functions
├── types/              # TypeScript type definitions
├── data/               # Static data and mock data
└── assets/             # Images, fonts, and other assets
```

## Features Overview

### Prayer Times
- Location-based prayer time calculation
- Beautiful prayer time cards
- Current and next prayer indicators
- Refresh functionality

### Qibla Compass
- Real-time compass with device orientation
- Accurate Qibla direction calculation
- Distance to Kaaba display
- Calibration functionality

### Duas & Supplications
- Categorized collection of Islamic prayers
- Arabic text with transliteration and translation
- Search functionality
- Favorites system

### Quran Reader
- Surah listing with verse counts
- Arabic text with translation
- Bookmark functionality
- Search capabilities

### Digital Tasbih
- Interactive counter with animations
- Multiple target options (33, 99, 100, 1000)
- Progress tracking
- Haptic feedback
- Dhikr suggestions

### Wazifa Tracker
- Daily Islamic practices management
- Progress tracking
- Filter options (All, Pending, Completed)
- Visual progress indicators

## Deployment

### Building for Production

1. **Android APK:**
```bash
expo build:android
```

2. **iOS App:**
```bash
expo build:ios
```

3. **Web App:**
```bash
expo build:web
```

### Publishing to App Stores

1. **Google Play Store:**
   - Build the Android APK
   - Upload to Google Play Console
   - Follow Google's publishing guidelines

2. **Apple App Store:**
   - Build the iOS app
   - Upload to App Store Connect
   - Follow Apple's publishing guidelines

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@tijaniyahpro.com or join our community.

## Acknowledgments

- Islamic prayer time calculations
- Quran text and translations
- Islamic scholars and teachers
- The Muslim community worldwide

---

**Tijaniyah Pro** - Your comprehensive Islamic companion app for spiritual growth and daily practice.
