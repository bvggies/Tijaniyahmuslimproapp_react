export interface DailyReminder {
  id: number;
  title: string;
  titleArabic: string;
  content: string;
  contentArabic: string;
  category: 'prayer' | 'charity' | 'patience' | 'gratitude' | 'forgiveness' | 'knowledge' | 'family' | 'community';
  source?: string;
}

const dailyReminders: DailyReminder[] = [
  {
    id: 1,
    title: "Prayer Reminder",
    titleArabic: "تذكير الصلاة",
    content: "The first thing that will be judged among a man's deeds on the Day of Resurrection is the Prayer. If this is in good order, then he will succeed and prosper, and if it is defective, then he will fail and will be a loser.",
    contentArabic: "أول ما يحاسب عليه العبد يوم القيامة الصلاة، فإن صلحت صلح سائر عمله، وإن فسدت فسد سائر عمله",
    category: "prayer",
    source: "Prophet Muhammad (PBUH)"
  },
  {
    id: 2,
    title: "Charity Reminder",
    titleArabic: "تذكير الصدقة",
    content: "Charity does not decrease wealth, no one forgives another except that Allah increases his honor, and no one humbles himself for the sake of Allah except that Allah raises his status.",
    contentArabic: "ما نقصت صدقة من مال، وما زاد الله عبداً بعفو إلا عزاً، وما تواضع أحد لله إلا رفعه الله",
    category: "charity",
    source: "Prophet Muhammad (PBUH)"
  },
  {
    id: 3,
    title: "Patience Reminder",
    titleArabic: "تذكير الصبر",
    content: "How wonderful is the affair of the believer, for his affairs are all good, and this applies to no one but the believer. If something good happens to him, he is grateful for it and that is good for him. If something bad happens to him, he bears it with patience and that is good for him.",
    contentArabic: "عجباً لأمر المؤمن إن أمره كله خير، وليس ذاك لأحد إلا للمؤمن، إن أصابته سراء شكر فكان خيراً له، وإن أصابته ضراء صبر فكان خيراً له",
    category: "patience",
    source: "Prophet Muhammad (PBUH)"
  },
  {
    id: 4,
    title: "Gratitude Reminder",
    titleArabic: "تذكير الشكر",
    content: "If you are grateful, I will give you more; but if you are ungrateful, verily My punishment is indeed severe.",
    contentArabic: "لئن شكرتم لأزيدنكم ولئن كفرتم إن عذابي لشديد",
    category: "gratitude",
    source: "Quran 14:7"
  },
  {
    id: 5,
    title: "Forgiveness Reminder",
    titleArabic: "تذكير المغفرة",
    content: "O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.",
    contentArabic: "يا عبادي الذين أسرفوا على أنفسهم لا تقنطوا من رحمة الله إن الله يغفر الذنوب جميعاً إنه هو الغفور الرحيم",
    category: "forgiveness",
    source: "Quran 39:53"
  },
  {
    id: 6,
    title: "Knowledge Reminder",
    titleArabic: "تذكير العلم",
    content: "Seeking knowledge is obligatory upon every Muslim.",
    contentArabic: "طلب العلم فريضة على كل مسلم",
    category: "knowledge",
    source: "Prophet Muhammad (PBUH)"
  },
  {
    id: 7,
    title: "Family Reminder",
    titleArabic: "تذكير الأسرة",
    content: "The best of you are those who are best to their families, and I am the best of you to my family.",
    contentArabic: "خيركم خيركم لأهله، وأنا خيركم لأهلي",
    category: "family",
    source: "Prophet Muhammad (PBUH)"
  },
  {
    id: 8,
    title: "Community Reminder",
    titleArabic: "تذكير المجتمع",
    content: "The believers in their mutual kindness, compassion, and sympathy are just like one body. When one of the limbs suffers, the whole body responds to it with wakefulness and fever.",
    contentArabic: "مثل المؤمنين في توادهم وتراحمهم وتعاطفهم مثل الجسد إذا اشتكى منه عضو تداعى له سائر الجسد بالسهر والحمى",
    category: "community",
    source: "Prophet Muhammad (PBUH)"
  },
  {
    id: 9,
    title: "Prayer Reminder",
    titleArabic: "تذكير الصلاة",
    content: "The key to Paradise is prayer, and the key to prayer is ablution.",
    contentArabic: "مفتاح الجنة الصلاة، ومفتاح الصلاة الوضوء",
    category: "prayer",
    source: "Prophet Muhammad (PBUH)"
  },
  {
    id: 10,
    title: "Charity Reminder",
    titleArabic: "تذكير الصدقة",
    content: "The believer's shade on the Day of Resurrection will be his charity.",
    contentArabic: "ظل المؤمن يوم القيامة صدقته",
    category: "charity",
    source: "Prophet Muhammad (PBUH)"
  },
  {
    id: 11,
    title: "Patience Reminder",
    titleArabic: "تذكير الصبر",
    content: "And be patient, for indeed, Allah does not allow to be lost the reward of those who do good.",
    contentArabic: "واصبر فإن الله لا يضيع أجر المحسنين",
    category: "patience",
    source: "Quran 11:115"
  },
  {
    id: 12,
    title: "Gratitude Reminder",
    titleArabic: "تذكير الشكر",
    content: "And We have certainly created man in the best of stature. Then We return him to the lowest of the low, except for those who believe and do righteous deeds.",
    contentArabic: "لقد خلقنا الإنسان في أحسن تقويم ثم رددناه أسفل سافلين إلا الذين آمنوا وعملوا الصالحات",
    category: "gratitude",
    source: "Quran 95:4-6"
  },
  {
    id: 13,
    title: "Forgiveness Reminder",
    titleArabic: "تذكير المغفرة",
    content: "And whoever does evil or wrongs himself but then seeks forgiveness of Allah will find Allah Forgiving and Merciful.",
    contentArabic: "ومن يعمل سوءاً أو يظلم نفسه ثم يستغفر الله يجد الله غفوراً رحيماً",
    category: "forgiveness",
    source: "Quran 4:110"
  },
  {
    id: 14,
    title: "Knowledge Reminder",
    titleArabic: "تذكير العلم",
    content: "Read in the name of your Lord who created. Created man from a clinging substance. Read, and your Lord is the most Generous.",
    contentArabic: "اقرأ باسم ربك الذي خلق خلق الإنسان من علق اقرأ وربك الأكرم",
    category: "knowledge",
    source: "Quran 96:1-3"
  },
  {
    id: 15,
    title: "Family Reminder",
    titleArabic: "تذكير الأسرة",
    content: "And your Lord has decreed that you not worship except Him, and to parents, good treatment. Whether one or both of them reach old age with you, say not to them a word of contempt, nor repel them, but address them in terms of honor.",
    contentArabic: "وقضى ربك ألا تعبدوا إلا إياه وبالوالدين إحساناً إما يبلغن عندك الكبر أحدهما أو كلاهما فلا تقل لهما أف ولا تنهرهما وقل لهما قولاً كريماً",
    category: "family",
    source: "Quran 17:23"
  },
  {
    id: 16,
    title: "Community Reminder",
    titleArabic: "تذكير المجتمع",
    content: "And hold firmly to the rope of Allah all together and do not become divided. And remember the favor of Allah upon you when you were enemies and He brought your hearts together and you became, by His favor, brothers.",
    contentArabic: "واعتصموا بحبل الله جميعاً ولا تفرقوا واذكروا نعمة الله عليكم إذ كنتم أعداء فألف بين قلوبكم فأصبحتم بنعمته إخواناً",
    category: "community",
    source: "Quran 3:103"
  },
  {
    id: 17,
    title: "Prayer Reminder",
    titleArabic: "تذكير الصلاة",
    content: "And establish prayer for My remembrance.",
    contentArabic: "وأقم الصلاة لذكري",
    category: "prayer",
    source: "Quran 20:14"
  },
  {
    id: 18,
    title: "Charity Reminder",
    titleArabic: "تذكير الصدقة",
    content: "You will not attain righteousness until you spend from that which you love. And whatever you spend - indeed, Allah is Knowing of it.",
    contentArabic: "لن تنالوا البر حتى تنفقوا مما تحبون وما تنفقوا من شيء فإن الله به عليم",
    category: "charity",
    source: "Quran 3:92"
  },
  {
    id: 19,
    title: "Patience Reminder",
    titleArabic: "تذكير الصبر",
    content: "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient.",
    contentArabic: "ولنبلونكم بشيء من الخوف والجوع ونقص من الأموال والأنفس والثمرات وبشر الصابرين",
    category: "patience",
    source: "Quran 2:155"
  },
  {
    id: 20,
    title: "Gratitude Reminder",
    titleArabic: "تذكير الشكر",
    content: "And if you should count the favors of Allah, you could not enumerate them. Indeed, Allah is Forgiving and Merciful.",
    contentArabic: "وإن تعدوا نعمة الله لا تحصوها إن الله لغفور رحيم",
    category: "gratitude",
    source: "Quran 16:18"
  },
  {
    id: 21,
    title: "Forgiveness Reminder",
    titleArabic: "تذكير المغفرة",
    content: "And those who, when they commit an immorality or wrong themselves, remember Allah and seek forgiveness for their sins - and who can forgive sins except Allah?",
    contentArabic: "والذين إذا فعلوا فاحشة أو ظلموا أنفسهم ذكروا الله فاستغفروا لذنوبهم ومن يغفر الذنوب إلا الله",
    category: "forgiveness",
    source: "Quran 3:135"
  },
  {
    id: 22,
    title: "Knowledge Reminder",
    titleArabic: "تذكير العلم",
    content: "And say, 'My Lord, increase me in knowledge.'",
    contentArabic: "وقل رب زدني علماً",
    category: "knowledge",
    source: "Quran 20:114"
  },
  {
    id: 23,
    title: "Family Reminder",
    titleArabic: "تذكير الأسرة",
    content: "And We have enjoined upon man care for his parents. His mother carried him, increasing her in weakness upon weakness, and his weaning is in two years. Be grateful to Me and to your parents; to Me is the final destination.",
    contentArabic: "ووصينا الإنسان بوالديه حملته أمه وهناً على وهن وفصاله في عامين أن اشكر لي ولوالديك إلي المصير",
    category: "family",
    source: "Quran 31:14"
  },
  {
    id: 24,
    title: "Community Reminder",
    titleArabic: "تذكير المجتمع",
    content: "And cooperate in righteousness and piety, but do not cooperate in sin and aggression. And fear Allah; indeed, Allah is severe in penalty.",
    contentArabic: "وتعاونوا على البر والتقوى ولا تعاونوا على الإثم والعدوان واتقوا الله إن الله شديد العقاب",
    category: "community",
    source: "Quran 5:2"
  },
  {
    id: 25,
    title: "Prayer Reminder",
    titleArabic: "تذكير الصلاة",
    content: "Indeed, prayer has been decreed upon the believers a decree of specified times.",
    contentArabic: "إن الصلاة كانت على المؤمنين كتاباً موقوتاً",
    category: "prayer",
    source: "Quran 4:103"
  },
  {
    id: 26,
    title: "Charity Reminder",
    titleArabic: "تذكير الصدقة",
    content: "The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes; in each spike is a hundred grains. And Allah multiplies for whom He wills.",
    contentArabic: "مثل الذين ينفقون أموالهم في سبيل الله كمثل حبة أنبتت سبع سنابل في كل سنبلة مائة حبة والله يضاعف لمن يشاء",
    category: "charity",
    source: "Quran 2:261"
  },
  {
    id: 27,
    title: "Patience Reminder",
    titleArabic: "تذكير الصبر",
    content: "And be patient, for your patience is not but through Allah. And do not grieve over them and do not be in distress over what they conspire.",
    contentArabic: "واصبر وما صبرك إلا بالله ولا تحزن عليهم ولا تك في ضيق مما يمكرون",
    category: "patience",
    source: "Quran 16:127"
  },
  {
    id: 28,
    title: "Gratitude Reminder",
    titleArabic: "تذكير الشكر",
    content: "And it is He who made the night and the day in succession for whoever desires to remember or desires gratitude.",
    contentArabic: "وهو الذي جعل الليل والنهار خلفة لمن أراد أن يذكر أو أراد شكوراً",
    category: "gratitude",
    source: "Quran 25:62"
  },
  {
    id: 29,
    title: "Forgiveness Reminder",
    titleArabic: "تذكير المغفرة",
    content: "And whoever repents and does righteousness does indeed repent to Allah with proper repentance.",
    contentArabic: "ومن تاب وعمل صالحاً فإنه يتوب إلى الله متاباً",
    category: "forgiveness",
    source: "Quran 25:71"
  },
  {
    id: 30,
    title: "Knowledge Reminder",
    titleArabic: "تذكير العلم",
    content: "And those who have been given knowledge may see that what is revealed to you from your Lord is the truth, and it guides to the path of the Exalted in Might, the Praiseworthy.",
    contentArabic: "ويرى الذين أوتوا العلم الذي أنزل إليك من ربك هو الحق ويهدي إلى صراط العزيز الحميد",
    category: "knowledge",
    source: "Quran 34:6"
  },
  {
    id: 31,
    title: "Family Reminder",
    titleArabic: "تذكير الأسرة",
    content: "And We have enjoined upon man goodness to parents. But if they endeavor to make you associate with Me that of which you have no knowledge, do not obey them. To Me is your return, and I will inform you about what you used to do.",
    contentArabic: "ووصينا الإنسان بوالديه حسناً وإن جاهداك لتشرك بي ما ليس لك به علم فلا تطعهما إلي مرجعكم فأنبئكم بما كنتم تعملون",
    category: "family",
    source: "Quran 29:8"
  }
];

