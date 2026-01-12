import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  Image, 
  TextInput,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors, spacing, radius } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

const { width } = Dimensions.get('window');

interface Scholar {
  id: string;
  name: string;
  title: string;
  bio: string;
  frenchBio?: string;
  arabicBio?: string;
  hausaBio?: string;
  specialties: string[];
  image?: any;
  imageUrl?: string;
  details?: { heading: string; text: string; frenchText?: string; arabicText?: string; hausaText?: string }[];
}

const SCHOLARS: Scholar[] = [
  // 1. Sheikh Muhammad Gibrima
  {
    id: 'sheikh_muhammad_gibrima',
    name: "Sheikh Muhammad Gibrima (Zul-Ma'arif) (1902–1975)",
    title: 'Distinguished Tijani Scholar & Sufi of Nguru, Nigeria',
    bio: "Sheikh Muhammad Gibrima (1902–1975) was a distinguished Islamic scholar and Sufi from Nguru, Yobe State, Nigeria. Born into a Kanuri family rooted in the Tijaniyya, he immersed himself in Islamic learning from an early age. A prolific author, he wrote works including Jihaazu Saarih, Suril Musuun, Sidrat Al Muntahaa, Far'u An Nawaal, and Shajarat Al Kaun. A pivotal moment in his journey was meeting Shaykh Ibrahim Niasse in Senegal, which strengthened his commitment to the Tijani path. He was honored with the epithet 'Zul-Ma'arif' (Possessor of Knowledge) for his profound scholarship.",
    frenchBio: "Cheikh Muhammad Gibrima (1902–1975) était un érudit islamique distingué et soufi de Nguru, État de Yobe, Nigeria. Né dans une famille kanouri enracinée dans la Tijaniyya, il s'est plongé dans l'enseignement islamique dès son jeune âge. Auteur prolifique, il a écrit Jihaazu Saarih, Suril Musuun, Sidrat Al Muntahaa, Far'u An Nawaal et Shajarat Al Kaun. Un moment clé de son parcours fut sa rencontre avec Shaykh Ibrahim Niasse au Sénégal, qui renforça son engagement envers la voie tijaniyya. Il fut honoré du titre « Zul-Ma'arif » (Possesseur de la Connaissance) pour sa profonde érudition.",
    arabicBio: 'كان الشيخ محمد جِبْرِمَا (1902–1975) عالماً ومتصوفاً بارزاً من نْغورو بولاية يوبي في نيجيريا. وُلد في أسرة كانورية متجذّرة في الطريقة التجانية، وتشرّب علوم الإسلام منذ صغره. كان كاتباً غزير الإنتاج، ومن مؤلفاته: جهاز الصارح، سور المسون، سدرة المنتهى، فرع النوال، وشجرة الكون. وكانت نقطة تحوُّل في مسيرته لقاؤه بالشيخ إبراهيم نياس في السنغال، مما زاد التزامه بالطريقة التجانية. لُقِّب بـ «ذو المعارف» لعمق علمه.',
    hausaBio: "Sheikh Muhammad Gibrima (1902–1975) fitaccen malami ne kuma sufaye daga Nguru a jihar Yobe, Najeriya. An haife shi cikin iyalin Kanuri masu dogon alaka da Tijaniyya, ya tsunduma cikin ilimin addini tun ƙuruciya. Marubuci ne mai yawa; ya rubuta Jihaazu Saarih, Suril Musuun, Sidrat Al Muntahaa, Far'u An Nawaal, da Shajarat Al Kaun. Muhimmin mataki a tafiyarsa shi ne haduwarsa da Shaykh Ibrahim Niasse a Senegal, wanda ya ƙarfafa bin Tijaniyya. An girmama shi da lakabin 'Zul‑Ma'arif' wato Mai Ilimi saboda zurfin iliminsa.",
    specialties: ['Tariqa Tijaniyya', 'Sufism', 'Islamic Scholarship', 'Authorship', 'West African Islam'],
    image: require('../../assets/SHEIKH FATIHU.jpg'),
    details: [
      {
        heading: 'Early Life & Scholarship',
        text: "Born into a Kanuri Tijani family in Nguru, Sheikh Gibrima was immersed in Qur'an, fiqh, and Sufi ethics from an early age and became known for his precision in teaching and writing.",
        frenchText: "Né dans une famille kanouri tijani à Nguru, le Cheikh Gibrima fut plongé très tôt dans le Coran, le fiqh et l'éthique soufie, et se fit connaître par la rigueur de son enseignement et de ses écrits.",
        arabicText: 'وُلِد في أسرة كانورية تجانية في نغورو، فتشرّب منذ صغره القرآن والفقه وأخلاق التصوف، وعُرف بدقته في التعليم والكتابة.',
        hausaText: "An haife shi cikin iyalin Kanuri na Tijaniyya a Nguru; tun ƙuruciya ya tsunduma cikin Alkur'ani, fiqhu da ɗabi'un Sufanci, ya kuma shahara da tsantseni a koyarwa da rubutu."
      },
      {
        heading: 'Major Works',
        text: `Among his many writings are "Jihaazu Saarih," "Suril Musuun," "Sidrat Al Muntahaa," "Far'u An Nawaal," and "Shajarat Al Kaun," reflecting depth in theology and mysticism.`,
        frenchText: `Parmi ses nombreux écrits figurent « Jihaazu Saarih », « Suril Musuun », « Sidrat Al Muntahaa », « Far'u An Nawaal » et « Shajarat Al Kaun », témoignant d'une grande profondeur en théologie et mystique.`,
        arabicText: 'من مؤلفاته الكثيرة: «جهاز الصارح»، «سور المسون»، «سدرة المنتهى»، «فرع النوال»، و«شجرة الكون»، وكلها تعكس عمقاً في العقيدة والتصوف.',
        hausaText: `Daga cikin ayyukansa akwai "Jihaazu Saarih," "Suril Musuun," "Sidrat Al Muntahaa," "Far'u An Nawaal," da "Shajarat Al Kaun," masu nuna zurfin aqida da tasawwufi.`
      },
      {
        heading: 'Journey to Shaykh Ibrahim Niasse',
        text: 'His visit to Senegal to meet Shaykh Ibrahim Niasse profoundly shaped his spiritual path, leading to renewed commitment to the Tijaniyya and service to the Ummah.',
        frenchText: 'Sa visite au Sénégal pour rencontrer Shaykh Ibrahim Niasse a profondément marqué sa voie spirituelle, renforçant son engagement envers la Tijaniyya et le service de la Umma.',
        arabicText: 'كان لزيارته السنغال ولقائه بالشيخ إبراهيم نياس أثرٌ بالغ في مساره الروحي، مما جدّد التزامه بالطريقة التجانية وخدمة الأمة.',
        hausaText: "Ziyararsa zuwa Senegal inda ya haɗu da Shaykh Ibrahim Niasse ta yi matuƙar tasiri a tafiyarsa ta ruhaniya, ta ƙarfafa bin Tijaniyya da hidima ga al'umma."
      },
      {
        heading: `Zul‑Ma'arif – "Possessor of Knowledge"`,
        text: `He was honored with the epithet "Zul‑Ma'arif" (ذو المعارف), meaning "Possessor of Knowledge," recognizing his profound mastery of Islamic sciences and Sufi insight.`,
        frenchText: `Il fut honoré de l'épithète « Zul‑Ma'arif » (ذو المعارف), « Possesseur de la Connaissance », en reconnaissance de sa maîtrise des sciences islamiques et de sa pénétration soufie.`,
        arabicText: 'لُقِّب بـ «ذو المعارف»، اعترافاً بتمكُّنه العميق من العلوم الإسلامية وبصيرته الصوفية.',
        hausaText: `An yi masa lakabi da "Zul‑Ma'arif" ma'ana "Mai Ilimi," a matsayin yabo ga ƙwarewarsa cikin ilimin addini da hangen sufaye.`
      },
      {
        heading: 'Public Teaching & Method',
        text: 'Known for answering questions publicly so students could benefit, he cultivated scholars and companions through open discourse and practical guidance.',
        frenchText: `Connu pour répondre publiquement aux questions afin que les étudiants en profitent, il forma des savants et compagnons par le débat ouvert et l'orientation pratique.`,
        arabicText: 'اشتهر بإجابة الأسئلة علناً لينتفع بها الطلاب، وربّى العلماء والرفاق من خلال النقاش المفتوح والتوجيه العملي.',
        hausaText: `An san shi da bayar da amsoshi a bainar jama'a don dalibai su amfana, yana gina malamai da abokai ta tattaunawa budaddiya da shiriya ta aikace.`
      },
      {
        heading: 'Return to Nguru & Service',
        text: 'Guided to return to Nguru, he made it a center for Islamic learning, mentoring many students and addressing complex questions from far and wide.',
        frenchText: 'Guidé à retourner à Nguru, il en fit un centre de savoir islamique, encadrant de nombreux étudiants et répondant à des questions complexes venues de loin.',
        arabicText: 'وُجِّه إلى العودة إلى نغورو، فجعله مركزاً للتعليم الإسلامي، ورعى العديد من الطلاب وتصدّى لمسائل معقدة من أصقاع شتى.',
        hausaText: `An yi masa jagora ya koma Nguru, inda ya mai da shi cibiyar ilimin Musulunci, yana kula da ɗalibai da yawa kuma yana amsa manyan tambayoyi daga ko'ina.`
      },
      {
        heading: 'Legacy & Continuing Influence',
        text: 'His writings and students continue to shape Tijani learning in West Africa. His life remains a model of knowledge, humility, and service.',
        frenchText: `Ses écrits et ses élèves continuent de façonner l'apprentissage tijani en Afrique de l'Ouest. Sa vie demeure un modèle de savoir, d'humilité et de service.`,
        arabicText: 'كتبه وتلامذته لا يزالون يشكّلون التعلم التجاني في غرب أفريقيا. وتبقى حياته قدوة في العلم والتواضع والخدمة.',
        hausaText: `Littattafansa da almajiransa na cigaba da tsara koyon Tijaniyya a Yammacin Afirka. Rayuwarsa abin koyi ce na ilimi, tawali'u da hidima.`
      }
    ]
  },
  // 2. Sheikh Aliyu Harazimi
  {
    id: 'sheikh_aliyu_harazimi_kano',
    name: 'Shaykh Aliyu Harazimi (Kano) (1919–2013)',
    title: `Tijani Sufi Ascetic of Kano – Abu'l‑Anwar, Sahib al‑Dhikr`,
    bio: `A renowned Tijani ascetic and guide in Kano, emblematic of piety (tsoron‑Allah) and world‑renunciation (gudun duniya). His zawiya in Hausawa became famous in the 1980s for energetic dhikr (La ilaha illa'Llah – Muhammadun Rasulullah) and training seekers toward ma'rifa.`,
    frenchBio: `Ascète tijani et guide à Kano, emblème de piété (tsoron‑Allah) et de renoncement (gudun duniya). Sa zawiya à Hausawa devint célèbre dans les années 1980 pour le dhikr énergique (La ilaha illa'Llah – Muhammadun Rasulullah) et la formation des aspirants vers la ma'rifa.`,
    arabicBio: 'عارف تجاني وزاهد في كانو، مثال للتقوى وترك الدنيا. اشتهرت زاويته في حوساوا منذ الثمانينيات بالذكر القوي (لا إله إلا الله محمد رسول الله) وتربية السالكين نحو المعرفة بالله (المعرفة).',
    hausaBio: `Shahararren mai tasawwufi na Tijaniyya a Kano, abin koyi na tsoron Allah da gudun duniya. Zawiyarsa a Hausawa ta shahara tun shekarun 1980 da dhikr mai ƙarfi (La ilaha illa'Llah – Muhammadun Rasulullah) da tarbiyyar masu nema zuwa ma'rifa.`,
    specialties: ['Tariqa Tijaniyya', 'Dhikr & Salawat', 'Asceticism', 'Spiritual Training', 'Kano History'],
    image: require('../../assets/sheikaliu.jpeg'),
    details: [
      {
        heading: 'Introduction & Asceticism',
        text: `Emerged amid modern urban consumerism as a living critique through ascetic life, discipline, and constant dhikr; revered as Abu'l‑Anwar, Sahib al‑Dhikr wa'l‑Salat, Khadim Rasul Allah.`,
        frenchText: `Apparu au milieu du consumérisme urbain moderne comme critique vivante par l'ascèse, la discipline et le dhikr constant; vénéré comme Abu'l‑Anwar, Sahib al‑Dhikr wa'l‑Salat, Khadim Rasul Allah.`,
        arabicText: 'برز وسط نمط الاستهلاك الحضري الحديث كنقد حي عبر الزهد والانضباط والذكر الدائم؛ مُجِّل كـ «أبي الأنوار» و«صاحب الذكر والصلاة» و«خادم رسول الله».',
        hausaText: `Ya bayyana a zamanin son duniya na birane a matsayin suka ta rayuwar zuhudu, ladabi da dhikr na dindindin; ana girmama shi a matsayin Abu'l‑Anwar, Sahib al‑Dhikr wa'l‑Salat, Khadim Rasul Allah.`
      },
      {
        heading: 'Family Background & Education',
        text: `Born 9 Dhu'l‑Hijja 1336 AH (1919) in Hausawa, Kano; Fulani (Sullubawa/Yolawa). Early Qur'an and fiqh with his father; later with Malam Salihu studied the Tijani classic Jawahir al‑Ma'ani.`,
        frenchText: `Né le 9 Dhu'l‑Hijja 1336 H (1919) à Hausawa (Kano); Peul (Sullubawa/Yolawa). Coran et fiqh avec son père; puis études avec Malam Salihu du classique tijani Jawahir al‑Ma'ani.`,
        arabicText: 'وُلد في 9 ذي الحجة 1336هـ (1919) في حوساوا بكانو؛ فلاني (سُلّباوة/يولاوة). بدأ بالقرآن والفقه عند والده؛ ثم درس مع م. صالِحُو «جواهر المعاني».',
        hausaText: `An haife shi 9 Zul‑Hijja 1336H (1919) a Hausawa, Kano; Fulani (Sullubawa/Yolawa). Ya fara da Alƙur'ani da fiqhu wurin mahaifi; daga baya tare da Malam Salihu ya karanta Jawahir al‑Ma'ani.`
      },
      {
        heading: 'Teachers & Studies',
        text: 'Studied Maliki fiqh, usul, tafsir, Arabic and Sufism with Shaykh Usman Mai Hula; continued under close friend Shaykh Isa Mandawari and others (Malam Ado, Malam Inuwa).',
        frenchText: `Étudia fiqh malikite, usul, tafsir, arabe et soufisme avec Cheikh Usman Mai Hula; continua avec son ami intime Cheikh Isa Mandawari et d'autres (Malam Ado, Malam Inuwa).`,
        arabicText: 'درس الفقه المالكي والأصول والتفسير والعربية والتصوف مع الشيخ عثمان ماي هولا؛ وواصل مع صديقه الشيخ عيسى منداواري وغيرهما (م. آدو، م. إينوا).',
        hausaText: 'Ya yi karatun fiqhun Maliki, usul, tafsiri, Larabci da Sufanci tare da Shaykh Usman Mai Hula; ya ci gaba da Shaykh Isa Mandawari da wasu (Malam Ado, Malam Inuwa).'
      },
      {
        heading: 'Tijaniyya & Fayda Network',
        text: `After Shaykh Ibrahim Niasse's 1945 Kano visit, he aligned with the Fayda network; underwent tarbiya in 1946 with Shaykh Abubakar Atiku and advanced training under Shaykh Muhammad Gibrima.`,
        frenchText: `Après la visite de Cheikh Ibrahim Niasse à Kano en 1945, il s'aligna au réseau de la Fayda; accomplit la tarbiya en 1946 avec Cheikh Abubakar Atiku et une formation avancée auprès de Cheikh Muhammad Gibrima.`,
        arabicText: 'بعد زيارة الشيخ إبراهيم نياس لكانو سنة 1945، انتظم في شبكة الفيضة؛ وأخذ التربية سنة 1946 مع الشيخ أبوبكر عتيق وتدرّب عند الشيخ محمد جِبْرِمَا.',
        hausaText: 'Bayan ziyarar Shaykh Ibrahim Niasse a Kano (1945), ya shiga hanyar Fayda; ya yi tarbiya a 1946 tare da Shaykh Abubakar Atiku, ya ci gaba da horo wurin Shaykh Muhammad Gibrima.'
      },
      {
        heading: 'Retreats & Spiritual Stations',
        text: 'Entered khalwa over thirty times; under Shaykh Gibrima attained al‑Fath al‑Akbar and advanced stations (Sirr al‑Sirr), focusing on pure remembrance beyond worldly allure.',
        frenchText: `Entré en khalwa plus de trente fois; sous Cheikh Gibrima atteignit al‑Fath al‑Akbar et des stations avancées (Sirr al‑Sirr), concentrant son cœur sur le dhikr pur.`,
        arabicText: 'دخل الخلوة أكثر من ثلاثين مرة؛ وتحت الشيخ جِبْرِمَا نال الفتح الأكبر ومقامات متقدمة (سر السر) مع ترك زخارف الدنيا.',
        hausaText: 'Ya shiga khalwa fiye da sau talatin; a ƙarƙashin Shaykh Gibrima ya samu al‑Fath al‑Akbar da manyan maqamai (Sirr al‑Sirr), ya mai da hankali kan dhikr tsantsa.'
      },
      {
        heading: 'Dhikr Style & Zawiya',
        text: `His Hausawa zawiya popularized the pulsating dhikr refrain "La ilaha illa'Llah – Muhammadun Rasulullah," spreading to other zawiyas across Kano and beyond.`,
        frenchText: `Sa zawiya de Hausawa a popularisé le refrain de dhikr "La ilaha illa'Llah – Muhammadun Rasulullah", diffusé dans d'autres zawiyas de Kano et au‑delà.`,
        arabicText: 'زاويته في حوساوا أشاعت لحن الذكر النابض «لا إله إلا الله محمد رسول الله»، وانتشر في الزوايا داخل كانو وخارجها.',
        hausaText: `Zawiyarsa ta Hausawa ta yada waƙar dhikr mai kaɗuwa "La ilaha illa'Llah – Muhammadun Rasulullah," ta bazu zuwa sauran zawiyoyi.`
      },
      {
        heading: 'Writings',
        text: `Authored works in spiritual psychology and salawat, e.g., Kasr al‑Nufus, Juhud al‑'Ajiz, Sullam al‑Muhibbin, Sirr al‑Asrar.`,
        frenchText: `Auteurs d'ouvrages en psychologie spirituelle et salawat, p.ex., Kasr al‑Nufus, Juhud al‑'Ajiz, Sullam al‑Muhibbin, Sirr al‑Asrar.`,
        arabicText: 'ألّف كتبًا في علم النفس الروحي والصلاة على النبي، مثل: كسر النفوس، جهود العاجز، سُلَّم المُحبين، سر الأسرار.',
        hausaText: `Ya rubuta ayyuka a ilimin halayen ruhaniya da salawat, misali: Kasr al‑Nufus, Juhud al‑'Ajiz, Sullam al‑Muhibbin, Sirr al‑Asrar.`
      },
      {
        heading: 'Public Episodes & Ethos',
        text: 'Known for refusing gifts from political elites; episodes of admonition and repentance reinforced his ethos of zuhd, sincerity, and fear of Allah.',
        frenchText: `Réputé pour refuser les dons des élites politiques; des épisodes d'admonestation et de repentir ont renforcé son ethos de zuhd, sincérité et crainte d'Allah.`,
        arabicText: 'أشهر بمقاطعة هبات النخبة السياسية؛ مواقف الوعظ والتوبة عزّزت خُلُقه في الزهد والإخلاص وخشية الله.',
        hausaText: `An san shi da ƙin karɓar kyautai daga masu mulki; labaran wa'azi da tuba sun ƙarfafa halayensa na zuhudu, gaskiya da tsoron Allah.`
      },
      {
        heading: 'Passing & Legacy',
        text: 'Passed on 11 December 2013; buried at his Hausawa home. His nightly wazifa gatherings continue to draw crowds, embodying living Sufi devotion in Kano.',
        frenchText: `Décédé le 11 décembre 2013; inhumé à sa maison de Hausawa. Les wazifa nocturnes attirent encore des foules, illustrant la piété soufie vivante à Kano.`,
        arabicText: 'توفي في 11 ديسمبر 2013؛ ودُفن في منزله بحوساوا. لا تزال وظائفه الليلية تجمع الجموع، شاهدة على حيوية التدين الصوفي في كانو.',
        hausaText: `Ya rasu 11 Disamba 2013; an binne shi a gidansa na Hausawa. Wazifa na kowacce dare na ci gaba da jawo jama'a, tamkar shaida ga rayayyen Sufanci a Kano.`
      }
    ]
  },
  // 3. Sheikh Ahmad Abulfathi
  {
    id: 'sheikh_ahmad_abulfathi',
    name: 'Sheikh Ahmad Abulfathi (RTA)',
    title: 'Maulana Ahmad bin Ali Al‑Yarwawi – Murshid of Tijaniyya',
    bio: 'Known as Maulana Sheikh Ahmad bin Ali Al‑Yarwawi (RTA), nicknamed Abul‑Abbas and widely known as Abulfathi for opening hearts to knowledge. A renowned Tijani guide who spread Islamic knowledge and virtues across Borno and beyond.',
    frenchBio: `Connu comme Maulana Cheikh Ahmad bin Ali Al‑Yarwawi (RTA), surnommé Abul‑Abbas et largement connu sous le nom Abulfathi pour l'ouverture des cœurs à la science. Un guide tijani renommé qui a propagé le savoir islamique et les vertus au Borno et au‑delà.`,
    arabicBio: 'المعروف بمولانا الشيخ أحمد بن علي اليَرْواوي (رضي الله عنه)، لُقِّب بأبي العباس، والمشهور بـ «أبي الفتح» لفتحه القلوب على العلم. من كبار مُرشدي التجانية؛ نشر العلم والفضائل في برنو وخارجها.',
    hausaBio: `Ana san shi da Maulana Sheikh Ahmad bin Ali Al‑Yarwawi (RTA), ana kiransa Abul‑Abbas, kuma shahararren lakabinsa Abulfathi – mai buda zukata ga ilimi. Jagora ne a Tijaniyya da ya yada ilimi da kyawawan dabi'u a Borno da wajensa.`,
    specialties: ['Tariqa Tijaniyya', 'Quran & Tafsir', 'Hadith', 'Fiqh', 'Education Reform'],
    image: require('../../assets/sheikhabulfathi.jpeg'),
    details: [
      {
        heading: 'Birth, Hometown & Upbringing',
        text: 'Born 1919 in Sandiya (Shanduwa), Konduga LGA, near Maiduguri, Borno. Raised with horsemanship, herding and rural skills.',
        frenchText: `Né en 1919 à Sandiya (Shanduwa), Konduga, près de Maiduguri (Borno). Élevé avec l'art équestre, l'élevage et les aptitudes rurales.`,
        arabicText: 'وُلد سنة 1919 في قرية سنديا (شندوا) بكوندوغا قرب ميدغري بولاية برنو. نشأ على الفروسية ورعي المواشي ومهارات الريف.',
        hausaText: 'An haife shi 1919 a Sandiya (Shanduwa), Konduga, kusa da Maiduguri a Borno. Ya tashi da dokanci, kiwon dabbobi da ƙwarewar karkara.'
      },
      {
        heading: 'Lineage',
        text: 'His paternal line reaches Al‑Hasan b. Ali (RTA) through notable ancestors; maternal side descends from Prince Zubair of Adamawa Emirate.',
        frenchText: `Sa lignée paternelle remonte à Al‑Hassan b. Ali (RTA) par des ancêtres éminents; du côté maternel, il descend du Prince Zubair de l'émirat d'Adamawa.`,
        arabicText: 'نَسَبه من جهة الأب يصل إلى الحسن بن علي (رض) عبر أسلافٍ مشاهير؛ ومن جهة الأم إلى الأمير زبير من إمارة أداماوا.',
        hausaText: 'Asalin uban nasa ya kai ga Al‑Hasan ɗan Ali (RTA) ta manyan kakanni; na uwa kuma zuriyar Yarima Zubair na Daular Adamawa.'
      },
      {
        heading: 'Education & Teachers',
        text: `Early Qur'an with his father, then memorization at Gonori Garuwa. Studied Tafsir at Bunkure under Malam Abubakar Dawaki; fiqh and tasawwuf with scholars in Zaria, Katsina, Kano. Lived and studied long with Sheikh Abubakar Atiku Sanka (RTA).`,
        frenchText: `Débuts en Coran chez son père puis hifz à Gonori Garuwa. Tafsir à Bunkure avec Malam Abubakar Dawaki; fiqh et tasawwuf avec des savants à Zaria, Katsina, Kano. Long séjour d'étude auprès du Cheikh Abubakar Atiku Sanka (RTA).`,
        arabicText: 'بدأ بالقرآن عند والده ثم أتم الحفظ في غونوري غاروا. درس التفسير في بنكوري على يد م. أبوبكر دواكي؛ والفقه والتصوف مع علماء في زاريا وكاتسينا وكانو. لازم الشيخ أبوبكر عتيقو سنكا (رض) زمناً.',
        hausaText: `Farkon Alƙur'ani wurin mahaifi, ya kammala hifzi a Gonori Garuwa. Ya yi Tafsiri a Bunkure tare da Malam Abubakar Dawaki; fiqhu da tasawwuf a Zaria, Katsina da Kano. Ya daɗe yana koyo wurin Sheikh Abubakar Atiku Sanka (RTA).`
      },
      {
        heading: 'Ijazah & Tijaniyya',
        text: `Initiated into Tariqa by Sheikh Malam Aala (1357 AH). Elevated by Sheikh Atiku Sanka to Muqaddam. Held numerous ijazāt: Qur'an (Sheikh Adam Arze), Hadith (Sheikh Muhammad b. Alawi al‑Maliki), and Silsalah Zahabiyya from Sheikh Ibrahim Niasse (RTA).`,
        frenchText: `Initiation à la Tariqa par Cheikh Malam Aala (1357 H). Élevé au rang de Muqaddam par Cheikh Atiku Sanka. Nombreuses ijazāt: Coran (Cheikh Adam Arze), Hadith (Cheikh Muhammad b. Alawi al‑Maliki) et Silsalah Zahabiyya de Cheikh Ibrahim Niasse (RTA).`,
        arabicText: 'أُدخل الطريقة على يد الشيخ ملام آلا (1357هـ)، ورفعه الشيخ عتيقو سنكا إلى مُقدَّم. له إجازات كثيرة: القرآن (الشيخ آدم أرزي)، الحديث (الشيخ محمد بن علوي المالكي)، والسلسلة الذهبية من الشيخ إبراهيم نياس (رض).',
        hausaText: `Ya shiga Tariqa ta hannun Sheikh Malam Aala (1357H). Sheikh Atiku Sanka ya ɗaga shi zuwa Muqaddam. Ya samu ijazohi da dama: Alƙur'ani (Sheikh Adam Arze), Hadisi (Sheikh Muhammad b. Alawi al‑Maliki), Silsalah Zahabiyya daga Sheikh Ibrahim Niasse (RTA).`
      },
      {
        heading: 'Khalifatu Tijaniyya Designation',
        text: 'Sheikh Niasse (RTA) appointed him Khalifa for Borno in 1965 and formally "crowned" him in 1974 with an izār, stating: "We are pleased with him…his seniority…his truthful attachment." His seat remains in Dikwa, Borno.',
        frenchText: `Cheikh Niasse (RTA) le nomma Khalife pour le Borno en 1965 et le « couronna » officiellement en 1974 avec un izār, disant: « Nous sommes satisfaits de lui…son ancienneté…son attachement sincère. » Son siège est à Dikwa, Borno.`,
        arabicText: 'عيّنه الشيخ نياس (رض) خليفةً لبرنو سنة 1965 و«توّجه» رسمياً سنة 1974 بإزارٍ قائلاً: «رضينا به…أقدميّته…صدق انتسابه». مقره في دِكْوا ببرنو.',
        hausaText: 'Sheikh Niasse (RTA) ya naɗa shi Khalifa a Borno a 1965, a 1974 ya naɗa shi da izār yana cewa: "Mun yarda da shi…tsohonsa…gaskiyar alaƙarsa." Zama sa a Dikwa, Borno.'
      },
      {
        heading: 'Major Works & Publications',
        text: `Authored over 100 books/treatises: Qur'anic tafsir (Bayanul Qur'an), hadith commentary, fiqh, Sufi ethics, devotional poetry—in Arabic, Hausa, and Kanuri.`,
        frenchText: `Plus de 100 ouvrages: tafsir coranique (Bayanul Qur'an), commentaire du hadith, fiqh, éthique soufie, poésie dévotionnelle—en arabe, haoussa et kanouri.`,
        arabicText: 'ألّف أكثر من 100 كتاب/رسالة: تفسير قرآني (بيان القرآن)، شروح حديثية، فقه، أخلاق صوفية، وشعر تعبّدي—بالعربية والهوسا والكانورية.',
        hausaText: `Ya rubuta fiye da littattafai/risaloli 100: tafsiri na Alƙur'ani (Bayanul Qur'an), sharhin hadisi, fiqhu, ɗabi'un Sufanci, waƙoƙin ibada—cikin Larabci, Hausa da Kanuri.`
      },
      {
        heading: 'Passing & Burial',
        text: 'Passed on 13 November 2014 (20 Muharram 1436). Buried at his Dikwa home beside his mother.',
        frenchText: `Décédé le 13 novembre 2014 (20 Muharram 1436). Inhumé à son domicile de Dikwa, près de sa mère.`,
        arabicText: 'توفي في 13 نوفمبر 2014 (20 محرّم 1436هـ). دُفن في منزله بدِكْوا إلى جانب والدته.',
        hausaText: 'Ya rasu 13 Nuwamba 2014 (20 Muharram 1436). An binne shi a gidansa na Dikwa kusa da mahaifiyarsa.'
      },
      {
        heading: 'Legacy',
        text: 'His students number in the thousands; his books circulate widely; his charitable foundations—orphanages, schools, mosques—persist; and his family continues his mission.',
        frenchText: `Des milliers d'élèves; ses livres circulent largement; ses fondations caritatives—orphelinats, écoles, mosquées—perdurent; sa famille poursuit sa mission.`,
        arabicText: 'تلامذته بالآلاف؛ وتنتشر كتبه بكثرة؛ وتستمر مؤسساته الخيرية—مأوى أيتام ومدارس ومساجد؛ وأسرته تواصل رسالته.',
        hausaText: 'Almajiransa su duk dubunnai; littattafansa sun bazu ƙwarai; gidajen agaji—maraye, makarantu, masallatai—sun ci gaba; danginsa suna ci gaba da aikinsa.'
      }
    ]
  },
  // 4. Sheikh Ibrahim Niasse
  {
    id: 'sheikh_ibrahim_niasse',
    name: 'Shaykh Ibrahim Niasse (1900–1975)',
    title: 'Baye – The Great Reviver of Tijaniyya',
    bio: 'Shaykh Ibrahim Niasse (1900–1975), known as Baye Niasse, was the most influential Tijani Sufi leader of the 20th century. Born in Kaolack, Senegal, he led the Fayda ("Flood") spiritual renewal, bringing millions into the Tijaniyya. His teachings emphasized divine love, direct spiritual experience, and service to humanity.',
    frenchBio: `Cheikh Ibrahim Niasse (1900–1975), dit Baye Niasse, fut le plus influent dirigeant soufi tijani du XXe siècle. Né à Kaolack (Sénégal), il a conduit le renouveau spirituel de la Fayda (« Le Flot »), amenant des millions à la Tijaniyya. Ses enseignements mettent l'accent sur l'amour divin, l'expérience spirituelle directe et le service à l'humanité.`,
    arabicBio: 'كان الشيخ إبراهيم نياس (1900–1975)، المعروف بـ «باي نياس»، أبرز قائد صوفي تجاني في القرن العشرين. وُلِد في كاولاك بالسنغال، وقاد التجديد الروحي للفيضة، مما أدخل الملايين في الطريقة التجانية. ركّزت تعاليمه على الحب الإلهي والتجربة الروحية المباشرة وخدمة الإنسانية.',
    hausaBio: 'Shaykh Ibrahim Niasse (1900–1975), wanda aka fi sani da Baye Niasse, shi ne shugaban Sufi na Tijaniyya mafi tasiri a ƙarni na 20. An haife shi a Kaolack, Senegal, ya jagoranci sabuntar ruhaniya na Fayda ("Ambaliya"), wanda ya kawo miliyoyin mutane cikin Tijaniyya. Koyarwarsa ta jaddada soyayyar Allah, ƙwarewar ruhaniya kai tsaye, da hidima ga ɗan adam.',
    specialties: ['Tariqa Tijaniyya', 'Fayda', 'Islamic Scholarship', 'Spiritual Training', 'Global Leadership'],
    image: require('../../assets/Shaykh Ibrahim.jpg'),
    details: [
      {
        heading: 'Birth & Early Life',
        text: 'Born on 15th Rajab 1318 AH (1900 CE) in Taiba Niassene, Senegal. His father, Hajj Abdullahi Niasse, was a renowned scholar and Tijani muqaddam.',
        frenchText: 'Né le 15 Rajab 1318 H (1900) à Taiba Niassène (Sénégal). Son père, Hajj Abdullahi Niasse, était un savant renommé et muqaddam tijani.',
        arabicText: 'وُلد في 15 رجب 1318هـ (1900م) في طيبة نياسين بالسنغال. كان والده الحاج عبد الله نياس عالماً مشهوراً ومقدَّماً تجانياً.',
        hausaText: 'An haife shi 15 Rajab 1318H (1900 Miladiyya) a Taiba Niassene, Senegal. Mahaifinsa, Hajj Abdullahi Niasse, fitaccen malami ne kuma muqaddam na Tijaniyya.'
      },
      {
        heading: 'Education & Spiritual Formation',
        text: `Memorized the Qur'an by age 7. Studied under his father and numerous scholars across West Africa. Received the Tijaniyya wird from his father at a young age.`,
        frenchText: `Mémorisa le Coran à 7 ans. Étudia auprès de son père et de nombreux savants d'Afrique de l'Ouest. Reçut le wird tijani de son père dès son jeune âge.`,
        arabicText: 'حفظ القرآن في السابعة من عمره. درس على يد والده وعدد من العلماء في غرب أفريقيا. تلقى الورد التجاني من والده منذ صغره.',
        hausaText: `Ya haddace Alƙur'ani yana ɗan shekara 7. Ya karanta a ƙarƙashin mahaifinsa da malaman Afirka ta Yamma da yawa. Ya karɓi wirdin Tijaniyya daga mahaifinsa tun ƙuruciya.`
      },
      {
        heading: 'The Fayda (Divine Flood)',
        text: 'In 1929, he announced that Allah had granted him the "Fayda" (فيضة) – a spiritual opening that would bring masses to divine knowledge. This was prophesied by Sheikh Ahmad Tijani himself.',
        frenchText: `En 1929, il annonça qu'Allah lui avait accordé la « Fayda » (فيضة) – ouverture spirituelle qui amènerait les masses à la connaissance divine. Cela avait été prophétisé par Cheikh Ahmad Tijani.`,
        arabicText: 'في عام 1929 أعلن أن الله منحه «الفيضة» – فتحاً روحياً سيهدي الجماهير إلى المعرفة الربانية. وكانت هذه بشارة من الشيخ أحمد التجاني نفسه.',
        hausaText: `A shekara 1929, ya sanar cewa Allah ya ba shi "Fayda" (فيضة) – buɗewar ruhaniya da za ta kawo jama'a zuwa sanin Allah. Wannan an yi annabcinsa ta Shehu Ahmad Tijani da kansa.`
      },
      {
        heading: 'Global Influence',
        text: 'His followers number in the tens of millions across Africa, Europe, Asia, and the Americas. He traveled extensively to spread the Tijani message and was received by kings and presidents.',
        frenchText: 'Ses disciples se comptent par dizaines de millions en Afrique, Europe, Asie et Amériques. Il voyagea intensément pour diffuser le message tijani et fut reçu par rois et présidents.',
        arabicText: 'أتباعه بعشرات الملايين في أفريقيا وأوروبا وآسيا والأمريكتين. سافر كثيراً لنشر رسالة التجانية واستقبله ملوك ورؤساء.',
        hausaText: `Mabiyansa dubun-dubatar miliyoyin ne a ko'ina cikin Afirka, Turai, Asiya, da Amurka. Ya yi tafiye-tafiye da yawa don yada saƙon Tijaniyya kuma sarakuna da shugabannin ƙasashe sun karɓe shi.`
      },
      {
        heading: 'Passing & Legacy',
        text: 'Passed away on 26 July 1975 in London during a medical trip. Buried in Medina Baye, Kaolack. His annual Mawlid celebration draws millions of pilgrims.',
        frenchText: `Décédé le 26 juillet 1975 à Londres lors d'un voyage médical. Enterré à Medina Baye, Kaolack. Son Mawlid annuel attire des millions de pèlerins.`,
        arabicText: 'توفي في 26 يوليو 1975 بلندن أثناء رحلة علاجية. دُفن في المدينة باي بكاولاك. يستقطب مولده السنوي ملايين الزوار.',
        hausaText: 'Ya rasu 26 Yuli 1975 a London yayin tafiya don lafiya. An binne shi a Medina Baye, Kaolack. Bukukuwan Maulid na shekara-shekara suna jawo miliyoyin mahajjata.'
      }
    ]
  },
  // 5. Sheikh Ahmad Tijani
  {
    id: 'sheikh_ahmad_tijani',
    name: 'Sidi Ahmad al-Tijani (1737–1815)',
    title: 'Founder of the Tijaniyya Order',
    bio: 'Sidi Ahmad al-Tijani (1737–1815) was the founder of the Tijaniyya Sufi order. Born in Ain Madhi, Algeria, he spent his life seeking spiritual perfection. After studying with many masters across North Africa, he received a direct spiritual opening from the Prophet Muhammad ﷺ in 1782, establishing the Tariqa Tijaniyya.',
    frenchBio: `Sidi Ahmad al-Tijani (1737–1815) fut le fondateur de l'ordre soufi Tijaniyya. Né à Aïn Madhi, en Algérie, il consacra sa vie à la quête de la perfection spirituelle. Après avoir étudié auprès de nombreux maîtres en Afrique du Nord, il reçut une ouverture spirituelle directe du Prophète Muhammad ﷺ en 1782, établissant la Tariqa Tijaniyya.`,
    arabicBio: 'كان سيدي أحمد التجاني (1737–1815) مؤسس الطريقة التجانية الصوفية. وُلد في عين ماضي بالجزائر، وقضى حياته ساعياً إلى الكمال الروحي. بعد التتلمذ على كثير من المشايخ في شمال أفريقيا، تلقى فتحاً روحياً مباشراً من النبي محمد ﷺ عام 1782، مؤسساً الطريقة التجانية.',
    hausaBio: 'Sidi Ahmad al-Tijani (1737–1815) shi ne wanda ya kafa hanyar Sufi ta Tijaniyya. An haife shi a Ain Madhi, Algeria, ya yi rayuwarsa yana neman kamalar ruhaniya. Bayan ya karanta a wurin mashahuran malaman Arewacin Afirka da yawa, ya sami buɗewar ruhaniya kai tsaye daga Annabi Muhammad ﷺ a 1782, inda ya kafa Tariqa Tijaniyya.',
    specialties: ['Tariqa Tijaniyya', 'Sufism', 'Islamic Sciences', 'Spiritual Training', 'North African Islam'],
    image: require('../../assets/Shaykh Ahmad.jpg'),
    details: [
      {
        heading: 'Birth & Early Life',
        text: 'Born 1737 in Ain Madhi, Algeria, into a family of scholars tracing lineage to Prophet Muhammad ﷺ. Showed exceptional spiritual aptitude from childhood.',
        frenchText: 'Né en 1737 à Aïn Madhi, Algérie, dans une famille de savants descendants du Prophète Muhammad ﷺ. Il montra très tôt des aptitudes spirituelles exceptionnelles.',
        arabicText: 'وُلد عام 1737 في عين ماضي بالجزائر في أسرة علماء تنتسب إلى النبي محمد ﷺ. أبدى نبوغاً روحياً منذ طفولته.',
        hausaText: 'An haife shi 1737 a Ain Madhi, Algeria, cikin dangin malaman da ke da zuriyar Annabi Muhammad ﷺ. Ya nuna bajintar ruhaniya tun ƙuruciya.'
      },
      {
        heading: 'Spiritual Journey',
        text: 'Traveled extensively seeking knowledge and spiritual masters across Morocco, Tunisia, Egypt, and the Hijaz. Studied with over 50 teachers of various Sufi orders.',
        frenchText: 'Voyagea beaucoup à la recherche du savoir et de maîtres spirituels au Maroc, en Tunisie, en Égypte et au Hijaz. Étudia auprès de plus de 50 maîtres de différents ordres soufis.',
        arabicText: 'سافر كثيراً طلباً للعلم والمشايخ في المغرب وتونس ومصر والحجاز. درس على يد أكثر من 50 شيخاً في طرق صوفية متعددة.',
        hausaText: 'Ya yi tafiye-tafiye da yawa yana neman ilimi da malaman ruhaniya a Morocco, Tunisia, Masar, da Hijaz. Ya karanta a wurin malamai fiye da 50 na hanyoyin Sufi daban-daban.'
      },
      {
        heading: 'The Divine Opening',
        text: 'In 1782, in Fez, Morocco, he received the Tariqa directly from Prophet Muhammad ﷺ in a waking vision. This established the Tijaniyya as an independent spiritual path.',
        frenchText: 'En 1782, à Fès, au Maroc, il reçut la Tariqa directement du Prophète Muhammad ﷺ dans une vision éveillée, établissant la Tijaniyya comme voie spirituelle indépendante.',
        arabicText: 'في عام 1782 بفاس، تلقى الطريقة مباشرةً من النبي محمد ﷺ يقظة لا مناماً، فأسّس التجانية طريقةً روحيةً مستقلة.',
        hausaText: 'A shekara 1782, a Fez na Morocco, ya karɓi Tariqa kai tsaye daga Annabi Muhammad ﷺ a wahayin farkawa. Wannan ya kafa Tijaniyya a matsayin hanyar ruhaniya mai zaman kanta.'
      },
      {
        heading: 'Settlement in Fez',
        text: 'Settled permanently in Fez in 1798, where he spent his final years teaching and guiding seekers. His zawiya became a center of learning.',
        frenchText: `S'installa définitivement à Fès en 1798, y passant ses dernières années à enseigner et à guider les aspirants. Sa zawiya devint un centre de savoir.`,
        arabicText: 'استقر نهائياً في فاس عام 1798، وأمضى سنواته الأخيرة في التعليم وإرشاد السالكين. أصبحت زاويته مركزاً للعلم.',
        hausaText: 'Ya zauna a Fez na dindindin a shekara 1798, inda ya yi shekarunsa na ƙarshe yana koyarwa da shiryar da masu nema. Zawiyarsa ta zama cibiyar ilimi.'
      },
      {
        heading: 'Passing & Legacy',
        text: 'Passed away in 1815 in Fez and is buried there. His order spread across Africa, the Middle East, and beyond, with millions of followers today.',
        frenchText: `Décédé en 1815 à Fès où il est enterré. Son ordre s'est répandu en Afrique, au Moyen-Orient et au-delà, comptant aujourd'hui des millions de fidèles.`,
        arabicText: 'توفي عام 1815 في فاس ودُفن فيها. انتشرت طريقته في أفريقيا والشرق الأوسط وما وراءها، وله الملايين من الأتباع اليوم.',
        hausaText: `Ya rasu a 1815 a Fez kuma an binne shi a can. Hanyarsa ta bazu ko'ina cikin Afirka, Gabas ta Tsakiya, da wajenta, tare da miliyoyin mabiya a yau.`
      }
    ]
  },
  // 6. Shaykh Al-Hajj Umar Al-Futi Tal
  {
    id: 'sheikh_umar_tall',
    name: 'Shaykh Al-Hajj Umar Al-Futi Tal (1797–1864)',
    title: 'Warrior Scholar & Khalifa of Tijaniyya in West Africa',
    bio: 'Shaykh Al-Hajj Umar Al-Futi Tal (1797–1864) was a Fulani scholar, Islamic reformer, and Tijani leader who established the Toucouleur Empire. He was initiated into the Tijaniyya by Muhammad al-Ghali and became the Khalifa for the Tijaniyya in West Africa. His jihad efforts expanded Islamic influence across Senegambia and Mali.',
    frenchBio: `Cheikh El Hadj Omar Al-Futi Tal (1797–1864) était un érudit peul, réformateur islamique et chef tijani qui fonda l'Empire toucouleur. Initié à la Tijaniyya par Muhammad al-Ghali, il devint Khalife de la Tijaniyya en Afrique de l'Ouest. Son jihad étendit l'influence islamique à travers la Sénégambie et le Mali.`,
    arabicBio: 'كان الشيخ الحاج عمر الفوتي تال (1797–1864) عالماً فُلانياً ومُصلحاً إسلامياً وقائداً تجانياً أسّس إمبراطورية التوكولور. تلقى التجانية من محمد الغالي وأصبح خليفة التجانية في غرب أفريقيا. وسّع جهادُه النفوذَ الإسلامي في السنغامبيا ومالي.',
    hausaBio: 'Shaykh Al-Hajj Umar Al-Futi Tal (1797–1864) malamin Fulani ne, mai gyaran addinin Musulunci, kuma shugaban Tijaniyya wanda ya kafa Daular Toucouleur. An shigar da shi cikin Tijaniyya ta Muhammad al-Ghali kuma ya zama Khalifa na Tijaniyya a Yammacin Afirka. Jihadin sa ya fadada tasirin Musulunci a cikin Senegambia da Mali.',
    specialties: ['Tariqa Tijaniyya', 'Jihad', 'Islamic Reform', 'Leadership', 'West African History'],
    image: require('../../assets/Umar.jpg'),
    details: [
      {
        heading: 'Birth & Origin',
        text: 'Born 1797 in Halwar, Futa Toro (present-day Senegal) into a scholarly Fulani family. Received early Islamic education in his homeland.',
        frenchText: 'Né en 1797 à Halwar, Fouta Toro (actuel Sénégal) dans une famille peule de savants. Il reçut sa première éducation islamique dans son pays.',
        arabicText: 'وُلد عام 1797 في هلوار، فوتا تورو (السنغال حالياً) في أسرة فُلانية علمية. تلقى تعليمه الإسلامي الأول في وطنه.',
        hausaText: 'An haife shi a 1797 a Halwar, Futa Toro (yanzu Senegal) cikin dangin Fulani malaman addini. Ya sami ilimin Musulunci na farko a ƙasarsa.'
      },
      {
        heading: 'Pilgrimage & Initiation',
        text: 'During his hajj (1827–1830), he met Muhammad al-Ghali in Medina, who initiated him into the Tijaniyya and appointed him Khalifa for West Africa.',
        frenchText: `Au cours de son hajj (1827–1830), il rencontra Muhammad al-Ghali à Médine, qui l'initia à la Tijaniyya et le nomma Khalife pour l'Afrique de l'Ouest.`,
        arabicText: 'في حجه (1827–1830) التقى بمحمد الغالي في المدينة، فأدخله في التجانية وولّاه خليفة غرب أفريقيا.',
        hausaText: 'A lokacin hajjinsa (1827–1830), ya haɗu da Muhammad al-Ghali a Madina, wanda ya shigar da shi cikin Tijaniyya kuma ya naɗa shi Khalifa na Yammacin Afirka.'
      },
      {
        heading: 'The Jihad',
        text: 'Launched a jihad in 1852 that created the Toucouleur Empire, conquering much of present-day Mali and Senegal and establishing Islamic governance.',
        frenchText: `Lança un jihad en 1852, fondant l'Empire toucouleur, conquérant une grande partie des actuels Mali et Sénégal et établissant une gouvernance islamique.`,
        arabicText: 'أطلق جهاداً عام 1852 أسّس به إمبراطورية التوكولور، وفتح مناطق واسعة من مالي والسنغال الحاليين وأقام حكماً إسلامياً.',
        hausaText: 'Ya fara jihadi a 1852 wanda ya haifar da Daular Toucouleur, inda ya ci yawancin yankunan Mali da Senegal na yanzu kuma ya kafa mulkin Musulunci.'
      },
      {
        heading: 'Passing & Legacy',
        text: 'Died in 1864 near Bandiagara, Mali. His legacy includes spreading the Tijaniyya across West Africa and his influential work "Kitab Rimah."',
        frenchText: `Décédé en 1864 près de Bandiagara, Mali. Son héritage inclut la diffusion de la Tijaniyya en Afrique de l'Ouest et son œuvre influente « Kitab Rimah ».`,
        arabicText: 'توفي عام 1864 قرب بانديغارا في مالي. يشمل إرثه نشر التجانية في غرب أفريقيا ومؤلَّفه المؤثر «كتاب الرماح».',
        hausaText: 'Ya rasu a 1864 kusa da Bandiagara, Mali. Gadonsa ya haɗa da yada Tijaniyya a Yammacin Afirka da littafinsa mai tasiri "Kitab Rimah."'
      }
    ]
  }
];

