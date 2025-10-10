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
    
    // Tijaniyah Features
    'tijaniyah.title': 'Tijaniyah Features',
    'tijaniyah.tariqa': 'Tariqa Tijaniyyah',
    'tijaniyah.tariqa_desc': 'Learn about the Tijani path',
    'tijaniyah.fiqh': 'Tijaniya Fiqh',
    'tijaniyah.fiqh_desc': 'Understanding Tijaniya jurisprudence',
    'tijaniyah.lazim': 'Tijaniya Lazim',
    'tijaniyah.lazim_desc': 'The obligatory litanies',
    'tijaniyah.wazifa': 'Wazifa',
    'tijaniyah.wazifa_desc': 'Daily Wazifa practice',
    'tijaniyah.haylala': 'Haylala',
    'tijaniyah.haylala_desc': 'Friday dhikr',
    'tijaniyah.azan': 'Azan',
    'tijaniyah.azan_desc': 'Call to prayer',
    'tijaniyah.scholars': 'Scholars',
    'tijaniyah.scholars_desc': 'Tijaniya scholars and biographies',
    
    // Scholars
    'scholars.title': 'Tijaniya Scholars',
    'scholars.subtitle': 'Learn about the great scholars of Tariqa Tijaniyya',
    'scholars.search_placeholder': 'Search scholars...',
    'scholar_detail.biography': 'Biography',
    'scholar_detail.details': 'Details',
    
    // Donate
    'donate.title': 'Donate',
    'donate.subtitle': 'Support the Tijaniyah Pro App',
    'donate.mtn_mobile': 'MTN Mobile Money',
    'donate.airtel_tigo': 'Airtel/Tigo Money',
    'donate.reference': 'Reference',
    'donate.thank_you': 'Thank you for your support!',
    
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
    'makkah_live.tv_channels': 'Islamic & Quran TV Channels',
    'makkah_live.tv_channels_subtitle': 'Visit official websites to watch live',
    'makkah_live.category_quran': 'Quran',
    'makkah_live.category_islamic': 'Islamic',
    'makkah_live.category_news': 'News',
    'makkah_live.category_educational': 'Educational',
    
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
    
    // Azan
    'azan.title': 'Azan',
    'azan.subtitle': 'Call to Prayer',
    'azan.select_muezzin': 'Select Muezzin',
    
    // Wazifa
    'wazifa.title': 'Wazifa',
    'wazifa.subtitle': 'Daily Spiritual Practice',
    
    // Community
    'community.title': 'Community',
    'community.subtitle': 'Connect with fellow Muslims worldwide',
    'community.search_placeholder': 'Search posts, users...',
    'community.write_comment': 'Write a comment...',
    'community.create_post': 'Create Post',
    'community.edit_post': 'Edit Post',
    'community.whats_on_mind': 'What\'s on your mind? Share something inspiring...',
    'community.edit_your_post': 'Edit your post...',
    'community.type_message': 'Type a message...',
    'community.post_options': 'Post Options',
    'community.report_post': 'Report Post',
    'community.delete_post': 'Delete Post',
    'community.are_you_sure': 'Are you sure you want to delete this post?',
    'community.why_reporting': 'Why are you reporting this post?',
    'community.spam': 'Spam',
    'community.inappropriate': 'Inappropriate',
    'community.harassment': 'Harassment',
    'community.no_posts': 'No posts found',
    'community.try_search': 'Try adjusting your search',
    'community.first_share': 'Be the first to share something inspiring',
    'community.loading_posts': 'Loading posts...',
    'community.no_messages': 'No messages yet',
    'community.start_conversation': 'Start the conversation!',
    'community.messages': 'Messages',
    'community.your_conversations': 'Your conversations',
    'community.no_conversations': 'No conversations yet',
    'community.start_chatting': 'Start chatting with other community members by clicking the chat button on their posts',
    'community.loading_conversations': 'Loading conversations...',
    
    // Register
    'register.title': 'Create Account',
    'register.subtitle': 'Join the Tijaniyah Pro community',
    'register.full_name': 'Full Name',
    'register.email': 'Email Address',
    'register.phone': 'Phone Number (Optional)',
    'register.city': 'City',
    'register.country': 'Country',
    'register.password': 'Password',
    'register.confirm_password': 'Confirm Password',
    'register.create_account': 'Create Account',
    'register.already_have_account': 'Already have an account?',
    'register.sign_in': 'Sign In',
    'register.terms_agreement': 'By creating an account, you agree to our Terms of Service and Privacy Policy',
    
    // Journal
    'journal.title': 'Islamic Journal',
    'journal.subtitle': 'Reflect on your spiritual journey',
    'journal.search_placeholder': 'Search entries...',
    'journal.add_entry': 'Add Entry',
    'journal.edit_entry': 'Edit Entry',
    'journal.entry_title': 'Title',
    'journal.entry_content': 'Write your reflection...',
    'journal.add_tag': 'Add a tag...',
    'journal.save_entry': 'Save Entry',
    'journal.cancel': 'Cancel',
    'journal.delete_entry': 'Delete Entry',
    'journal.are_you_sure_delete': 'Are you sure you want to delete this entry?',
    'journal.no_entries': 'No entries found',
    'journal.start_writing': 'Start writing your spiritual reflections',
    'journal.loading_entries': 'Loading entries...',
    
    // Donate
    'donate.enter_name': 'Enter your full name',
    'donate.enter_email': 'Enter your email',
    'donate.enter_phone': 'Enter your phone number',
    'donate.enter_amount': 'Enter amount',
    'donate.any_message': 'Any message for us...',
    'donate.donate_now': 'Donate Now',
    'donate.thank_you_message': 'Thank you for your generous support!',
    
    // Profile
    'profile.title': 'Profile',
    'profile.subtitle': 'Manage your account information',
    'profile.enter_name': 'Enter your name',
    'profile.tell_about': 'Tell us about yourself...',
    'profile.edit_profile': 'Edit Profile',
    'profile.save_changes': 'Save Changes',
    'profile.enter_email': 'Enter email',
    'profile.enter_phone': 'Enter phone number',
    'profile.enter_location': 'Enter location',
    'profile.personal_info': 'Personal Information',
    'profile.contact_info': 'Contact Information',
    'profile.account_settings': 'Account Settings',
    'profile.logout': 'Logout',
    'profile.delete_account': 'Delete Account',
    'profile.are_you_sure_logout': 'Are you sure you want to logout?',
    'profile.are_you_sure_delete': 'Are you sure you want to delete your account? This action cannot be undone.',
    
    // Login
    'login.title': 'Welcome Back',
    'login.subtitle': 'Sign in to continue your spiritual journey',
    'login.email_placeholder': 'Email address',
    'login.password_placeholder': 'Password',
    'login.sign_in': 'Sign In',
    'login.forgot_password': 'Forgot Password?',
    'login.dont_have_account': 'Don\'t have an account?',
    'login.create_account': 'Create Account',
    'login.guest_mode': 'Continue as Guest',
    'login.invalid_credentials': 'Invalid email or password',
    'login.login_success': 'Welcome back!',
    
    // Quran
    'quran.title': 'Holy Quran',
    'quran.subtitle': 'Read and reflect on the words of Allah',
    'quran.search_placeholder': 'Search chapters or verses...',
    'quran.chapters': 'Chapters',
    'quran.verses': 'Verses',
    'quran.verse': 'Verse',
    'quran.chapter': 'Chapter',
    'quran.loading': 'Loading...',
    'quran.error_loading': 'Error loading Quran text',
    'quran.retry': 'Retry',
    'quran.bookmark': 'Bookmark',
    'quran.share': 'Share',
    'quran.copy': 'Copy',
    'quran.audio': 'Audio',
    'quran.translation': 'Translation',
    'quran.arabic': 'Arabic',
    'quran.english': 'English',
    'quran.french': 'French',
    
    // Duas
    'duas.title': 'Duas & Supplications',
    'duas.subtitle': 'Powerful prayers for every occasion',
    'duas.search_placeholder': 'Search duas...',
    'duas.categories': 'Categories',
    'duas.morning': 'Morning',
    'duas.evening': 'Evening',
    'duas.before_sleep': 'Before Sleep',
    'duas.after_prayer': 'After Prayer',
    'duas.travel': 'Travel',
    'duas.illness': 'Illness',
    'duas.gratitude': 'Gratitude',
    'duas.forgiveness': 'Forgiveness',
    'duas.prosperity': 'Prosperity',
    'duas.protection': 'Protection',
    'duas.favorite': 'Favorite',
    'duas.recite': 'Recite',
    'duas.audio': 'Audio',
    'duas.share': 'Share',
    'duas.copy': 'Copy',
    'duas.bookmark': 'Bookmark',
    
    // Lessons
    'lessons.title': 'Islamic Lessons',
    'lessons.subtitle': 'Learn and grow in your faith',
    'lessons.search_placeholder': 'Search courses and lessons...',
    'lessons.categories': 'Categories',
    'lessons.beginner': 'Beginner',
    'lessons.intermediate': 'Intermediate',
    'lessons.advanced': 'Advanced',
    'lessons.quran': 'Quran',
    'lessons.hadith': 'Hadith',
    'lessons.fiqh': 'Fiqh',
    'lessons.aqeedah': 'Aqeedah',
    'lessons.tasawwuf': 'Tasawwuf',
    'lessons.history': 'History',
    'lessons.biography': 'Biography',
    'lessons.start_lesson': 'Start Lesson',
    'lessons.continue_lesson': 'Continue Lesson',
    'lessons.complete_lesson': 'Complete Lesson',
    'lessons.lesson_complete': 'Lesson Complete',
    'lessons.next_lesson': 'Next Lesson',
    'lessons.previous_lesson': 'Previous Lesson',
    'lessons.duration': 'Duration',
    'lessons.difficulty': 'Difficulty',
    'lessons.rating': 'Rating',
    
    // Wazifa
    'wazifa.seeking_refuge': 'Seeking Refuge',
    'wazifa.suratul_fatiha': 'Suratul Fatiha',
    'wazifa.salawat': 'Salawat',
    'wazifa.istighfar': 'Istighfar',
    'wazifa.la_ilaha': 'La Ilaha Illa Allah',
    'wazifa.muhammad_rasul': 'Muhammad Rasul Allah',
    'wazifa.astaghfirullah': 'Astaghfirullah',
    'wazifa.subhanallah': 'Subhanallah',
    'wazifa.alhamdulillah': 'Alhamdulillah',
    'wazifa.allahu_akbar': 'Allahu Akbar',
    'wazifa.la_ilaha_illa_hu': 'La Ilaha Illa Hu',
    'wazifa.count': 'Count',
    'wazifa.reset': 'Reset',
    'wazifa.complete': 'Complete',
    'wazifa.next_step': 'Next Step',
    'wazifa.previous_step': 'Previous Step',
    'wazifa.arabic': 'Arabic',
    'wazifa.transliteration': 'Transliteration',
    'wazifa.english': 'English',
    'wazifa.french': 'French',
    
    // Lazim
    'lazim.title': 'Lazim Tracker',
    'lazifa.subtitle': 'Track your daily spiritual commitments',
    'lazim.commitment_title': 'Commitment title',
    'lazim.description': 'Description (optional)',
    'lazim.add_commitment': 'Add Commitment',
    'lazim.edit_commitment': 'Edit Commitment',
    'lazim.delete_commitment': 'Delete Commitment',
    'lazim.are_you_sure_delete': 'Are you sure you want to delete this commitment?',
    'lazim.completed': 'Completed',
    'lazim.pending': 'Pending',
    'lazim.today': 'Today',
    'lazim.this_week': 'This Week',
    'lazim.this_month': 'This Month',
    'lazim.all_time': 'All Time',
    'lazim.streak': 'Streak',
    'lazim.days': 'Days',
    'lazim.mark_complete': 'Mark Complete',
    'lazim.mark_incomplete': 'Mark Incomplete',
    'lazim.no_commitments': 'No commitments yet',
    'lazim.start_tracking': 'Start tracking your spiritual commitments',
    
    // Chat
    'chat.title': 'Messages',
    'chat.subtitle': 'Your conversations',
    'chat.search_placeholder': 'Search conversations...',
    'chat.type_message': 'Type a message...',
    'chat.send': 'Send',
    'chat.online': 'Online',
    'chat.offline': 'Offline',
    'chat.last_seen': 'Last seen',
    'chat.no_conversations': 'No conversations yet',
    'chat.start_chatting': 'Start chatting with other community members',
    'chat.loading_conversations': 'Loading conversations...',
    'chat.no_messages': 'No messages yet',
    'chat.start_conversation': 'Start the conversation!',
    'chat.message_sent': 'Message sent',
    'chat.message_failed': 'Failed to send message',
    'chat.typing': 'Typing...',
    'chat.read': 'Read',
    'chat.delivered': 'Delivered',
    'chat.sent': 'Sent',
    'chat.call': 'Call',
    'chat.video_call': 'Video Call',
    'chat.voice_call': 'Voice Call',
    'chat.block_user': 'Block User',
    'chat.report_user': 'Report User',
    'chat.clear_chat': 'Clear Chat',
    'chat.delete_chat': 'Delete Chat',
    
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
    
    // Tijaniyah Features
    'tijaniyah.title': 'Fonctionnalités Tijaniyah',
    'tijaniyah.tariqa': 'Tariqa Tijaniyya',
    'tijaniyah.tariqa_desc': 'Découvrir la voie Tijaniyya',
    'tijaniyah.fiqh': 'Fiqh Tijaniyya',
    'tijaniyah.fiqh_desc': 'Comprendre la jurisprudence Tijaniyya',
    'tijaniyah.lazim': 'Lazim Tijaniyya',
    'tijaniyah.lazim_desc': 'Les litanies obligatoires',
    'tijaniyah.wazifa': 'Wazifa',
    'tijaniyah.wazifa_desc': 'Pratique quotidienne du Wazifa',
    'tijaniyah.haylala': 'Haylala',
    'tijaniyah.haylala_desc': 'Dhikr du vendredi',
    'tijaniyah.azan': 'Adhan',
    'tijaniyah.azan_desc': 'Appel à la prière',
    'tijaniyah.scholars': 'Savants',
    'tijaniyah.scholars_desc': 'Savants Tijaniyya et biographies',
    
    // Scholars
    'scholars.title': 'Savants Tijaniyya',
    'scholars.subtitle': 'Découvrez les grands savants de la Tariqa Tijaniyya',
    'scholars.search_placeholder': 'Rechercher des savants...',
    'scholar_detail.biography': 'Biographie',
    'scholar_detail.details': 'Détails',
    
    // Donate
    'donate.title': 'Faire un don',
    'donate.subtitle': "Soutenez l'application Tijaniyah Pro",
    'donate.mtn_mobile': 'MTN Mobile Money',
    'donate.airtel_tigo': 'Airtel/Tigo Money',
    'donate.reference': 'Référence',
    'donate.thank_you': 'Merci pour votre soutien !',
    
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
    'makkah_live.tv_channels': 'Chaînes TV Islamiques & Coraniques',
    'makkah_live.tv_channels_subtitle': 'Visitez les sites officiels pour regarder en direct',
    'makkah_live.category_quran': 'Coran',
    'makkah_live.category_islamic': 'Islamique',
    'makkah_live.category_news': 'Actualités',
    'makkah_live.category_educational': 'Éducatif',
    
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
    
    // Azan
    'azan.title': 'Adhan',
    'azan.subtitle': 'Appel à la prière',
    'azan.select_muezzin': 'Sélectionner un muezzin',
    
    // Wazifa
    'wazifa.title': 'Wazifa',
    'wazifa.subtitle': 'Pratique Spirituelle Quotidienne',
    
    // Community
    'community.title': 'Communauté',
    'community.subtitle': 'Connectez-vous avec d\'autres musulmans du monde entier',
    'community.search_placeholder': 'Rechercher des publications, utilisateurs...',
    'community.write_comment': 'Écrire un commentaire...',
    'community.create_post': 'Créer une Publication',
    'community.edit_post': 'Modifier la Publication',
    'community.whats_on_mind': 'À quoi pensez-vous ? Partagez quelque chose d\'inspirant...',
    'community.edit_your_post': 'Modifiez votre publication...',
    'community.type_message': 'Tapez un message...',
    'community.post_options': 'Options de Publication',
    'community.report_post': 'Signaler la Publication',
    'community.delete_post': 'Supprimer la Publication',
    'community.are_you_sure': 'Êtes-vous sûr de vouloir supprimer cette publication ?',
    'community.why_reporting': 'Pourquoi signalez-vous cette publication ?',
    'community.spam': 'Spam',
    'community.inappropriate': 'Inapproprié',
    'community.harassment': 'Harcèlement',
    'community.no_posts': 'Aucune publication trouvée',
    'community.try_search': 'Essayez d\'ajuster votre recherche',
    'community.first_share': 'Soyez le premier à partager quelque chose d\'inspirant',
    'community.loading_posts': 'Chargement des publications...',
    'community.no_messages': 'Aucun message pour le moment',
    'community.start_conversation': 'Commencez la conversation !',
    'community.messages': 'Messages',
    'community.your_conversations': 'Vos conversations',
    'community.no_conversations': 'Aucune conversation pour le moment',
    'community.start_chatting': 'Commencez à discuter avec d\'autres membres de la communauté en cliquant sur le bouton de chat sur leurs publications',
    'community.loading_conversations': 'Chargement des conversations...',
    
    // Register
    'register.title': 'Créer un Compte',
    'register.subtitle': 'Rejoignez la communauté Tijaniyah Pro',
    'register.full_name': 'Nom Complet',
    'register.email': 'Adresse Email',
    'register.phone': 'Numéro de Téléphone (Optionnel)',
    'register.city': 'Ville',
    'register.country': 'Pays',
    'register.password': 'Mot de Passe',
    'register.confirm_password': 'Confirmer le Mot de Passe',
    'register.create_account': 'Créer un Compte',
    'register.already_have_account': 'Vous avez déjà un compte ?',
    'register.sign_in': 'Se Connecter',
    'register.terms_agreement': 'En créant un compte, vous acceptez nos Conditions d\'Utilisation et notre Politique de Confidentialité',
    
    // Journal
    'journal.title': 'Journal Islamique',
    'journal.subtitle': 'Réfléchissez sur votre parcours spirituel',
    'journal.search_placeholder': 'Rechercher des entrées...',
    'journal.add_entry': 'Ajouter une Entrée',
    'journal.edit_entry': 'Modifier l\'Entrée',
    'journal.entry_title': 'Titre',
    'journal.entry_content': 'Écrivez votre réflexion...',
    'journal.add_tag': 'Ajouter un tag...',
    'journal.save_entry': 'Enregistrer l\'Entrée',
    'journal.cancel': 'Annuler',
    'journal.delete_entry': 'Supprimer l\'Entrée',
    'journal.are_you_sure_delete': 'Êtes-vous sûr de vouloir supprimer cette entrée ?',
    'journal.no_entries': 'Aucune entrée trouvée',
    'journal.start_writing': 'Commencez à écrire vos réflexions spirituelles',
    'journal.loading_entries': 'Chargement des entrées...',
    
    // Donate
    'donate.enter_name': 'Entrez votre nom complet',
    'donate.enter_email': 'Entrez votre email',
    'donate.enter_phone': 'Entrez votre numéro de téléphone',
    'donate.enter_amount': 'Entrez le montant',
    'donate.any_message': 'Un message pour nous...',
    'donate.donate_now': 'Faire un Don Maintenant',
    'donate.thank_you_message': 'Merci pour votre généreux soutien !',
    
    // Profile
    'profile.title': 'Profil',
    'profile.subtitle': 'Gérez les informations de votre compte',
    'profile.enter_name': 'Entrez votre nom',
    'profile.tell_about': 'Parlez-nous de vous...',
    'profile.edit_profile': 'Modifier le Profil',
    'profile.save_changes': 'Enregistrer les Modifications',
    'profile.enter_email': 'Entrez l\'email',
    'profile.enter_phone': 'Entrez le numéro de téléphone',
    'profile.enter_location': 'Entrez la localisation',
    'profile.personal_info': 'Informations Personnelles',
    'profile.contact_info': 'Informations de Contact',
    'profile.account_settings': 'Paramètres du Compte',
    'profile.logout': 'Déconnexion',
    'profile.delete_account': 'Supprimer le Compte',
    'profile.are_you_sure_logout': 'Êtes-vous sûr de vouloir vous déconnecter ?',
    'profile.are_you_sure_delete': 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action ne peut pas être annulée.',
    
    // Login
    'login.title': 'Bon Retour',
    'login.subtitle': 'Connectez-vous pour continuer votre parcours spirituel',
    'login.email_placeholder': 'Adresse email',
    'login.password_placeholder': 'Mot de passe',
    'login.sign_in': 'Se Connecter',
    'login.forgot_password': 'Mot de passe oublié ?',
    'login.dont_have_account': 'Vous n\'avez pas de compte ?',
    'login.create_account': 'Créer un Compte',
    'login.guest_mode': 'Continuer en tant qu\'Invité',
    'login.invalid_credentials': 'Email ou mot de passe invalide',
    'login.login_success': 'Bon retour !',
    
    // Quran
    'quran.title': 'Saint Coran',
    'quran.subtitle': 'Lisez et réfléchissez sur les paroles d\'Allah',
    'quran.search_placeholder': 'Rechercher des chapitres ou versets...',
    'quran.chapters': 'Chapitres',
    'quran.verses': 'Verset',
    'quran.verse': 'Verset',
    'quran.chapter': 'Chapitre',
    'quran.loading': 'Chargement...',
    'quran.error_loading': 'Erreur lors du chargement du texte du Coran',
    'quran.retry': 'Réessayer',
    'quran.bookmark': 'Signet',
    'quran.share': 'Partager',
    'quran.copy': 'Copier',
    'quran.audio': 'Audio',
    'quran.translation': 'Traduction',
    'quran.arabic': 'Arabe',
    'quran.english': 'Anglais',
    'quran.french': 'Français',
    
    // Duas
    'duas.title': 'Douas et Invocations',
    'duas.subtitle': 'Prieres puissantes pour chaque occasion',
    'duas.search_placeholder': 'Rechercher des douas...',
    'duas.categories': 'Catégories',
    'duas.morning': 'Matin',
    'duas.evening': 'Soir',
    'duas.before_sleep': 'Avant de Dormir',
    'duas.after_prayer': 'Après la Prière',
    'duas.travel': 'Voyage',
    'duas.illness': 'Maladie',
    'duas.gratitude': 'Gratitude',
    'duas.forgiveness': 'Pardon',
    'duas.prosperity': 'Prospérité',
    'duas.protection': 'Protection',
    'duas.favorite': 'Favori',
    'duas.recite': 'Réciter',
    'duas.audio': 'Audio',
    'duas.share': 'Partager',
    'duas.copy': 'Copier',
    'duas.bookmark': 'Signet',
    
    // Lessons
    'lessons.title': 'Leçons Islamiques',
    'lessons.subtitle': 'Apprenez et grandissez dans votre foi',
    'lessons.search_placeholder': 'Rechercher des cours et leçons...',
    'lessons.categories': 'Catégories',
    'lessons.beginner': 'Débutant',
    'lessons.intermediate': 'Intermédiaire',
    'lessons.advanced': 'Avancé',
    'lessons.quran': 'Coran',
    'lessons.hadith': 'Hadith',
    'lessons.fiqh': 'Fiqh',
    'lessons.aqeedah': 'Aqeedah',
    'lessons.tasawwuf': 'Tasawwuf',
    'lessons.history': 'Histoire',
    'lessons.biography': 'Biographie',
    'lessons.start_lesson': 'Commencer la Leçon',
    'lessons.continue_lesson': 'Continuer la Leçon',
    'lessons.complete_lesson': 'Terminer la Leçon',
    'lessons.lesson_complete': 'Leçon Terminée',
    'lessons.next_lesson': 'Leçon Suivante',
    'lessons.previous_lesson': 'Leçon Précédente',
    'lessons.duration': 'Durée',
    'lessons.difficulty': 'Difficulté',
    'lessons.rating': 'Note',
    
    // Wazifa
    'wazifa.seeking_refuge': 'Chercher Refuge',
    'wazifa.suratul_fatiha': 'Suratul Fatiha',
    'wazifa.salawat': 'Salawat',
    'wazifa.istighfar': 'Istighfar',
    'wazifa.la_ilaha': 'La Ilaha Illa Allah',
    'wazifa.muhammad_rasul': 'Muhammad Rasul Allah',
    'wazifa.astaghfirullah': 'Astaghfirullah',
    'wazifa.subhanallah': 'Subhanallah',
    'wazifa.alhamdulillah': 'Alhamdulillah',
    'wazifa.allahu_akbar': 'Allahu Akbar',
    'wazifa.la_ilaha_illa_hu': 'La Ilaha Illa Hu',
    'wazifa.count': 'Compte',
    'wazifa.reset': 'Réinitialiser',
    'wazifa.complete': 'Terminer',
    'wazifa.next_step': 'Étape Suivante',
    'wazifa.previous_step': 'Étape Précédente',
    'wazifa.arabic': 'Arabe',
    'wazifa.transliteration': 'Transcription',
    'wazifa.english': 'Anglais',
    'wazifa.french': 'Français',
    
    // Lazim
    'lazim.title': 'Suivi Lazim',
    'lazim.subtitle': 'Suivez vos engagements spirituels quotidiens',
    'lazim.commitment_title': 'Titre de l\'engagement',
    'lazim.description': 'Description (optionnel)',
    'lazim.add_commitment': 'Ajouter un Engagement',
    'lazim.edit_commitment': 'Modifier l\'Engagement',
    'lazim.delete_commitment': 'Supprimer l\'Engagement',
    'lazim.are_you_sure_delete': 'Êtes-vous sûr de vouloir supprimer cet engagement ?',
    'lazim.completed': 'Terminé',
    'lazim.pending': 'En Attente',
    'lazim.today': 'Aujourd\'hui',
    'lazim.this_week': 'Cette Semaine',
    'lazim.this_month': 'Ce Mois',
    'lazim.all_time': 'Tout Temps',
    'lazim.streak': 'Série',
    'lazim.days': 'Jours',
    'lazim.mark_complete': 'Marquer Terminé',
    'lazim.mark_incomplete': 'Marquer Incomplet',
    'lazim.no_commitments': 'Aucun engagement pour le moment',
    'lazim.start_tracking': 'Commencez à suivre vos engagements spirituels',
    
    // Chat
    'chat.title': 'Messages',
    'chat.subtitle': 'Vos conversations',
    'chat.search_placeholder': 'Rechercher des conversations...',
    'chat.type_message': 'Tapez un message...',
    'chat.send': 'Envoyer',
    'chat.online': 'En ligne',
    'chat.offline': 'Hors ligne',
    'chat.last_seen': 'Vu pour la dernière fois',
    'chat.no_conversations': 'Aucune conversation pour le moment',
    'chat.start_chatting': 'Commencez à discuter avec d\'autres membres de la communauté',
    'chat.loading_conversations': 'Chargement des conversations...',
    'chat.no_messages': 'Aucun message pour le moment',
    'chat.start_conversation': 'Commencez la conversation !',
    'chat.message_sent': 'Message envoyé',
    'chat.message_failed': 'Échec de l\'envoi du message',
    'chat.typing': 'En train de taper...',
    'chat.read': 'Lu',
    'chat.delivered': 'Livré',
    'chat.sent': 'Envoyé',
    'chat.call': 'Appeler',
    'chat.video_call': 'Appel Vidéo',
    'chat.voice_call': 'Appel Vocal',
    'chat.block_user': 'Bloquer l\'Utilisateur',
    'chat.report_user': 'Signaler l\'Utilisateur',
    'chat.clear_chat': 'Effacer le Chat',
    'chat.delete_chat': 'Supprimer le Chat',
    
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
    
    // Tijaniyah Features
    'tijaniyah.title': 'ميزات التجانية',
    'tijaniyah.tariqa': 'الطريقة التجانية',
    'tijaniyah.tariqa_desc': 'تعرّف على طريق التجانية',
    'tijaniyah.fiqh': 'فقه التجانية',
    'tijaniyah.fiqh_desc': 'فهم فقه التجانية',
    'tijaniyah.lazim': 'لازم التجانية',
    'tijaniyah.lazim_desc': 'الأوراد الواجبة',
    'tijaniyah.wazifa': 'الوظيفة',
    'tijaniyah.wazifa_desc': 'الوظيفة اليومية',
    'tijaniyah.haylala': 'الهيلالة',
    'tijaniyah.haylala_desc': 'ذكر الجمعة',
    'tijaniyah.azan': 'الأذان',
    'tijaniyah.azan_desc': 'نداء الصلاة',
    'tijaniyah.scholars': 'العلماء',
    'tijaniyah.scholars_desc': 'علماء التجانية والسير',
    
    // Scholars
    'scholars.title': 'علماء التجانية',
    'scholars.subtitle': 'تعرّف على كبار علماء الطريقة التجانية',
    'scholars.search_placeholder': 'ابحث عن العلماء...',
    'scholar_detail.biography': 'السيرة',
    'scholar_detail.details': 'تفاصيل',
    
    // Donate
    'donate.title': 'تبرع',
    'donate.subtitle': 'ادعم تطبيق التجانية برو',
    'donate.mtn_mobile': 'MTN موبايل موني',
    'donate.airtel_tigo': 'Airtel/Tigo موني',
    'donate.reference': 'المرجع',
    'donate.thank_you': 'شكراً لدعمك!',
    
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
    'makkah_live.tv_channels': 'قنوات تلفزيونية إسلامية وقرآنية',
    'makkah_live.tv_channels_subtitle': 'قم بزيارة المواقع الرسمية للمشاهدة المباشرة',
    'makkah_live.category_quran': 'قرآن',
    'makkah_live.category_islamic': 'إسلامي',
    'makkah_live.category_news': 'أخبار',
    'makkah_live.category_educational': 'تعليمي',
    
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
    
    // Azan
    'azan.title': 'الأذان',
    'azan.subtitle': 'نداء الصلاة',
    'azan.select_muezzin': 'اختر المؤذن',
    
    // Wazifa
    'wazifa.title': 'الوظيفة',
    'wazifa.subtitle': 'الممارسة الروحية اليومية',
    
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
    
    // Tijaniyah Features
    'tijaniyah.title': 'Fasalolin Tijaniyya',
    'tijaniyah.tariqa': 'Tariqa Tijaniyya',
    'tijaniyah.tariqa_desc': 'Koyi game da hanyar Tijaniyya',
    'tijaniyah.fiqh': 'Fiqhun Tijaniyya',
    'tijaniyah.fiqh_desc': 'Fahimtar dokokin Tijaniyya',
    'tijaniyah.lazim': 'Lazim na Tijaniyya',
    'tijaniyah.lazim_desc': 'Addu’o’in wajibai',
    'tijaniyah.wazifa': 'Wazifa',
    'tijaniyah.wazifa_desc': 'Aikin Wazifa na yau da kullum',
    'tijaniyah.haylala': 'Haylala',
    'tijaniyah.haylala_desc': 'Dhikrin Juma’a',
    'tijaniyah.azan': 'Azani',
    'tijaniyah.azan_desc': 'Kiran salla',
    'tijaniyah.scholars': 'Malamai',
    'tijaniyah.scholars_desc': 'Malamai na Tijaniyya da tarihin rayuwa',
    
    // Scholars
    'scholars.title': 'Malamai na Tijaniyya',
    'scholars.subtitle': 'Koyi game da manyan malamai na Tariqa Tijaniyya',
    'scholars.search_placeholder': 'Nemo malamai...',
    'scholar_detail.biography': 'Tarihin Rayuwa',
    'scholar_detail.details': 'Cikakkun bayanai',
    
    // Donate
    'donate.title': 'Ba da gudummawa',
    'donate.subtitle': 'Tallafa wa Tijaniyah Pro App',
    'donate.mtn_mobile': 'MTN Mobile Money',
    'donate.airtel_tigo': 'Airtel/Tigo Money',
    'donate.reference': 'Madaidaici',
    'donate.thank_you': 'Mun gode da tallafinka!',
    
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
    'makkah_live.tv_channels': 'Gidajen Talabijin na Musulunci & Alkur\'ani',
    'makkah_live.tv_channels_subtitle': 'Ziyarci shafukan hukuma don kallon kai tsaye',
    'makkah_live.category_quran': 'Alkur\'ani',
    'makkah_live.category_islamic': 'Musulunci',
    'makkah_live.category_news': 'Labarai',
    'makkah_live.category_educational': 'Ilimi',
    
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
    
    // Azan
    'azan.title': 'Azani',
    'azan.subtitle': 'Kiran salla',
    'azan.select_muezzin': 'Zaɓi mai kiran salla',
    
    // Wazifa
    'wazifa.title': 'Wazifa',
    'wazifa.subtitle': 'Aikin Ruhaniya na Yau da Kullum',
    
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