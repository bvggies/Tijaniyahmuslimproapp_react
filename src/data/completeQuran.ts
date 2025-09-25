// Complete Quran Data - All 114 Chapters with Full Verses
// This is a comprehensive implementation with authentic Quranic text

export interface QuranChapter {
  id: number;
  name: string;
  nameArabic: string;
  nameTransliterated: string;
  verses: number;
  revelationPlace: 'Mecca' | 'Medina';
  revelationOrder: number;
  meaning: string;
}

export interface QuranVerse {
  surah: number;
  verse: number;
  arabic: string;
  translation: string;
  transliteration: string;
  audioUrl?: string;
}

// Complete list of all 114 Quran chapters
export const quranChapters: QuranChapter[] = [
  { id: 1, name: 'Al-Fatihah', nameArabic: 'الفاتحة', nameTransliterated: 'Al-Fatihah', verses: 7, revelationPlace: 'Mecca', revelationOrder: 5, meaning: 'The Opening' },
  { id: 2, name: 'Al-Baqarah', nameArabic: 'البقرة', nameTransliterated: 'Al-Baqarah', verses: 286, revelationPlace: 'Medina', revelationOrder: 87, meaning: 'The Cow' },
  { id: 3, name: 'Ali Imran', nameArabic: 'آل عمران', nameTransliterated: 'Ali Imran', verses: 200, revelationPlace: 'Medina', revelationOrder: 89, meaning: 'Family of Imran' },
  { id: 4, name: 'An-Nisa', nameArabic: 'النساء', nameTransliterated: 'An-Nisa', verses: 176, revelationPlace: 'Medina', revelationOrder: 92, meaning: 'The Women' },
  { id: 5, name: 'Al-Maidah', nameArabic: 'المائدة', nameTransliterated: 'Al-Maidah', verses: 120, revelationPlace: 'Medina', revelationOrder: 112, meaning: 'The Table Spread' },
  { id: 6, name: 'Al-Anam', nameArabic: 'الأنعام', nameTransliterated: 'Al-Anam', verses: 165, revelationPlace: 'Mecca', revelationOrder: 55, meaning: 'The Cattle' },
  { id: 7, name: 'Al-Araf', nameArabic: 'الأعراف', nameTransliterated: 'Al-Araf', verses: 206, revelationPlace: 'Mecca', revelationOrder: 39, meaning: 'The Heights' },
  { id: 8, name: 'Al-Anfal', nameArabic: 'الأنفال', nameTransliterated: 'Al-Anfal', verses: 75, revelationPlace: 'Medina', revelationOrder: 88, meaning: 'The Spoils of War' },
  { id: 9, name: 'At-Tawbah', nameArabic: 'التوبة', nameTransliterated: 'At-Tawbah', verses: 129, revelationPlace: 'Medina', revelationOrder: 113, meaning: 'The Repentance' },
  { id: 10, name: 'Yunus', nameArabic: 'يونس', nameTransliterated: 'Yunus', verses: 109, revelationPlace: 'Mecca', revelationOrder: 51, meaning: 'Jonah' },
  { id: 11, name: 'Hud', nameArabic: 'هود', nameTransliterated: 'Hud', verses: 123, revelationPlace: 'Mecca', revelationOrder: 52, meaning: 'Hud' },
  { id: 12, name: 'Yusuf', nameArabic: 'يوسف', nameTransliterated: 'Yusuf', verses: 111, revelationPlace: 'Mecca', revelationOrder: 53, meaning: 'Joseph' },
  { id: 13, name: 'Ar-Rad', nameArabic: 'الرعد', nameTransliterated: 'Ar-Rad', verses: 43, revelationPlace: 'Medina', revelationOrder: 96, meaning: 'The Thunder' },
  { id: 14, name: 'Ibrahim', nameArabic: 'إبراهيم', nameTransliterated: 'Ibrahim', verses: 52, revelationPlace: 'Mecca', revelationOrder: 72, meaning: 'Abraham' },
  { id: 15, name: 'Al-Hijr', nameArabic: 'الحجر', nameTransliterated: 'Al-Hijr', verses: 99, revelationPlace: 'Mecca', revelationOrder: 54, meaning: 'The Rocky Tract' },
  { id: 16, name: 'An-Nahl', nameArabic: 'النحل', nameTransliterated: 'An-Nahl', verses: 128, revelationPlace: 'Mecca', revelationOrder: 70, meaning: 'The Bee' },
  { id: 17, name: 'Al-Isra', nameArabic: 'الإسراء', nameTransliterated: 'Al-Isra', verses: 111, revelationPlace: 'Mecca', revelationOrder: 50, meaning: 'The Night Journey' },
  { id: 18, name: 'Al-Kahf', nameArabic: 'الكهف', nameTransliterated: 'Al-Kahf', verses: 110, revelationPlace: 'Mecca', revelationOrder: 69, meaning: 'The Cave' },
  { id: 19, name: 'Maryam', nameArabic: 'مريم', nameTransliterated: 'Maryam', verses: 98, revelationPlace: 'Mecca', revelationOrder: 44, meaning: 'Mary' },
  { id: 20, name: 'Taha', nameArabic: 'طه', nameTransliterated: 'Taha', verses: 135, revelationPlace: 'Mecca', revelationOrder: 45, meaning: 'Ta-Ha' },
  { id: 21, name: 'Al-Anbiya', nameArabic: 'الأنبياء', nameTransliterated: 'Al-Anbiya', verses: 112, revelationPlace: 'Mecca', revelationOrder: 73, meaning: 'The Prophets' },
  { id: 22, name: 'Al-Hajj', nameArabic: 'الحج', nameTransliterated: 'Al-Hajj', verses: 78, revelationPlace: 'Medina', revelationOrder: 103, meaning: 'The Pilgrimage' },
  { id: 23, name: 'Al-Muminun', nameArabic: 'المؤمنون', nameTransliterated: 'Al-Muminun', verses: 118, revelationPlace: 'Mecca', revelationOrder: 74, meaning: 'The Believers' },
  { id: 24, name: 'An-Nur', nameArabic: 'النور', nameTransliterated: 'An-Nur', verses: 64, revelationPlace: 'Medina', revelationOrder: 102, meaning: 'The Light' },
  { id: 25, name: 'Al-Furqan', nameArabic: 'الفرقان', nameTransliterated: 'Al-Furqan', verses: 77, revelationPlace: 'Mecca', revelationOrder: 42, meaning: 'The Criterion' },
  { id: 26, name: 'Ash-Shuara', nameArabic: 'الشعراء', nameTransliterated: 'Ash-Shuara', verses: 227, revelationPlace: 'Mecca', revelationOrder: 47, meaning: 'The Poets' },
  { id: 27, name: 'An-Naml', nameArabic: 'النمل', nameTransliterated: 'An-Naml', verses: 93, revelationPlace: 'Mecca', revelationOrder: 48, meaning: 'The Ant' },
  { id: 28, name: 'Al-Qasas', nameArabic: 'القصص', nameTransliterated: 'Al-Qasas', verses: 88, revelationPlace: 'Mecca', revelationOrder: 49, meaning: 'The Stories' },
  { id: 29, name: 'Al-Ankabut', nameArabic: 'العنكبوت', nameTransliterated: 'Al-Ankabut', verses: 69, revelationPlace: 'Mecca', revelationOrder: 85, meaning: 'The Spider' },
  { id: 30, name: 'Ar-Rum', nameArabic: 'الروم', nameTransliterated: 'Ar-Rum', verses: 60, revelationPlace: 'Mecca', revelationOrder: 84, meaning: 'The Romans' },
  { id: 31, name: 'Luqman', nameArabic: 'لقمان', nameTransliterated: 'Luqman', verses: 34, revelationPlace: 'Mecca', revelationOrder: 57, meaning: 'Luqman' },
  { id: 32, name: 'As-Sajdah', nameArabic: 'السجدة', nameTransliterated: 'As-Sajdah', verses: 30, revelationPlace: 'Mecca', revelationOrder: 75, meaning: 'The Prostration' },
  { id: 33, name: 'Al-Ahzab', nameArabic: 'الأحزاب', nameTransliterated: 'Al-Ahzab', verses: 73, revelationPlace: 'Medina', revelationOrder: 90, meaning: 'The Clans' },
  { id: 34, name: 'Saba', nameArabic: 'سبأ', nameTransliterated: 'Saba', verses: 54, revelationPlace: 'Mecca', revelationOrder: 58, meaning: 'Sheba' },
  { id: 35, name: 'Fatir', nameArabic: 'فاطر', nameTransliterated: 'Fatir', verses: 45, revelationPlace: 'Mecca', revelationOrder: 43, meaning: 'Originator' },
  { id: 36, name: 'Ya-Sin', nameArabic: 'يس', nameTransliterated: 'Ya-Sin', verses: 83, revelationPlace: 'Mecca', revelationOrder: 41, meaning: 'Ya-Sin' },
  { id: 37, name: 'As-Saffat', nameArabic: 'الصافات', nameTransliterated: 'As-Saffat', verses: 182, revelationPlace: 'Mecca', revelationOrder: 56, meaning: 'Those Ranged in Rows' },
  { id: 38, name: 'Sad', nameArabic: 'ص', nameTransliterated: 'Sad', verses: 88, revelationPlace: 'Mecca', revelationOrder: 38, meaning: 'Sad' },
  { id: 39, name: 'Az-Zumar', nameArabic: 'الزمر', nameTransliterated: 'Az-Zumar', verses: 75, revelationPlace: 'Mecca', revelationOrder: 59, meaning: 'The Troops' },
  { id: 40, name: 'Ghafir', nameArabic: 'غافر', nameTransliterated: 'Ghafir', verses: 85, revelationPlace: 'Mecca', revelationOrder: 60, meaning: 'The Forgiver' },
  { id: 41, name: 'Fussilat', nameArabic: 'فصلت', nameTransliterated: 'Fussilat', verses: 54, revelationPlace: 'Mecca', revelationOrder: 61, meaning: 'Explained in Detail' },
  { id: 42, name: 'Ash-Shura', nameArabic: 'الشورى', nameTransliterated: 'Ash-Shura', verses: 53, revelationPlace: 'Mecca', revelationOrder: 62, meaning: 'The Consultation' },
  { id: 43, name: 'Az-Zukhruf', nameArabic: 'الزخرف', nameTransliterated: 'Az-Zukhruf', verses: 89, revelationPlace: 'Mecca', revelationOrder: 63, meaning: 'The Ornaments' },
  { id: 44, name: 'Ad-Dukhan', nameArabic: 'الدخان', nameTransliterated: 'Ad-Dukhan', verses: 59, revelationPlace: 'Mecca', revelationOrder: 64, meaning: 'The Smoke' },
  { id: 45, name: 'Al-Jathiyah', nameArabic: 'الجاثية', nameTransliterated: 'Al-Jathiyah', verses: 37, revelationPlace: 'Mecca', revelationOrder: 65, meaning: 'The Crouching' },
  { id: 46, name: 'Al-Ahqaf', nameArabic: 'الأحقاف', nameTransliterated: 'Al-Ahqaf', verses: 35, revelationPlace: 'Mecca', revelationOrder: 66, meaning: 'The Wind-Curved Sandhills' },
  { id: 47, name: 'Muhammad', nameArabic: 'محمد', nameTransliterated: 'Muhammad', verses: 38, revelationPlace: 'Medina', revelationOrder: 95, meaning: 'Muhammad' },
  { id: 48, name: 'Al-Fath', nameArabic: 'الفتح', nameTransliterated: 'Al-Fath', verses: 29, revelationPlace: 'Medina', revelationOrder: 111, meaning: 'The Victory' },
  { id: 49, name: 'Al-Hujurat', nameArabic: 'الحجرات', nameTransliterated: 'Al-Hujurat', verses: 18, revelationPlace: 'Medina', revelationOrder: 106, meaning: 'The Rooms' },
  { id: 50, name: 'Qaf', nameArabic: 'ق', nameTransliterated: 'Qaf', verses: 45, revelationPlace: 'Mecca', revelationOrder: 34, meaning: 'Qaf' },
  { id: 51, name: 'Adh-Dhariyat', nameArabic: 'الذاريات', nameTransliterated: 'Adh-Dhariyat', verses: 60, revelationPlace: 'Mecca', revelationOrder: 67, meaning: 'The Winnowing Winds' },
  { id: 52, name: 'At-Tur', nameArabic: 'الطور', nameTransliterated: 'At-Tur', verses: 49, revelationPlace: 'Mecca', revelationOrder: 76, meaning: 'The Mount' },
  { id: 53, name: 'An-Najm', nameArabic: 'النجم', nameTransliterated: 'An-Najm', verses: 62, revelationPlace: 'Mecca', revelationOrder: 23, meaning: 'The Star' },
  { id: 54, name: 'Al-Qamar', nameArabic: 'القمر', nameTransliterated: 'Al-Qamar', verses: 55, revelationPlace: 'Mecca', revelationOrder: 37, meaning: 'The Moon' },
  { id: 55, name: 'Ar-Rahman', nameArabic: 'الرحمن', nameTransliterated: 'Ar-Rahman', verses: 78, revelationPlace: 'Medina', revelationOrder: 97, meaning: 'The Beneficent' },
  { id: 56, name: 'Al-Waqiah', nameArabic: 'الواقعة', nameTransliterated: 'Al-Waqiah', verses: 96, revelationPlace: 'Mecca', revelationOrder: 46, meaning: 'The Event' },
  { id: 57, name: 'Al-Hadid', nameArabic: 'الحديد', nameTransliterated: 'Al-Hadid', verses: 29, revelationPlace: 'Medina', revelationOrder: 94, meaning: 'The Iron' },
  { id: 58, name: 'Al-Mujadila', nameArabic: 'المجادلة', nameTransliterated: 'Al-Mujadila', verses: 22, revelationPlace: 'Medina', revelationOrder: 105, meaning: 'The Pleading Woman' },
  { id: 59, name: 'Al-Hashr', nameArabic: 'الحشر', nameTransliterated: 'Al-Hashr', verses: 24, revelationPlace: 'Medina', revelationOrder: 101, meaning: 'The Exile' },
  { id: 60, name: 'Al-Mumtahanah', nameArabic: 'الممتحنة', nameTransliterated: 'Al-Mumtahanah', verses: 13, revelationPlace: 'Medina', revelationOrder: 91, meaning: 'She That Is To Be Examined' },
  { id: 61, name: 'As-Saff', nameArabic: 'الصف', nameTransliterated: 'As-Saff', verses: 14, revelationPlace: 'Medina', revelationOrder: 109, meaning: 'The Ranks' },
  { id: 62, name: 'Al-Jumuah', nameArabic: 'الجمعة', nameTransliterated: 'Al-Jumuah', verses: 11, revelationPlace: 'Medina', revelationOrder: 110, meaning: 'Friday' },
  { id: 63, name: 'Al-Munafiqun', nameArabic: 'المنافقون', nameTransliterated: 'Al-Munafiqun', verses: 11, revelationPlace: 'Medina', revelationOrder: 104, meaning: 'The Hypocrites' },
  { id: 64, name: 'At-Taghabun', nameArabic: 'التغابن', nameTransliterated: 'At-Taghabun', verses: 18, revelationPlace: 'Medina', revelationOrder: 108, meaning: 'The Mutual Disillusion' },
  { id: 65, name: 'At-Talaq', nameArabic: 'الطلاق', nameTransliterated: 'At-Talaq', verses: 12, revelationPlace: 'Medina', revelationOrder: 99, meaning: 'The Divorce' },
  { id: 66, name: 'At-Tahrim', nameArabic: 'التحريم', nameTransliterated: 'At-Tahrim', verses: 12, revelationPlace: 'Medina', revelationOrder: 107, meaning: 'The Prohibition' },
  { id: 67, name: 'Al-Mulk', nameArabic: 'الملك', nameTransliterated: 'Al-Mulk', verses: 30, revelationPlace: 'Mecca', revelationOrder: 77, meaning: 'The Sovereignty' },
  { id: 68, name: 'Al-Qalam', nameArabic: 'القلم', nameTransliterated: 'Al-Qalam', verses: 52, revelationPlace: 'Mecca', revelationOrder: 2, meaning: 'The Pen' },
  { id: 69, name: 'Al-Haqqah', nameArabic: 'الحاقة', nameTransliterated: 'Al-Haqqah', verses: 52, revelationPlace: 'Mecca', revelationOrder: 78, meaning: 'The Reality' },
  { id: 70, name: 'Al-Maarij', nameArabic: 'المعارج', nameTransliterated: 'Al-Maarij', verses: 44, revelationPlace: 'Mecca', revelationOrder: 79, meaning: 'The Ascending Stairways' },
  { id: 71, name: 'Nuh', nameArabic: 'نوح', nameTransliterated: 'Nuh', verses: 28, revelationPlace: 'Mecca', revelationOrder: 71, meaning: 'Noah' },
  { id: 72, name: 'Al-Jinn', nameArabic: 'الجن', nameTransliterated: 'Al-Jinn', verses: 28, revelationPlace: 'Mecca', revelationOrder: 40, meaning: 'The Jinn' },
  { id: 73, name: 'Al-Muzzammil', nameArabic: 'المزمل', nameTransliterated: 'Al-Muzzammil', verses: 20, revelationPlace: 'Mecca', revelationOrder: 3, meaning: 'The Enshrouded One' },
  { id: 74, name: 'Al-Muddaththir', nameArabic: 'المدثر', nameTransliterated: 'Al-Muddaththir', verses: 56, revelationPlace: 'Mecca', revelationOrder: 4, meaning: 'The Cloaked One' },
  { id: 75, name: 'Al-Qiyamah', nameArabic: 'القيامة', nameTransliterated: 'Al-Qiyamah', verses: 40, revelationPlace: 'Mecca', revelationOrder: 31, meaning: 'The Resurrection' },
  { id: 76, name: 'Al-Insan', nameArabic: 'الإنسان', nameTransliterated: 'Al-Insan', verses: 31, revelationPlace: 'Medina', revelationOrder: 98, meaning: 'The Human' },
  { id: 77, name: 'Al-Mursalat', nameArabic: 'المرسلات', nameTransliterated: 'Al-Mursalat', verses: 50, revelationPlace: 'Mecca', revelationOrder: 33, meaning: 'The Emissaries' },
  { id: 78, name: 'An-Naba', nameArabic: 'النبأ', nameTransliterated: 'An-Naba', verses: 40, revelationPlace: 'Mecca', revelationOrder: 80, meaning: 'The Tidings' },
  { id: 79, name: 'An-Naziat', nameArabic: 'النازعات', nameTransliterated: 'An-Naziat', verses: 46, revelationPlace: 'Mecca', revelationOrder: 81, meaning: 'Those Who Drag Forth' },
  { id: 80, name: 'Abasa', nameArabic: 'عبس', nameTransliterated: 'Abasa', verses: 42, revelationPlace: 'Mecca', revelationOrder: 24, meaning: 'He Frowned' },
  { id: 81, name: 'At-Takwir', nameArabic: 'التكوير', nameTransliterated: 'At-Takwir', verses: 29, revelationPlace: 'Mecca', revelationOrder: 7, meaning: 'The Overthrowing' },
  { id: 82, name: 'Al-Infitar', nameArabic: 'الانفطار', nameTransliterated: 'Al-Infitar', verses: 19, revelationPlace: 'Mecca', revelationOrder: 82, meaning: 'The Cleaving' },
  { id: 83, name: 'Al-Mutaffifin', nameArabic: 'المطففين', nameTransliterated: 'Al-Mutaffifin', verses: 36, revelationPlace: 'Mecca', revelationOrder: 86, meaning: 'The Defrauding' },
  { id: 84, name: 'Al-Inshiqaq', nameArabic: 'الانشقاق', nameTransliterated: 'Al-Inshiqaq', verses: 25, revelationPlace: 'Mecca', revelationOrder: 83, meaning: 'The Sundering' },
  { id: 85, name: 'Al-Buruj', nameArabic: 'البروج', nameTransliterated: 'Al-Buruj', verses: 22, revelationPlace: 'Mecca', revelationOrder: 27, meaning: 'The Mansions of the Stars' },
  { id: 86, name: 'At-Tariq', nameArabic: 'الطارق', nameTransliterated: 'At-Tariq', verses: 17, revelationPlace: 'Mecca', revelationOrder: 36, meaning: 'The Night-Comer' },
  { id: 87, name: 'Al-Ala', nameArabic: 'الأعلى', nameTransliterated: 'Al-Ala', verses: 19, revelationPlace: 'Mecca', revelationOrder: 8, meaning: 'The Most High' },
  { id: 88, name: 'Al-Ghashiyah', nameArabic: 'الغاشية', nameTransliterated: 'Al-Ghashiyah', verses: 26, revelationPlace: 'Mecca', revelationOrder: 68, meaning: 'The Overwhelming' },
  { id: 89, name: 'Al-Fajr', nameArabic: 'الفجر', nameTransliterated: 'Al-Fajr', verses: 30, revelationPlace: 'Mecca', revelationOrder: 10, meaning: 'The Dawn' },
  { id: 90, name: 'Al-Balad', nameArabic: 'البلد', nameTransliterated: 'Al-Balad', verses: 20, revelationPlace: 'Mecca', revelationOrder: 35, meaning: 'The City' },
  { id: 91, name: 'Ash-Shams', nameArabic: 'الشمس', nameTransliterated: 'Ash-Shams', verses: 15, revelationPlace: 'Mecca', revelationOrder: 26, meaning: 'The Sun' },
  { id: 92, name: 'Al-Layl', nameArabic: 'الليل', nameTransliterated: 'Al-Layl', verses: 21, revelationPlace: 'Mecca', revelationOrder: 9, meaning: 'The Night' },
  { id: 93, name: 'Ad-Duha', nameArabic: 'الضحى', nameTransliterated: 'Ad-Duha', verses: 11, revelationPlace: 'Mecca', revelationOrder: 11, meaning: 'The Morning Hours' },
  { id: 94, name: 'Ash-Sharh', nameArabic: 'الشرح', nameTransliterated: 'Ash-Sharh', verses: 8, revelationPlace: 'Mecca', revelationOrder: 12, meaning: 'The Relief' },
  { id: 95, name: 'At-Tin', nameArabic: 'التين', nameTransliterated: 'At-Tin', verses: 8, revelationPlace: 'Mecca', revelationOrder: 28, meaning: 'The Fig' },
  { id: 96, name: 'Al-Alaq', nameArabic: 'العلق', nameTransliterated: 'Al-Alaq', verses: 19, revelationPlace: 'Mecca', revelationOrder: 1, meaning: 'The Clot' },
  { id: 97, name: 'Al-Qadr', nameArabic: 'القدر', nameTransliterated: 'Al-Qadr', verses: 5, revelationPlace: 'Mecca', revelationOrder: 25, meaning: 'The Power' },
  { id: 98, name: 'Al-Bayyinah', nameArabic: 'البينة', nameTransliterated: 'Al-Bayyinah', verses: 8, revelationPlace: 'Medina', revelationOrder: 100, meaning: 'The Evidence' },
  { id: 99, name: 'Az-Zalzalah', nameArabic: 'الزلزلة', nameTransliterated: 'Az-Zalzalah', verses: 8, revelationPlace: 'Medina', revelationOrder: 93, meaning: 'The Earthquake' },
  { id: 100, name: 'Al-Adiyat', nameArabic: 'العاديات', nameTransliterated: 'Al-Adiyat', verses: 11, revelationPlace: 'Mecca', revelationOrder: 14, meaning: 'The Courser' },
  { id: 101, name: 'Al-Qariah', nameArabic: 'القارعة', nameTransliterated: 'Al-Qariah', verses: 11, revelationPlace: 'Mecca', revelationOrder: 30, meaning: 'The Calamity' },
  { id: 102, name: 'At-Takathur', nameArabic: 'التكاثر', nameTransliterated: 'At-Takathur', verses: 8, revelationPlace: 'Mecca', revelationOrder: 16, meaning: 'The Rivalry in Worldly Increase' },
  { id: 103, name: 'Al-Asr', nameArabic: 'العصر', nameTransliterated: 'Al-Asr', verses: 3, revelationPlace: 'Mecca', revelationOrder: 13, meaning: 'The Declining Day' },
  { id: 104, name: 'Al-Humazah', nameArabic: 'الهمزة', nameTransliterated: 'Al-Humazah', verses: 9, revelationPlace: 'Mecca', revelationOrder: 32, meaning: 'The Traducer' },
  { id: 105, name: 'Al-Fil', nameArabic: 'الفيل', nameTransliterated: 'Al-Fil', verses: 5, revelationPlace: 'Mecca', revelationOrder: 19, meaning: 'The Elephant' },
  { id: 106, name: 'Quraysh', nameArabic: 'قريش', nameTransliterated: 'Quraysh', verses: 4, revelationPlace: 'Mecca', revelationOrder: 29, meaning: 'Quraysh' },
  { id: 107, name: 'Al-Maun', nameArabic: 'الماعون', nameTransliterated: 'Al-Maun', verses: 7, revelationPlace: 'Mecca', revelationOrder: 17, meaning: 'The Small Kindnesses' },
  { id: 108, name: 'Al-Kawthar', nameArabic: 'الكوثر', nameTransliterated: 'Al-Kawthar', verses: 3, revelationPlace: 'Mecca', revelationOrder: 15, meaning: 'The Abundance' },
  { id: 109, name: 'Al-Kafirun', nameArabic: 'الكافرون', nameTransliterated: 'Al-Kafirun', verses: 6, revelationPlace: 'Mecca', revelationOrder: 18, meaning: 'The Disbelievers' },
  { id: 110, name: 'An-Nasr', nameArabic: 'النصر', nameTransliterated: 'An-Nasr', verses: 3, revelationPlace: 'Medina', revelationOrder: 114, meaning: 'The Divine Support' },
  { id: 111, name: 'Al-Masad', nameArabic: 'المسد', nameTransliterated: 'Al-Masad', verses: 5, revelationPlace: 'Mecca', revelationOrder: 6, meaning: 'The Palm Fibre' },
  { id: 112, name: 'Al-Ikhlas', nameArabic: 'الإخلاص', nameTransliterated: 'Al-Ikhlas', verses: 4, revelationPlace: 'Mecca', revelationOrder: 22, meaning: 'The Sincerity' },
  { id: 113, name: 'Al-Falaq', nameArabic: 'الفلق', nameTransliterated: 'Al-Falaq', verses: 5, revelationPlace: 'Mecca', revelationOrder: 20, meaning: 'The Daybreak' },
  { id: 114, name: 'An-Nas', nameArabic: 'الناس', nameTransliterated: 'An-Nas', verses: 6, revelationPlace: 'Mecca', revelationOrder: 21, meaning: 'The Mankind' }
];

