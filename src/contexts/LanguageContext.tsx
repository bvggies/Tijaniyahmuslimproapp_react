import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'fr' | 'ar' | 'ha';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.tijaniyah_features': 'Tijaniyah Features',
    'nav.qibla': 'Qibla',
    'nav.quran': 'Quran',
    'nav.duas': 'Duas',
    'nav.more': 'More',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.settings': 'Settings',
    'common.language': 'Language',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    
    // Home Screen
    'home.welcome': 'Welcome to Tijaniyah Pro',
    'home.prayer_times': 'Prayer Times',
    'home.qibla_direction': 'Qibla Direction',
    'home.quran_reading': 'Quran Reading',
    'home.duas': 'Duas & Supplications',
    'home.tasbih': 'Digital Tasbih',
    'home.lessons': 'Islamic Lessons',
    'home.community': 'Community',
    'home.quick_actions': 'Quick Actions',
    'home.upcoming_events': 'Upcoming Events',
    'home.islamic_calendar': 'Islamic Calendar',
    'home.current_prayer': 'Current Prayer',
    'home.upcoming': 'Upcoming',
    'home.in': 'In',
    
    // More Features
    'more.title': 'More Features',
    'more.search_placeholder': 'Search features, prayers, duas...',
    'more.search_results': 'Search Results',
    'more.search_with_ai': 'Search with AI Noor',
    'more.ai_search_subtitle': 'Ask AI Noor for answers to your questions',
    'more.ask_ai_noor': 'Ask AI Noor',
    
    // Makkah Live
    'makkah_live.title': 'Makkah Live',
    'makkah_live.subtitle': 'Live streams from the Holy Mosques',
    'makkah_live.help_title': 'Stream Not Working?',
    'makkah_live.help_description': 'If the current stream isn\'t loading or has issues, try switching to another stream below. Different streams may work better depending on your internet connection.',
    'makkah_live.open_youtube': 'Open in YouTube',
    'makkah_live.loading': 'Loading live stream...',
    
    // Prayer Times
    'prayer.fajr': 'Fajr',
    'prayer.dhuhr': 'Dhuhr',
    'prayer.asr': 'Asr',
    'prayer.maghrib': 'Maghrib',
    'prayer.isha': 'Isha',
    'prayer.next_prayer': 'Next Prayer',
    'prayer.time_remaining': 'Time Remaining',
    
    // AI Noor
    'ai_noor.title': 'AI Noor',
    'ai_noor.subtitle': 'Ask Islamic questions with a gentle, helpful guide',
    'ai_noor.placeholder': 'Ask about Islam, prayer, Quran, Tijaniyya...',
    'ai_noor.thinking': 'AI Noor is thinking...',
    
    // Settings
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.about': 'About',
    'settings.version': 'Version',
    
    // Language Options
    'language.english': 'English',
    'language.french': 'Français',
    'language.arabic': 'العربية',
    'language.hausa': 'Hausa',
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.tijaniyah_features': 'Fonctionnalités Tijaniyah',
    'nav.qibla': 'Qibla',
    'nav.quran': 'Coran',
    'nav.duas': 'Douas',
    'nav.more': 'Plus',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.search': 'Rechercher',
    'common.settings': 'Paramètres',
    'common.language': 'Langue',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    
    // Home Screen
    'home.welcome': 'Bienvenue dans Tijaniyah Pro',
    'home.prayer_times': 'Heures de Prière',
    'home.qibla_direction': 'Direction Qibla',
    'home.quran_reading': 'Lecture du Coran',
    'home.duas': 'Douas et Invocations',
    'home.tasbih': 'Tasbih Numérique',
    'home.lessons': 'Leçons Islamiques',
    'home.community': 'Communauté',
    'home.quick_actions': 'Actions Rapides',
    'home.upcoming_events': 'Événements à Venir',
    'home.islamic_calendar': 'Calendrier Islamique',
    'home.current_prayer': 'Prière Actuelle',
    'home.upcoming': 'À Venir',
    'home.in': 'Dans',
    
    // More Features
    'more.title': 'Plus de Fonctionnalités',
    'more.search_placeholder': 'Rechercher des fonctionnalités, prières, douas...',
    'more.search_results': 'Résultats de Recherche',
    'more.search_with_ai': 'Rechercher avec AI Noor',
    'more.ai_search_subtitle': 'Demandez à AI Noor des réponses à vos questions',
    'more.ask_ai_noor': 'Demander à AI Noor',
    
    // Makkah Live
    'makkah_live.title': 'Makkah en Direct',
    'makkah_live.subtitle': 'Diffusions en direct des Mosquées Saintes',
    'makkah_live.help_title': 'Le Stream ne Fonctionne Pas?',
    'makkah_live.help_description': 'Si le stream actuel ne se charge pas ou a des problèmes, essayez de passer à un autre stream ci-dessous. Différents streams peuvent mieux fonctionner selon votre connexion internet.',
    'makkah_live.open_youtube': 'Ouvrir dans YouTube',
    'makkah_live.loading': 'Chargement du stream en direct...',
    
    // Prayer Times
    'prayer.fajr': 'Fajr',
    'prayer.dhuhr': 'Dhuhr',
    'prayer.asr': 'Asr',
    'prayer.maghrib': 'Maghrib',
    'prayer.isha': 'Isha',
    'prayer.next_prayer': 'Prochaine Prière',
    'prayer.time_remaining': 'Temps Restant',
    
    // AI Noor
    'ai_noor.title': 'AI Noor',
    'ai_noor.subtitle': 'Posez des questions islamiques avec un guide doux et utile',
    'ai_noor.placeholder': 'Demandez sur l\'Islam, la prière, le Coran, Tijaniyya...',
    'ai_noor.thinking': 'AI Noor réfléchit...',
    
    // Settings
    'settings.language': 'Langue',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Confidentialité',
    'settings.about': 'À propos',
    'settings.version': 'Version',
    
    // Language Options
    'language.english': 'English',
    'language.french': 'Français',
    'language.arabic': 'العربية',
    'language.hausa': 'Hausa',
  },
  
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.tijaniyah_features': 'ميزات التجانية',
    'nav.qibla': 'القبلة',
    'nav.quran': 'القرآن',
    'nav.duas': 'الأدعية',
    'nav.more': 'المزيد',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.search': 'بحث',
    'common.settings': 'الإعدادات',
    'common.language': 'اللغة',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    
    // Home Screen
    'home.welcome': 'مرحباً بك في التجانية برو',
    'home.prayer_times': 'أوقات الصلاة',
    'home.qibla_direction': 'اتجاه القبلة',
    'home.quran_reading': 'قراءة القرآن',
    'home.duas': 'الأدعية والاستغفار',
    'home.tasbih': 'التسبيح الرقمي',
    'home.lessons': 'الدروس الإسلامية',
    'home.community': 'المجتمع',
    'home.quick_actions': 'الإجراءات السريعة',
    'home.upcoming_events': 'الأحداث القادمة',
    'home.islamic_calendar': 'التقويم الهجري',
    'home.current_prayer': 'الصلاة الحالية',
    'home.upcoming': 'قادم',
    'home.in': 'في',
    
    // More Features
    'more.title': 'المزيد من الميزات',
    'more.search_placeholder': 'البحث في الميزات، الصلوات، الأدعية...',
    'more.search_results': 'نتائج البحث',
    'more.search_with_ai': 'البحث مع نور الذكي',
    'more.ai_search_subtitle': 'اسأل نور الذكي للحصول على إجابات لأسئلتك',
    'more.ask_ai_noor': 'اسأل نور الذكي',
    
    // Makkah Live
    'makkah_live.title': 'مكة مباشر',
    'makkah_live.subtitle': 'بث مباشر من المساجد المقدسة',
    'makkah_live.help_title': 'البث لا يعمل؟',
    'makkah_live.help_description': 'إذا كان البث الحالي لا يتم تحميله أو يواجه مشاكل، جرب التبديل إلى بث آخر أدناه. قد تعمل البثوث المختلفة بشكل أفضل حسب اتصالك بالإنترنت.',
    'makkah_live.open_youtube': 'فتح في يوتيوب',
    'makkah_live.loading': 'جاري تحميل البث المباشر...',
    
    // Prayer Times
    'prayer.fajr': 'الفجر',
    'prayer.dhuhr': 'الظهر',
    'prayer.asr': 'العصر',
    'prayer.maghrib': 'المغرب',
    'prayer.isha': 'العشاء',
    'prayer.next_prayer': 'الصلاة القادمة',
    'prayer.time_remaining': 'الوقت المتبقي',
    
    // AI Noor
    'ai_noor.title': 'الذكاء الاصطناعي نور',
    'ai_noor.subtitle': 'اسأل أسئلة إسلامية مع دليل لطيف ومفيد',
    'ai_noor.placeholder': 'اسأل عن الإسلام، الصلاة، القرآن، التجانية...',
    'ai_noor.thinking': 'الذكاء الاصطناعي نور يفكر...',
    
    // Settings
    'settings.language': 'اللغة',
    'settings.notifications': 'الإشعارات',
    'settings.privacy': 'الخصوصية',
    'settings.about': 'حول',
    'settings.version': 'الإصدار',
    
    // Language Options
    'language.english': 'English',
    'language.french': 'Français',
    'language.arabic': 'العربية',
    'language.hausa': 'Hausa',
  },
  
  ha: {
    // Navigation
    'nav.home': 'Gida',
    'nav.tijaniyah_features': 'Fasali na Tijaniyah',
    'nav.qibla': 'Qibla',
    'nav.quran': 'Alkurani',
    'nav.duas': 'Adduoi',
    'nav.more': 'Kara',
    
    // Common
    'common.loading': 'Ana loda...',
    'common.error': 'Kuskure',
    'common.success': 'Nasara',
    'common.cancel': 'Soke',
    'common.save': 'Ajiye',
    'common.delete': 'Share',
    'common.edit': 'Gyara',
    'common.search': 'Nemo',
    'common.settings': 'Saituna',
    'common.language': 'Harshe',
    'common.back': 'Koma baya',
    'common.next': 'Na gaba',
    'common.previous': 'Na baya',
    
    // Home Screen
    'home.welcome': 'Barka da zuwa Tijaniyah Pro',
    'home.prayer_times': 'Lokutan Salla',
    'home.qibla_direction': 'Shugaban Qibla',
    'home.quran_reading': 'Karatun Alkurani',
    'home.duas': 'Adduoi da Rooi',
    'home.tasbih': 'Tasbih na Lantarki',
    'home.lessons': 'Darussan Musulunci',
    'home.community': 'Alumma',
    'home.quick_actions': 'Ayyuka na Gaggawa',
    'home.upcoming_events': 'Abubuwan da ke Zuwa',
    'home.islamic_calendar': 'Kalandar Musulunci',
    'home.current_prayer': 'Sallar Yanzu',
    'home.upcoming': 'Mai Zuwa',
    'home.in': 'A cikin',
    
    // More Features
    'more.title': 'Ƙarin Fasali',
    'more.search_placeholder': 'Nemo fasali, salloli, adduoi...',
    'more.search_results': 'Sakamakon Bincike',
    'more.search_with_ai': 'Bincike tare da AI Noor',
    'more.ai_search_subtitle': 'Tambayi AI Noor don amsoshin tambayoyin ku',
    'more.ask_ai_noor': 'Tambayi AI Noor',
    
    // Makkah Live
    'makkah_live.title': 'Makkah Kai Tsaye',
    'makkah_live.subtitle': 'Watsa kai tsaye daga Masallatai Masu Tsarki',
    'makkah_live.help_title': 'Watsa Ba Ya Aiki?',
    'makkah_live.help_description': 'Idan watsa na yanzu ba ya loading ko yana da matsala, gwada canzawa zuwa wani watsa a ƙasa. Watsa daban-daban na iya aiki da kyau dangane da haɗin intanet ɗin ku.',
    'makkah_live.open_youtube': 'Buɗe a YouTube',
    'makkah_live.loading': 'Ana loading watsa kai tsaye...',
    
    // Prayer Times
    'prayer.fajr': 'Fajr',
    'prayer.dhuhr': 'Dhuhr',
    'prayer.asr': 'Asr',
    'prayer.maghrib': 'Maghrib',
    'prayer.isha': 'Isha',
    'prayer.next_prayer': 'Sallar da ke zuwa',
    'prayer.time_remaining': 'Lokaci da ya rage',
    
    // AI Noor
    'ai_noor.title': 'AI Noor',
    'ai_noor.subtitle': 'Yi tambayoyi na Musulunci tare da jagora mai taushi da taimako',
    'ai_noor.placeholder': 'Tambayi game da Musulunci, salla, Alkurani, Tijaniyya...',
    'ai_noor.thinking': 'AI Noor yana tunani...',
    
    // Settings
    'settings.language': 'Harshe',
    'settings.notifications': 'Sanarwa',
    'settings.privacy': 'Kebantawa',
    'settings.about': 'Game da',
    'settings.version': 'Sigar',
    
    // Language Options
    'language.english': 'English',
    'language.french': 'Français',
    'language.arabic': 'العربية',
    'language.hausa': 'Hausa',
  },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language on app start
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage && ['en', 'fr', 'ar', 'ha'].includes(savedLanguage)) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    try {
      setLanguageState(newLanguage);
      await AsyncStorage.setItem('app_language', newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};