// Helper function to get timezone offset in minutes
const getTimezoneOffset = (timezone: string): number => {
  // Common timezone offsets in minutes
  const timezoneOffsets: { [key: string]: number } = {
    'UTC': 0,
    'GMT': 0,
    'EST': -300, // UTC-5
    'EDT': -240, // UTC-4
    'CST': -360, // UTC-6
    'CDT': -300, // UTC-5
    'MST': -420, // UTC-7
    'MDT': -360, // UTC-6
    'PST': -480, // UTC-8
    'PDT': -420, // UTC-7
    'JST': 540,  // UTC+9
    'CET': 60,   // UTC+1
    'CEST': 120, // UTC+2
    'EET': 120,  // UTC+2
    'EEST': 180, // UTC+3
    'MSK': 180,  // UTC+3
    'IST': 330,  // UTC+5:30
    'GST': 240,  // UTC+4 (UAE)
    'AST': 180,  // UTC+3 (Saudi Arabia)
    'PKT': 300,  // UTC+5 (Pakistan)
    'BDT': 360,  // UTC+6 (Bangladesh)
    'WIB': 420,  // UTC+7 (Indonesia)
    'WIT': 540,  // UTC+9 (Indonesia)
    'WITA': 480, // UTC+8 (Indonesia)
    'AEST': 600, // UTC+10 (Australia)
    'AEDT': 660, // UTC+11 (Australia)
    'NZST': 720, // UTC+12 (New Zealand)
    'NZDT': 780, // UTC+13 (New Zealand)
  };
  
  return timezoneOffsets[timezone] || 0;
};