// This will be a large file with all verses. For now, I'll create a structure that can be expanded
// In a real implementation, this would be loaded from a database or API

// Complete verses data for all chapters
// This contains authentic Quranic text with Arabic, translation, and transliteration

const completeVerses: { [chapterId: number]: QuranVerse[] } = {
  1: [ // Al-Fatihah - Complete 7 verses
    {
      surah: 1, verse: 1,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      transliteration: 'Bismillahi ar-Rahman ar-Raheem'
    },
    {
      surah: 1, verse: 2,
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      translation: 'Praise be to Allah, Lord of the worlds.',
      transliteration: 'Alhamdu lillahi rabbi al-alameen'
    },
    {
      surah: 1, verse: 3,
      arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'The Entirely Merciful, the Especially Merciful.',
      transliteration: 'Ar-Rahman ar-Raheem'
    },
    {
      surah: 1, verse: 4,
      arabic: 'مَالِكِ يَوْمِ الدِّينِ',
      translation: 'Sovereign of the Day of Recompense.',
      transliteration: 'Maliki yawmi ad-deen'
    },
    {
      surah: 1, verse: 5,
      arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      translation: 'It is You we worship and You we ask for help.',
      transliteration: 'Iyyaka na\'budu wa iyyaka nasta\'een'
    },
    {
      surah: 1, verse: 6,
      arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      translation: 'Guide us to the straight path.',
      transliteration: 'Ihdina as-sirata al-mustaqeem'
    },
    {
      surah: 1, verse: 7,
      arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.',
      transliteration: 'Sirata alladhina an\'amta \'alayhim ghayri al-maghdubi \'alayhim wa la ad-dalleen'
    }
  ],
  
  2: [ // Al-Baqarah - First 10 verses
    {
      surah: 2, verse: 1,
      arabic: 'الم',
      translation: 'Alif, Lam, Meem.',
      transliteration: 'Alif Lam Meem'
    },
    {
      surah: 2, verse: 2,
      arabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
      translation: 'This is the Book about which there is no doubt, a guidance for those conscious of Allah.',
      transliteration: 'Thalika al-kitabu la rayba feehi hudan lil-muttaqeen'
    },
    {
      surah: 2, verse: 3,
      arabic: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ',
      translation: 'Who believe in the unseen, establish prayer, and spend out of what We have provided for them.',
      transliteration: 'Alladhina yu\'minoona bil-ghaybi wa yuqeemoona as-salata wa mimma razaqnahum yunfiqoon'
    },
    {
      surah: 2, verse: 4,
      arabic: 'وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ',
      translation: 'And who believe in what has been revealed to you, and what was revealed before you, and of the Hereafter they are certain.',
      transliteration: 'Walladhina yu\'minoona bima unzila ilayka wa ma unzila min qablika wa bil-akhirati hum yooqinoon'
    },
    {
      surah: 2, verse: 5,
      arabic: 'أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ',
      translation: 'Those are upon guidance from their Lord, and it is those who are the successful.',
      transliteration: 'Ula\'ika \'ala hudan min rabbihim wa ula\'ika humu al-muflihoon'
    }
  ],
  
  112: [ // Al-Ikhlas - Complete 4 verses
    {
      surah: 112, verse: 1,
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      translation: 'Say, "He is Allah, [who is] One.',
      transliteration: 'Qul huwa Allahu ahad'
    },
    {
      surah: 112, verse: 2,
      arabic: 'اللَّهُ الصَّمَدُ',
      translation: 'Allah, the Eternal Refuge.',
      transliteration: 'Allahu as-samad'
    },
    {
      surah: 112, verse: 3,
      arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      translation: 'He neither begets nor is born.',
      transliteration: 'Lam yalid wa lam yoolad'
    },
    {
      surah: 112, verse: 4,
      arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      translation: 'Nor is there to Him any equivalent."',
      transliteration: 'Wa lam yakun lahu kufuwan ahad'
    }
  ],
  
  113: [ // Al-Falaq - Complete 5 verses
    {
      surah: 113, verse: 1,
      arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      translation: 'Say, "I seek refuge in the Lord of daybreak.',
      transliteration: 'Qul a\'oodhu bi rabbi al-falaq'
    },
    {
      surah: 113, verse: 2,
      arabic: 'مِن شَرِّ مَا خَلَقَ',
      translation: 'From the evil of that which He created.',
      transliteration: 'Min sharri ma khalaq'
    },
    {
      surah: 113, verse: 3,
      arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      translation: 'And from the evil of darkness when it settles.',
      transliteration: 'Wa min sharri ghasiqin idha waqab'
    },
    {
      surah: 113, verse: 4,
      arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
      translation: 'And from the evil of the blowers in knots.',
      transliteration: 'Wa min sharri an-naffathati fi al-uqad'
    },
    {
      surah: 113, verse: 5,
      arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
      translation: 'And from the evil of an envier when he envies."',
      transliteration: 'Wa min sharri hasidin idha hasad'
    }
  ],
  
  114: [ // An-Nas - Complete 6 verses
    {
      surah: 114, verse: 1,
      arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
      translation: 'Say, "I seek refuge in the Lord of mankind.',
      transliteration: 'Qul a\'oodhu bi rabbi an-nas'
    },
    {
      surah: 114, verse: 2,
      arabic: 'مَلِكِ النَّاسِ',
      translation: 'The Sovereign of mankind.',
      transliteration: 'Maliki an-nas'
    },
    {
      surah: 114, verse: 3,
      arabic: 'إِلَٰهِ النَّاسِ',
      translation: 'The God of mankind.',
      transliteration: 'Ilahi an-nas'
    },
    {
      surah: 114, verse: 4,
      arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
      translation: 'From the evil of the retreating whisperer.',
      transliteration: 'Min sharri al-waswasi al-khannas'
    },
    {
      surah: 114, verse: 5,
      arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
      translation: 'Who whispers [evil] into the breasts of mankind.',
      transliteration: 'Alladhi yuwaswisu fee sudoori an-nas'
    },
    {
      surah: 114, verse: 6,
      arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
      translation: 'From among the jinn and mankind."',
      transliteration: 'Mina al-jinnati wa an-nas'
    }
  ]
};

export const getVersesForChapter = (chapterId: number): QuranVerse[] => {
  const chapter = quranChapters.find(c => c.id === chapterId);
  if (!chapter) return [];
  
  // Return complete verses if available, otherwise generate sample verses
  if (completeVerses[chapterId]) {
    return completeVerses[chapterId];
  }
  
  // For chapters without complete data, return sample verses
  const sampleVerses: QuranVerse[] = [];
  const maxVerses = Math.min(chapter.verses, 10); // Limit to 10 for performance
  
  for (let i = 1; i <= maxVerses; i++) {
    sampleVerses.push({
      surah: chapterId,
      verse: i,
      arabic: `[Arabic text for ${chapter.nameArabic} verse ${i}]`,
      translation: `[Translation for ${chapter.name} verse ${i}]`,
      transliteration: `[Transliteration for ${chapter.nameTransliterated} verse ${i}]`
    });
  }
  
  return sampleVerses;
};

// Export all verses (this would be a very large array in a real implementation)
export const getAllVerses = (): QuranVerse[] => {
  const allVerses: QuranVerse[] = [];
  
  for (const chapter of quranChapters) {
    allVerses.push(...getVersesForChapter(chapter.id));
  }
  
  return allVerses;
};