// Category filters
const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps-outline' },
  { id: 'tijaniyya', label: 'Tijaniyya', icon: 'star-outline' },
  { id: 'sufism', label: 'Sufism', icon: 'heart-outline' },
  { id: 'scholarship', label: 'Scholarship', icon: 'book-outline' },
  { id: 'history', label: 'History', icon: 'time-outline' },
];

// Specialty icons mapping
const specialtyIcons: { [key: string]: string } = {
  'Tariqa Tijaniyya': 'star',
  'Sufism': 'heart',
  'Islamic Scholarship': 'book',
  'Authorship': 'create',
  'West African Islam': 'globe',
  'Dhikr & Salawat': 'musical-notes',
  'Asceticism': 'leaf',
  'Spiritual Training': 'fitness',
  'Kano History': 'time',
  'Quran & Tafsir': 'book',
  'Hadith': 'document-text',
  'Fiqh': 'library',
  'Education Reform': 'school',
  'Fayda': 'water',
  'Global Leadership': 'earth',
  'Islamic Sciences': 'flask',
  'North African Islam': 'compass',
  'Jihad': 'shield',
  'Islamic Reform': 'trending-up',
  'Leadership': 'people',
  'West African History': 'hourglass',
};

export default function ScholarsScreen({ navigation }: { navigation: any }) {
  const { t } = useLanguage();
  
  const specialtyKeyByLabel: { [key: string]: string } = {
    'Tariqa Tijaniyya': 'specialty.tariqa_tijaniyya',
    'Sufism': 'specialty.sufism',
    'Islamic Scholarship': 'specialty.islamic_scholarship',
    'Authorship': 'specialty.authorship',
    'West African Islam': 'specialty.west_african_islam',
    'Dhikr & Salawat': 'specialty.dhikr_salawat',
    'Asceticism': 'specialty.asceticism',
    'Spiritual Training': 'specialty.spiritual_training',
    'Kano History': 'specialty.kano_history',
    'Quran & Tafsir': 'specialty.quran_tafsir',
    'Hadith': 'specialty.hadith',
    'Fiqh': 'specialty.fiqh',
    'Education Reform': 'specialty.education_reform',
    'Fayda': 'specialty.fayda',
    'Global Leadership': 'specialty.global_leadership',
    'Islamic Sciences': 'specialty.islamic_sciences',
    'North African Islam': 'specialty.north_african_islam',
    'Jihad': 'specialty.jihad',
    'Islamic Reform': 'specialty.islamic_reform',
    'Leadership': 'specialty.leadership',
    'West African History': 'specialty.west_african_history',
  };

  const getSpecialtyLabel = (label: string) => {
    const key = specialtyKeyByLabel[label] || '';
    if (!key) return label;
    const translated = t(key);
    return translated && translated !== key ? translated : label;
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchFocus = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    loadScholars();
  }, []);

  const loadScholars = async () => {
    try {
      setIsLoading(true);
      const response = await api.getScholars();
      const scholarsData = Array.isArray(response) ? response : (response.data || []);
      
      // Map API data to the Scholar interface format
      const mappedScholars: Scholar[] = scholarsData.map((s: any) => ({
        id: s.id,
        name: s.name,
        title: s.title || '',
        bio: s.biography || '',
        frenchBio: '',
        arabicBio: s.nameArabic || '',
        hausaBio: '',
        specialties: s.specialty ? [s.specialty] : [],
        image: s.imageUrl ? { uri: s.imageUrl } : undefined,
        imageUrl: s.imageUrl,
        details: s.biography ? [
          {
            heading: 'Biography',
            text: s.biography,
            frenchText: '',
            arabicText: '',
            hausaText: ''
          }
        ] : []
      }));
      
      // Combine API scholars with hardcoded ones (for backward compatibility)
      // You can remove SCHOLARS array later if you want only API data
      setScholars([...mappedScholars, ...SCHOLARS]);
    } catch (error: any) {
      console.error('Error loading scholars:', error);
      // Fallback to hardcoded data if API fails
      setScholars(SCHOLARS);
      Alert.alert(
        'Error',
        'Failed to load scholars from server. Showing offline data.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onOpen = (item: Scholar) => {
    navigation.navigate('ScholarDetail', { scholar: item });
  };

  const onImagePress = (image: any) => {
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  const handleSearchFocus = () => {
    Animated.timing(searchFocus, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleSearchBlur = () => {
    Animated.timing(searchFocus, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const filteredScholars = scholars.filter(scholar => {
    const matchesSearch = 
      scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholar.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholar.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    if (selectedCategory === 'all') return matchesSearch;
    
    const categoryMatch = scholar.specialties.some(specialty => {
      const s = specialty.toLowerCase();
      switch (selectedCategory) {
        case 'tijaniyya': return s.includes('tijaniyya') || s.includes('fayda');
        case 'sufism': return s.includes('sufism') || s.includes('spiritual') || s.includes('asceticism') || s.includes('dhikr');
        case 'scholarship': return s.includes('scholarship') || s.includes('authorship') || s.includes('tafsir') || s.includes('hadith') || s.includes('fiqh');
        case 'history': return s.includes('history') || s.includes('jihad') || s.includes('leadership');
        default: return true;
      }
    });
    
    return matchesSearch && categoryMatch;
  });

  const searchBorderColor = searchFocus.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.divider, colors.accentGreen],
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const ScholarCard = ({ item, index }: { item: Scholar; index: number }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => onOpen(item)}
          activeOpacity={0.9}
        >
          {/* Scholar Image with Gradient Overlay */}
          {(!!item.image || !!item.imageUrl) && (
            <TouchableOpacity 
              onPress={() => onImagePress(item.image || { uri: item.imageUrl })}
              activeOpacity={0.95}
            >
              <View style={styles.imageContainer}>
                <Image 
                  source={item.image || (item.imageUrl ? { uri: item.imageUrl } : require('../../assets/SHEIKH FATIHU.jpg'))} 
                  style={styles.scholarImage} 
                  resizeMode="cover" 
                />
                <LinearGradient
                  colors={['transparent', 'rgba(5, 47, 42, 0.9)']}
                  style={styles.imageGradient}
                />
                {/* Floating Badge */}
                <View style={styles.floatingBadge}>
                  <Ionicons name="star" size={12} color={colors.accentYellow} />
                  <Text style={styles.badgeText}>Scholar</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Card Content */}
          <View style={styles.cardContent}>
            {/* Name and Title */}
            <Text style={styles.scholarName} numberOfLines={2}>{item.name}</Text>
            <View style={styles.titleContainer}>
              <Ionicons name="ribbon-outline" size={14} color={colors.accentGreen} />
              <Text style={styles.scholarTitle} numberOfLines={1}>{item.title}</Text>
            </View>

            {/* Bio Preview */}
            <Text style={styles.bioPreview} numberOfLines={2}>{item.bio}</Text>

            {/* Specialties */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.chipsScrollView}
              contentContainerStyle={styles.chipsContainer}
            >
              {item.specialties.slice(0, 4).map((specialty, idx) => (
                <View key={specialty} style={[
                  styles.chip,
                  { backgroundColor: idx % 2 === 0 ? 'rgba(17, 196, 141, 0.15)' : 'rgba(179, 157, 219, 0.15)' }
                ]}>
                  <Ionicons 
                    name={(specialtyIcons[specialty] || 'bookmark') as any} 
                    size={12} 
                    color={idx % 2 === 0 ? colors.accentGreen : colors.accentPurple} 
                  />
                  <Text style={[
                    styles.chipText,
                    { color: idx % 2 === 0 ? colors.accentGreen : colors.accentPurple }
                  ]}>
                    {getSpecialtyLabel(specialty)}
                  </Text>
                </View>
              ))}
              {item.specialties.length > 4 && (
                <View style={[styles.chip, styles.moreChip]}>
                  <Text style={styles.moreChipText}>+{item.specialties.length - 4}</Text>
                </View>
              )}
            </ScrollView>

            {/* View Details Button */}
            <TouchableOpacity 
              style={styles.viewButton}
              onPress={() => onOpen(item)}
            >
              <Text style={styles.viewButtonText}>{t('scholars.view_profile') || 'View Profile'}</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.accentGreen} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={[colors.surface, colors.background]}
          style={styles.headerGradient}
        >
          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          
          {/* Header Content */}
          <View style={styles.headerContent}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIconContainer}>
                <LinearGradient
                  colors={[colors.accentGreen, colors.accentTeal]}
                  style={styles.headerIconGradient}
                >
                  <Ionicons name="people" size={24} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>{t('scholars.title') || 'Tijani Scholars'}</Text>
                <Text style={styles.headerSubtitle}>{t('scholars.subtitle') || 'Learn from the masters of the path'}</Text>
              </View>
            </View>

            {/* Stats Card */}
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{SCHOLARS.length}</Text>
                <Text style={styles.statLabel}>Scholars</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>200+</Text>
                <Text style={styles.statLabel}>Years</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>∞</Text>
                <Text style={styles.statLabel}>Legacy</Text>
              </View>
            </View>

            {/* Search Bar */}
            <Animated.View style={[styles.searchContainer, { borderColor: searchBorderColor }]}>
              <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={t('scholars.search_placeholder') || 'Search scholars...'}
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </Animated.View>

            {/* Category Filters */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScrollView}
              contentContainerStyle={styles.categoriesContainer}
            >
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Ionicons 
                    name={category.icon as any} 
                    size={16} 
                    color={selectedCategory === category.id ? '#FFFFFF' : colors.textSecondary} 
                  />
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id && styles.categoryButtonTextActive
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Scholars List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accentGreen} />
          <Text style={styles.loadingText}>Loading scholars...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredScholars}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <ScholarCard item={item} index={index} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          refreshing={isLoading}
          onRefresh={loadScholars}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
              </View>
              <Text style={styles.emptyTitle}>{t('scholars.no_results') || 'No scholars found'}</Text>
              <Text style={styles.emptySubtitle}>{t('scholars.try_again') || 'Try adjusting your search or filters'}</Text>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity 
            style={styles.imageModalCloseArea}
            activeOpacity={1}
            onPress={() => setImageModalVisible(false)}
          >
            <View style={styles.imageModalContent}>
              <TouchableOpacity 
                style={styles.imageModalCloseButton}
                onPress={() => setImageModalVisible(false)}
              >
                <BlurView intensity={80} tint="dark" style={styles.closeButtonBlur}>
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </BlurView>
              </TouchableOpacity>
              <Image 
                source={selectedImage} 
                style={styles.fullImage} 
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  
  // Header Styles
  header: {
    zIndex: 10,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(17, 196, 141, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    top: 80,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(179, 157, 219, 0.08)',
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIconContainer: {
    marginRight: 12,
  },
  headerIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: colors.textSecondary, 
    marginTop: 2,
  },

  // Stats Card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(11, 63, 57, 0.6)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(17, 196, 141, 0.2)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.accentGreen,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.divider,
    marginHorizontal: 12,
  },

  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 63, 57, 0.8)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1.5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  clearButton: {
    padding: 4,
  },

  // Category Filters
  categoriesScrollView: {
    marginHorizontal: -20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 10,
    flexDirection: 'row',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(11, 63, 57, 0.6)',
    borderWidth: 1,
    borderColor: colors.divider,
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: colors.accentGreen,
    borderColor: colors.accentGreen,
  },
  categoryButtonText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },

  // List Container
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },

  // Scholar Card
  cardWrapper: {
    marginBottom: 16,
  },
  card: { 
    backgroundColor: colors.surface, 
    borderRadius: 20, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(17, 196, 141, 0.1)',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  scholarImage: { 
    width: '100%', 
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  floatingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 47, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 213, 79, 0.3)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accentYellow,
  },
  cardContent: {
    padding: 16,
  },
  scholarName: { 
    color: colors.textPrimary, 
    fontSize: 18, 
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 6,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  scholarTitle: {
    flex: 1,
    color: colors.accentGreen,
    fontSize: 13,
    fontWeight: '500',
  },
  bioPreview: { 
    color: colors.textSecondary, 
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  chipsScrollView: {
    marginHorizontal: -16,
    marginBottom: 12,
  },
  chipsContainer: { 
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  chip: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 10,
    gap: 5,
  },
  chipText: { 
    fontSize: 11, 
    fontWeight: '600',
  },
  moreChip: {
    backgroundColor: 'rgba(231, 245, 241, 0.1)',
  },
  moreChipText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(17, 196, 141, 0.1)',
    borderRadius: 12,
    gap: 8,
  },
  viewButtonText: {
    color: colors.accentGreen,
    fontSize: 14,
    fontWeight: '600',
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(11, 63, 57, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  resetButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.accentGreen,
    borderRadius: 25,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Image Modal
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  imageModalCloseArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageModalCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    zIndex: 10,
  },
  closeButtonBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fullImage: {
    width: width - 40,
    height: '70%',
    borderRadius: 12,
  },
});