export const getDailyReminder = (timezone?: string): DailyReminder => {
  const now = new Date();
  
  // Get the current date in the user's timezone
  let localDate: Date;
  if (timezone) {
    // Parse timezone offset from GMT format (e.g., "GMT+4", "GMT-5")
    const timezoneMatch = timezone.match(/GMT([+-]?\d+)/);
    if (timezoneMatch) {
      const offsetHours = parseInt(timezoneMatch[1]);
      const offsetMinutes = offsetHours * 60;
      
      // Convert UTC time to user's timezone
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const targetTime = new Date(utcTime + (offsetMinutes * 60000));
      localDate = targetTime;
    } else {
      // Fallback to device timezone
      localDate = now;
    }
  } else {
    // Use device's local timezone
    localDate = now;
  }
  
  // Calculate day of year in the user's timezone
  const yearStart = new Date(localDate.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((localDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Use day of year to get a consistent reminder for each day
  const reminderIndex = (dayOfYear - 1) % dailyReminders.length;
  return dailyReminders[reminderIndex];
};

export const getReminderByDate = (date: Date): DailyReminder => {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const reminderIndex = dayOfYear % dailyReminders.length;
  return dailyReminders[reminderIndex];
};

// Get the next time the reminder will change (next midnight in user's timezone)
export const getNextReminderChangeTime = (timezone?: string): Date => {
  const now = new Date();
  
  let localDate: Date;
  if (timezone) {
    const timezoneMatch = timezone.match(/GMT([+-]?\d+)/);
    if (timezoneMatch) {
      const offsetHours = parseInt(timezoneMatch[1]);
      const offsetMinutes = offsetHours * 60;
      
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const targetTime = new Date(utcTime + (offsetMinutes * 60000));
      localDate = targetTime;
    } else {
      localDate = now;
    }
  } else {
    localDate = now;
  }
  
  // Get next midnight in user's timezone
  const nextMidnight = new Date(localDate);
  nextMidnight.setDate(nextMidnight.getDate() + 1);
  nextMidnight.setHours(0, 0, 0, 0);
  
  // Convert back to device timezone for display
  if (timezone) {
    const timezoneMatch = timezone.match(/GMT([+-]?\d+)/);
    if (timezoneMatch) {
      const offsetHours = parseInt(timezoneMatch[1]);
      const offsetMinutes = offsetHours * 60;
      
      const utcTime = nextMidnight.getTime() - (offsetMinutes * 60000);
      const deviceTime = new Date(utcTime - (now.getTimezoneOffset() * 60000));
      return deviceTime;
    }
  }
  
  return nextMidnight;
};

export const getCategoryColor = (category: DailyReminder['category']): string => {
  const colors = {
    prayer: '#4CAF50',
    charity: '#FF9800',
    patience: '#2196F3',
    gratitude: '#9C27B0',
    forgiveness: '#F44336',
    knowledge: '#00BCD4',
    family: '#E91E63',
    community: '#795548'
  };
  return colors[category];
};

export const getCategoryIcon = (category: DailyReminder['category']): string => {
  const icons = {
    prayer: 'prayer',
    charity: 'heart',
    patience: 'hourglass',
    gratitude: 'thumbs-up',
    forgiveness: 'refresh',
    knowledge: 'book',
    family: 'people',
    community: 'globe'
  };
  return icons[category];
};
