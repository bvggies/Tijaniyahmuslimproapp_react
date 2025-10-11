import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';

interface Scholar {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  image?: any;
  details?: { heading: string; text: string }[];
}

const SCHOLARS: Scholar[] = [
  // 1. Sheikh Ahmad Tijani
  {
    id: 'ahmad_tijani',
    name: 'Shaykh Ahmad Tijani (R.A)',
    title: 'Founder of Tariqa Tijaniyya & Seal of Muhammadan Sainthood',
    bio: 'Sidi Abu Abbas Ahmad al-Tijani (1737-1815), founder of the Tariqa Tijaniyya, was born in Ain Madi, Algeria. A descendant of the Prophet Muhammad through Hasan and Mawlay Idris, he established the most widespread Sufi order in West Africa and is recognized as the Seal of Muhammadan Sainthood.',
    frenchBio: 'Sidi Abu Abbas Ahmad al-Tijani (1737-1815), fondateur de la Tariqa Tijaniyya, est né à Ain Madi, en Algérie. Descendant du Prophète Muhammad par Hasan et Mawlay Idris, il a établi l\'ordre soufi le plus répandu en Afrique de l\'Ouest et est reconnu comme le Sceau de la Sainteté Muhammadienne.',
    arabicBio: 'سيدي أبو العباس أحمد التجاني (1737-1815)، مؤسس الطريقة التجانية، ولد في عين ماضي، الجزائر. من نسل النبي محمد صلى الله عليه وسلم من خلال الحسن ومولاي إدريس، أسس الطريقة الصوفية الأكثر انتشاراً في غرب أفريقيا وهو معترف به كخاتم الولاية المحمدية.',
    hausaBio: 'Sidi Abu Abbas Ahmad al-Tijani (1737-1815), wanda ya kafa Tariqa Tijaniyya, an haife shi a Ain Madi, Algeria. Zuriyar Annabi Muhammadu ta hanyar Hasan da Mawlay Idris, ya kafa ƙungiyar Sufi mafi yaduwa a Yammacin Afirka kuma ana gane shi a matsayin Hatimin Waliyyin Muhammadu.',
    specialties: ['Tariqa Tijaniyya', 'Sufism', 'Islamic Law', 'Hadith', 'Tafsir', 'Spiritual Guidance', 'Seal of Sainthood'],
    details: [
      { 
        heading: 'Birth & Noble Lineage', 
        text: 'Sidi Abu Abbas Ahmad al-Tijani was born in the Southwest Algerian oasis town of Ain Madi on the twelfth of Safar in the year 1150 AH (1737 C.E.). He was a descendant of the Prophet Muhammad through Fatima Zahra\'s first son Hasan and later through Mawlay Idris, the celebrated founder of Morocco. His full name was Ahmad ibn Muhammad ibn al-Mukhtar ibn Ahmad ibn Muhammad ibn Salam al-Tijani al-Hasani.',
        frenchText: 'Sidi Abu Abbas Ahmad al-Tijani est né dans la ville-oasis algérienne du Sud-Ouest d\'Ain Madi le douzième de Safar de l\'année 1150 AH (1737 C.E.). Il était un descendant du Prophète Muhammad par le premier fils de Fatima Zahra, Hasan, et plus tard par Mawlay Idris, le célèbre fondateur du Maroc. Son nom complet était Ahmad ibn Muhammad ibn al-Mukhtar ibn Ahmad ibn Muhammad ibn Salam al-Tijani al-Hasani.',
        arabicText: 'ولد سيدي أبو العباس أحمد التجاني في مدينة عين ماضي الواحة الجزائرية الجنوبية الغربية في الثاني عشر من صفر سنة 1150 هـ (1737 م). كان من نسل النبي محمد من خلال الحسن ابن فاطمة الزهراء الأول، ثم من خلال مولاي إدريس، مؤسس المغرب المشهور. كان اسمه الكامل أحمد بن محمد بن المختار بن أحمد بن محمد بن سلام التجاني الحسني.',
        hausaText: 'An haifi Sidi Abu Abbas Ahmad al-Tijani a garin Ain Madi na oas na kudu maso yammacin Algeria a ranar goma sha biyu na Safar a shekara ta 1150 AH (1737 C.E.). Ya kasance zuriyar Annabi Muhammadu ta hanyar Hasan ɗan farko na Fatima Zahra, sannan daga baya ta hanyar Mawlay Idris, wanda ya kafa Morocco. Cikakken sunansa shi ne Ahmad ibn Muhammad ibn al-Mukhtar ibn Ahmad ibn Muhammad ibn Salam al-Tijani al-Hasani.'
      },
      { 
        heading: 'Family Background', 
        text: 'His father was Sidi Muhammad b. al-Mukhtar b. Ahmad b. Muhammad b. Salam, a prominent scholar whose family hailed from the Moroccan Abda tribe and whose grandfather had immigrated to Ain Madi fleeing a Portuguese invasion less than a century before Shaykh Tijani\'s birth. His mother, Aisha, was the daughter of Muhammad b. Sanusi and was noted for her piety and generosity.',
        frenchText: 'Son père était Sidi Muhammad b. al-Mukhtar b. Ahmad b. Muhammad b. Salam, un érudit éminent dont la famille était originaire de la tribu marocaine Abda et dont le grand-père avait immigré à Ain Madi fuyant une invasion portugaise moins d\'un siècle avant la naissance de Shaykh Tijani. Sa mère, Aisha, était la fille de Muhammad b. Sanusi et était connue pour sa piété et sa générosité.',
        arabicText: 'كان والده سيدي محمد بن المختار بن أحمد بن محمد بن سلام، عالماً بارزاً تنحدر عائلته من قبيلة أبدا المغربية وهاجر جده إلى عين ماضي هرباً من الغزو البرتغالي قبل أقل من قرن من ولادة شيخ التجاني. كانت والدته عائشة ابنة محمد بن السنوسي وكانت معروفة بتقواها وكرمها.',
        hausaText: 'Mahaifinsa shi ne Sidi Muhammad b. al-Mukhtar b. Ahmad b. Muhammad b. Salam, malami mai daraja wanda danginsa suka fito daga kabilar Abda ta Morocco kuma kakansa ya yi ƙaura zuwa Ain Madi yana gudu daga mamayar Portuguese kafin ƙasa da ƙarni guda kafin haihuwar Shaykh Tijani. Mahaifiyarsa, Aisha, ita ce ɗiyar Muhammad b. Sanusi kuma an san ta da taqawa da karimci.'
      },
      { 
        heading: 'Early Education & Memorization', 
        text: 'The young Shaykh Tijani continued in the scholarly tradition of his family and city, memorizing the Qur\'an by the age of seven before turning to the study of jurisprudence (fiqh and usul al-fiqh), Prophetic traditions (Hadith), explanation of the Qur\'an (tafsir), Qur\'anic recitation (tajwid), grammar (nahw) and literature (adab), among other branches of the traditional Islamic sciences.',
        frenchText: 'Le jeune Shaykh Tijani a continué dans la tradition savante de sa famille et de sa ville, mémorisant le Coran à l\'âge de sept ans avant de se tourner vers l\'étude de la jurisprudence (fiqh et usul al-fiqh), des traditions prophétiques (Hadith), de l\'explication du Coran (tafsir), de la récitation coranique (tajwid), de la grammaire (nahw) et de la littérature (adab), parmi d\'autres branches des sciences islamiques traditionnelles.',
        arabicText: 'واصل الشيخ التجاني الشاب في التقليد العلمي لعائلته ومدينته، حيث حفظ القرآن في سن السابعة قبل أن يتوجه إلى دراسة الفقه وأصول الفقه، والحديث النبوي، وتفسير القرآن، وتجويد القرآن، والنحو والأدب، من بين فروع العلوم الإسلامية التقليدية الأخرى.',
        hausaText: 'Shaykh Tijani matashi ya ci gaba da al\'adar ilimi na danginsa da garinsa, ya haddace Alkur\'ani yana da shekara bakwai kafin ya juya zuwa nazarin shari\'a (fiqh da usul al-fiqh), hadisai na Annabi, tafsirin Alkur\'ani, karatun Alkur\'ani (tajwid), nahawu da adabi, daga cikin sauran bangarorin ilimin Musulunci na gargajiya.'
      },
      { 
        heading: 'Teachers in Ain Madi', 
        text: 'Among his first instructors were masters of their fields, such as Sidi Mabruk Ibn Ba\'afiyya Midawi al-Tijani, with whom he studied the Mukhtasar of Sidi Khalil, the Risala and the Muqaddama of Ibn Rushd (Averoes) and the Kitab al-\'Ibada of al-Akhdari. He also studied with Sidi Muhammad ibn Hammu al-Tijani and Sidi Ahmad ibn Muhammad al-Tijani.',
        frenchText: 'Parmi ses premiers instructeurs figuraient des maîtres dans leurs domaines, comme Sidi Mabruk Ibn Ba\'afiyya Midawi al-Tijani, avec qui il a étudié le Mukhtasar de Sidi Khalil, la Risala et la Muqaddama d\'Ibn Rushd (Averroès) et le Kitab al-\'Ibada d\'al-Akhdari. Il a également étudié avec Sidi Muhammad ibn Hammu al-Tijani et Sidi Ahmad ibn Muhammad al-Tijani.',
        arabicText: 'من بين أول معلميه كان هناك أساتذة في مجالاتهم، مثل سيدي مبروك بن بعافية مداوي التجاني، الذي درس معه مختصر سيدي خليل، والرسالة والمقدمة لابن رشد (أفيرويس) وكتاب العبادة للأخضري. كما درس مع سيدي محمد بن حمو التجاني وسيدي أحمد بن محمد التجاني.',
        hausaText: 'Daga cikin farkon malamansa akwai masu ƙwarewa a fagonsu, kamar Sidi Mabruk Ibn Ba\'afiyya Midawi al-Tijani, wanda ya yi karatu tare da shi Mukhtasar na Sidi Khalil, Risala da Muqaddama na Ibn Rushd (Averoes) da Kitab al-\'Ibada na al-Akhdari. Ya kuma yi karatu tare da Sidi Muhammad ibn Hammu al-Tijani da Sidi Ahmad ibn Muhammad al-Tijani.'
      },
      { 
        heading: 'Journey to Fes for Knowledge', 
        text: 'After mastering the sciences available in Ain Madi and becoming a great scholar, jurist and man of letters by the age of twenty, his thirst for more knowledge pushed him to leave the city of his birth in 1171/1758 for Fes, the long-established political, intellectual, cultural and religious capital of the Maghreb.',
        frenchText: 'Après avoir maîtrisé les sciences disponibles à Ain Madi et être devenu un grand savant, juriste et homme de lettres à l\'âge de vingt ans, sa soif de plus de connaissances l\'a poussé à quitter la ville de sa naissance en 1171/1758 pour Fes, la capitale politique, intellectuelle, culturelle et religieuse de longue date du Maghreb.',
        arabicText: 'بعد إتقانه للعلوم المتاحة في عين مادي وأصبح عالماً كبيراً وفقيهاً وأديباً في سن العشرين، دفعته رغبته في المزيد من المعرفة إلى مغادرة مدينة مولده في 1171/1758 إلى فاس، العاصمة السياسية والفكرية والثقافية والدينية الراسخة للمغرب.',
        hausaText: 'Bayan ya ƙware da ilimai da ake samu a Ain Madi kuma ya zama babban malami, mai shari\'a da marubuci yana da shekara ashirin, ƙishirwar ƙarin ilimi ta tilasta masa ya bar garin haihuwarsa a 1171/1758 zuwa Fes, babban birnin siyasa, hankali, al\'adu da addini na Maghreb.'
      },
      { 
        heading: 'Distinguished Teachers in Fes', 
        text: 'Among his teachers in Fes were many famous for their knowledge and saintliness: Al-Tayyib b. Muhammad al-Sharif of Wazan (d. 1180/1767), head of the Wazzaniyya Sufi order; Sidi Abdullah b. \'Arabi al-Mada\'u (d. 1188); Sidi Ahmad al-Tawash (d. 1204); Sidi Ahmad al-Yemeni; Abu Abdullah Sidi Muhammad al-Tizani; and Abu Abbas Ahmad al-Habib al-Sijilmasy (d. 1165).',
        frenchText: 'Parmi ses enseignants à Fes figuraient de nombreux personnages célèbres pour leur savoir et leur sainteté : Al-Tayyib b. Muhammad al-Sharif de Wazan (d. 1180/1767), chef de l\'ordre soufi Wazzaniyya ; Sidi Abdullah b. \'Arabi al-Mada\'u (d. 1188) ; Sidi Ahmad al-Tawash (d. 1204) ; Sidi Ahmad al-Yemeni ; Abu Abdullah Sidi Muhammad al-Tizani ; et Abu Abbas Ahmad al-Habib al-Sijilmasy (d. 1165).',
        arabicText: 'من بين معلميه في فاس كان هناك العديد من المشاهير في علمهم وولايته: الطيب بن محمد الشريف من وزان (ت. 1180/1767)، رئيس الطريقة الصوفية الوزانية؛ سيدي عبد الله بن عربي المدعو (ت. 1188)؛ سيدي أحمد الطواش (ت. 1204)؛ سيدي أحمد اليمني؛ أبو عبد الله سيدي محمد التيزاني؛ وأبو العباس أحمد الحبيب السجلماسي (ت. 1165).',
        hausaText: 'Daga cikin malamansa a Fes akwai da yawa sananne da iliminsu da waliyyi: Al-Tayyib b. Muhammad al-Sharif na Wazan (d. 1180/1767), shugaban ƙungiyar Sufi Wazzaniyya; Sidi Abdullah b. \'Arabi al-Mada\'u (d. 1188); Sidi Ahmad al-Tawash (d. 1204); Sidi Ahmad al-Yemeni; Abu Abdullah Sidi Muhammad al-Tizani; da Abu Abbas Ahmad al-Habib al-Sijilmasy (d. 1165).'
      },
      { 
        heading: 'Sufi Orders in Fes', 
        text: 'From Sidi Ahmad al-Yemeni, Shaykh Tijani took the Qadariyya Sufi order, and from Abu Abdullah Sidi Muhammad al-Tizani he took the Nasiriyya order. He also took the order of Abu Abbas Ahmad al-Habib al-Sijilmasy, who came to him in a dream, put his mouth on his, and taught him a secret name.',
        frenchText: 'De Sidi Ahmad al-Yemeni, Shaykh Tijani a pris l\'ordre soufi Qadariyya, et d\'Abu Abdullah Sidi Muhammad al-Tizani il a pris l\'ordre Nasiriyya. Il a également pris l\'ordre d\'Abu Abbas Ahmad al-Habib al-Sijilmasy, qui lui est apparu en rêve, a mis sa bouche sur la sienne, et lui a enseigné un nom secret.',
        arabicText: 'من سيدي أحمد اليمني، أخذ شيخ التجاني الطريقة الصوفية القادرية، ومن أبي عبد الله سيدي محمد التيزاني أخذ الطريقة الناصرية. كما أخذ الطريقة من أبي العباس أحمد الحبيب السجلماسي، الذي جاء إليه في حلم، ووضع فمه على فمه، وعلمه اسماً سرياً.',
        hausaText: 'Daga Sidi Ahmad al-Yemeni, Shaykh Tijani ya karɓi ƙungiyar Sufi Qadariyya, kuma daga Abu Abdullah Sidi Muhammad al-Tizani ya karɓi ƙungiyar Nasiriyya. Ya kuma karɓi ƙungiyar Abu Abbas Ahmad al-Habib al-Sijilmasy, wanda ya zo masa a cikin mafarki, ya sa bakinsa a kan nasa, kuma ya koya masa suna na sirri.'
      },
      { 
        heading: 'Spiritual Prediction by al-Wanjili', 
        text: 'Sidi Muhammad al-Wanjili (d. 1185), a man known for his saintliness, predicted for him a maqam (spiritual station) of Qutbaniyya (Polehood) similar to that of Abu Hasan al-Shadhili, but that his fath (spiritual opening) would come in the desert. This prediction would later prove accurate.',
        frenchText: 'Sidi Muhammad al-Wanjili (d. 1185), un homme connu pour sa sainteté, lui a prédit un maqam (station spirituelle) de Qutbaniyya (Pôle) similaire à celui d\'Abu Hasan al-Shadhili, mais que son fath (ouverture spirituelle) viendrait dans le désert. Cette prédiction s\'avérerait plus tard exacte.',
        arabicText: 'تنبأ له سيدي محمد الونجيلي (ت. 1185)، رجل معروف بقداسته، بمقام (محطة روحية) من القطبانية مشابه لمقام أبي الحسن الشاذلي، لكن أن فتحه الروحي سيأتي في الصحراء. هذه النبوءة ستثبت صحتها لاحقاً.',
        hausaText: 'Sidi Muhammad al-Wanjili (d. 1185), mutum da aka san da waliyyi, ya annabta masa maqam (tashar ruhaniya) na Qutbaniyya (Polehood) mai kama da na Abu Hasan al-Shadhili, amma cewa fath (buɗewar ruhaniya) zai zo a cikin hamada. Wannan annabcin zai tabbata daidai daga baya.'
      },
      { 
        heading: 'Desert Journey & Asceticism', 
        text: 'Shaykh Tijani spent time in the desert Zawiya of the famous Qutb Sidi Abd al-Qadir b. Muhammad al-Abyad (known as Sidi al-Shaykh) before returning to Ain Madi, then moving on to Tlemcen. His activities consisted of teaching Qur\'anic exegesis (tafsir) and Hadith while continuing rigorous practice of asceticism, including frequent fasting and supererogatory worship.',
        frenchText: 'Shaykh Tijani a passé du temps dans la Zawiya du désert du célèbre Qutb Sidi Abd al-Qadir b. Muhammad al-Abyad (connu sous le nom de Sidi al-Shaykh) avant de retourner à Ain Madi, puis de se rendre à Tlemcen. Ses activités consistaient à enseigner l\'exégèse coranique (tafsir) et le Hadith tout en continuant une pratique rigoureuse de l\'ascétisme, y compris le jeûne fréquent et l\'adoration surérogatoire.',
        arabicText: 'قضى شيخ التجاني وقتاً في زاوية الصحراء للقطب الشهير سيدي عبد القادر بن محمد الأبيض (المعروف بسيدي الشيخ) قبل العودة إلى عين مادي، ثم الانتقال إلى تلمسان. كانت أنشطته تتكون من تدريس تفسير القرآن والحديث مع الاستمرار في ممارسة الزهد الصارمة، بما في ذلك الصوم المتكرر والعبادة النافلة.',
        hausaText: 'Shaykh Tijani ya shafe lokaci a zawiya na hamada na sanannen Qutb Sidi Abd al-Qadir b. Muhammad al-Abyad (wanda aka fi sani da Sidi al-Shaykh) kafin ya koma Ain Madi, sannan ya ci gaba zuwa Tlemcen. Ayyukansa sun ƙunshi koyar da tafsirin Alkur\'ani da Hadisi yayin da yake ci gaba da aikin zuhudu mai ƙarfi, gami da azumi akai-akai da ibada na ƙari.'
      },
      { 
        heading: 'Journey to Mecca & Hajj', 
        text: 'In 1186/1773, Shaykh Ahmad Tijani set out to accomplish the Islamic pilgrimage (Hajj). His first stop of note was at Algiers, where he met Sidi Muhammad b. Abd al-Rahman al-Azhary (d. 1793), a prominent muqaddam of the Khalwatiyya Sufi order who had received initiation at the hands of Shaykh al-Azhar Muhammad al-Hifni.',
        frenchText: 'En 1186/1773, Shaykh Ahmad Tijani s\'est mis en route pour accomplir le pèlerinage islamique (Hajj). Son premier arrêt notable fut à Alger, où il rencontra Sidi Muhammad b. Abd al-Rahman al-Azhary (d. 1793), un muqaddam éminent de l\'ordre soufi Khalwatiyya qui avait reçu l\'initiation des mains de Shaykh al-Azhar Muhammad al-Hifni.',
        arabicText: 'في 1186/1773، انطلق شيخ أحمد التجاني لإنجاز الحج الإسلامي. كانت محطته الأولى المهمة في الجزائر، حيث التقى بسيدي محمد بن عبد الرحمن الأزهري (ت. 1793)، مقدم بارز في الطريقة الصوفية الخلوتية الذي تلقى التلقين على يد شيخ الأزهر محمد الحفني.',
        hausaText: 'A 1186/1773, Shaykh Ahmad Tijani ya tashi don cika aikin Hajji na Musulunci. Tasharsa ta farko mai muhimmanci ta kasance a Algiers, inda ya sadu da Sidi Muhammad b. Abd al-Rahman al-Azhary (d. 1793), fitaccen muqaddam na ƙungiyar Sufi Khalwatiyya wanda ya karɓi koyarwa daga hannun Shaykh al-Azhar Muhammad al-Hifni.'
      },
      { 
        heading: 'Khalwatiyya Initiation', 
        text: 'Shaykh Tijani\'s affiliation with the Khalwatiyya order was perhaps the most significant influence upon his thought prior to his waking meetings with the Prophet. He received initiation at the hands of al-Azhary in Algiers before continuing his journey East. This connection would later influence his spiritual development.',
        frenchText: 'L\'affiliation de Shaykh Tijani à l\'ordre Khalwatiyya fut peut-être l\'influence la plus significative sur sa pensée avant ses rencontres éveillées avec le Prophète. Il reçut l\'initiation des mains d\'al-Azhary à Alger avant de continuer son voyage vers l\'Est. Cette connexion influencerait plus tard son développement spirituel.',
        arabicText: 'كان انتماء شيخ التجاني للطريقة الخلوتية ربما التأثير الأكثر أهمية على فكره قبل لقاءاته اليقظة مع النبي. تلقى التلقين على يد الأزهري في الجزائر قبل متابعة رحلته شرقاً. هذه الصلة ستؤثر لاحقاً على تطوره الروحي.',
        hausaText: 'Haɗin Shaykh Tijani da ƙungiyar Khalwatiyya watakila shine tasiri mafi muhimmanci a kan tunaninsa kafin saduwar farkawa da Annabi. Ya karɓi koyarwa daga hannun al-Azhary a Algiers kafin ya ci gaba da tafiyarsa zuwa Gabas. Wannan dangantaka za ta yi tasiri a kan ci gabansa na ruhaniya daga baya.'
      },
      { 
        heading: 'Tunis & Zaytuna University', 
        text: 'Shaykh Ahmad Tijani\'s journey brought him to Tunis, home of the famous Zaytuna mosque and university. Upon his entry, he immediately met with people of saintly renown, such as Sidi Abd al-Samad al-Ruhwij, and took up teaching at Zaytuna, including Ibn \'Atta Allah\'s Kitab al-hikam.',
        frenchText: 'Le voyage de Shaykh Ahmad Tijani l\'a amené à Tunis, foyer de la célèbre mosquée et université Zaytuna. À son arrivée, il rencontra immédiatement des personnes de renom saint, comme Sidi Abd al-Samad al-Ruhwij, et commença à enseigner à Zaytuna, y compris le Kitab al-hikam d\'Ibn \'Atta Allah.',
        arabicText: 'أحضرت رحلة شيخ أحمد التجاني إلى تونس، موطن مسجد وجامعة الزيتونة الشهيرة. عند دخوله، التقى فوراً بأشخاص من الشهرة القدسية، مثل سيدي عبد الصمد الروحوي، وبدأ التدريس في الزيتونة، بما في ذلك كتاب الحكم لابن عطاء الله.',
        hausaText: 'Tafiyar Shaykh Ahmad Tijani ta kawo shi Tunis, gidan sanannen masallaci da jami\'ar Zaytuna. A lokacin shigarsa, nan da nan ya sadu da mutane masu suna na waliyyi, kamar Sidi Abd al-Samad al-Ruhwij, kuma ya fara koyarwa a Zaytuna, gami da Kitab al-hikam na Ibn \'Atta Allah.'
      },
      { 
        heading: 'Mecca & Hajj Performance', 
        text: 'Arriving in Mecca just after Ramadan in the year 1187/1774, Shaykh Ahmad Tijani stayed long enough to accomplish the rites of the Hajj. During his stay, he sought out people of "goodness, piety, righteousness and happiness" and engaged in spiritual practices.',
        frenchText: 'Arrivant à La Mecque juste après le Ramadan en l\'année 1187/1774, Shaykh Ahmad Tijani resta assez longtemps pour accomplir les rites du Hajj. Pendant son séjour, il chercha des personnes de "bonté, piété, droiture et bonheur" et s\'engagea dans des pratiques spirituelles.',
        arabicText: 'وصل إلى مكة المكرمة بعد رمضان مباشرة في عام 1187/1774، وبقي شيخ أحمد التجاني وقتاً كافياً لإنجاز مناسك الحج. خلال إقامته، سعى للقاء أشخاص من "الخير والتقوى والاستقامة والسعادة" وانخرط في الممارسات الروحية.',
        hausaText: 'Ya isa Makka daidai bayan Ramadan a shekara ta 1187/1774, Shaykh Ahmad Tijani ya zauna isasshen lokaci don cika ayyukan Hajji. A lokacin zaman sa, ya nemi mutane na "kyau, taqawa, adalci da farin ciki" kuma ya shiga cikin ayyukan ruhaniya.'
      },
      { 
        heading: 'Meeting with Ahmad al-Hindi', 
        text: 'His search led him to a mysterious saint from India, Ahmad b. Abdullah al-Hindi, who had made a vow to speak to no one except his servant. Al-Hindi sent him the message, "You are the inheritor of my knowledge, secrets, gifts and lights," and informed him to visit the Qutb Muhammad al-Samman when in Medina.',
        frenchText: 'Sa recherche l\'a conduit à un saint mystérieux d\'Inde, Ahmad b. Abdullah al-Hindi, qui avait fait le vœu de ne parler à personne sauf à son serviteur. Al-Hindi lui envoya le message : "Tu es l\'héritier de ma connaissance, de mes secrets, de mes dons et de mes lumières," et l\'informa de visiter le Qutb Muhammad al-Samman à Médine.',
        arabicText: 'قاده بحثه إلى ولي غامض من الهند، أحمد بن عبد الله الهندي، الذي كان قد نذر ألا يتكلم مع أحد إلا خادمه. أرسل له الهندي الرسالة: "أنت وارث علمي وأسرار وهدايا وأنوار،" وأخبره بزيارة القطب محمد السمان في المدينة.',
        hausaText: 'Bincikensa ya kai shi ga wani waliyyi mai ban mamaki daga Indiya, Ahmad b. Abdullah al-Hindi, wanda ya yi alƙawarin ba zai yi magana da kowa ba sai da bawan sa. Al-Hindi ya aika masa saƙon: "Kai ne magajin ilimina, sirrina, kyautata da haske," kuma ya sanar da shi ya ziyarci Qutb Muhammad al-Samman a Madina.'
      },
      { 
        heading: 'Medina & Prophet\'s Tomb', 
        text: 'After accomplishing the ziyara (visitation) to the Prophet\'s tomb, where "God completed his aspiration and longing" to greet the Prophet, Shaykh Tijani went to visit the renowned Shaykh Muhammad Abd al-Karim al-Samman (d. 1189/1775).',
        frenchText: 'Après avoir accompli la ziyara (visitation) au tombeau du Prophète, où "Dieu a complété son aspiration et son désir" de saluer le Prophète, Shaykh Tijani est allé visiter le renommé Shaykh Muhammad Abd al-Karim al-Samman (d. 1189/1775).',
        arabicText: 'بعد إنجاز الزيارة لقبر النبي، حيث "أكمل الله تطلعه وشوقه" لتحية النبي، ذهب شيخ التجاني لزيارة الشيخ المشهور محمد عبد الكريم السمان (ت. 1189/1775).',
        hausaText: 'Bayan ya cika ziyara (ziyara) zuwa kabarin Annabi, inda "Allah ya cika burinsa da sha\'awarsa" don gaishe Annabi, Shaykh Tijani ya tafi ya ziyarci sanannen Shaykh Muhammad Abd al-Karim al-Samman (d. 1189/1775).'
      },
      { 
        heading: 'Meeting with al-Samman', 
        text: 'Al-Samman was a member of the Khalwatiyya order, being one of two students given full ijaza (permission) by Mustafa al-Bakri. Before Shaykh Tijani\'s departure, al-Samman informed him of certain secret "names" and told him that he was to be the al-qutb al-jami\' (the comprehensive Pole).',
        frenchText: 'Al-Samman était membre de l\'ordre Khalwatiyya, étant l\'un des deux étudiants ayant reçu l\'ijaza complète (permission) de Mustafa al-Bakri. Avant le départ de Shaykh Tijani, al-Samman l\'informa de certains "noms" secrets et lui dit qu\'il devait être l\'al-qutb al-jami\' (le Pôle compréhensif).',
        arabicText: 'كان السمان عضواً في الطريقة الخلوتية، وكان واحداً من طالبين حصلا على الإجازة الكاملة (الإذن) من مصطفى البكري. قبل مغادرة شيخ التجاني، أخبره السمان بأسماء سرية معينة وقال له أنه سيكون القطب الجامع.',
        hausaText: 'Al-Samman ya kasance memba na ƙungiyar Khalwatiyya, yana ɗaya daga cikin ɗalibai biyu da suka karɓi ijaza cikakke (izini) daga Mustafa al-Bakri. Kafin Shaykh Tijani ya tafi, al-Samman ya sanar da shi wasu "sunan" na sirri kuma ya ce masa cewa zai zama al-qutb al-jami\' (Cikakken Pole).'
      },
      { 
        heading: 'Return via Cairo', 
        text: 'On his return from the Hijaz, Shaykh Tijani stopped in Cairo and visited Mahmud al-Kurdi, the Khalwati representative in Egypt. Demonstrating his profound respect for his teachers of the Khalwati tradition, Tijani accepted from al-Kurdi to be a muqaddam (propagator) of the Khalwati order in North Africa.',
        frenchText: 'Lors de son retour du Hijaz, Shaykh Tijani s\'arrêta au Caire et rendit visite à Mahmud al-Kurdi, le représentant Khalwati en Égypte. Démontrant son profond respect pour ses enseignants de la tradition Khalwati, Tijani accepta d\'al-Kurdi d\'être un muqaddam (propagateur) de l\'ordre Khalwati en Afrique du Nord.',
        arabicText: 'في عودته من الحجاز، توقف شيخ التجاني في القاهرة وزار محمود الكردي، ممثل الخلوتية في مصر. مظهراً احترامه العميق لمعلميه من التقليد الخلوتي، قبل التجاني من الكردي أن يكون مقدم (ناشر) للطريقة الخلوتية في شمال أفريقيا.',
        hausaText: 'A lokacin dawowarsa daga Hijaz, Shaykh Tijani ya tsaya a Cairo kuma ya ziyarci Mahmud al-Kurdi, wakilin Khalwati a Masar. Yana nuna girmamawarsa mai zurfi ga malamansa na al\'adar Khalwati, Tijani ya karɓi daga al-Kurdi ya zama muqaddam (mai yadawa) na ƙungiyar Khalwati a Arewacin Afirka.'
      },
      { 
        heading: 'The Prophet\'s Appearance in Abi Samghun', 
        text: 'The beginning of a distinctive "Tijani" order can be located with the appearance of the Prophet Muhammad to Shaykh Ahmad Tijani in a waking vision. This occurred in 1784, in the desert oasis of Abi Samghun. The Prophet informed him that he himself was his initiator on the Path and told him to leave the shaykhs he had previously followed.',
        frenchText: 'Le début d\'un ordre "Tijani" distinctif peut être situé avec l\'apparition du Prophète Muhammad à Shaykh Ahmad Tijani dans une vision éveillée. Cela s\'est produit en 1784, dans l\'oasis du désert d\'Abi Samghun. Le Prophète l\'informa qu\'il était lui-même son initiateur sur le Chemin et lui dit de quitter les shaykhs qu\'il avait précédemment suivis.',
        arabicText: 'يمكن تحديد بداية طريقة "تجانية" مميزة مع ظهور النبي محمد لشيخ أحمد التجاني في رؤيا يقظة. حدث هذا في عام 1784، في واحة الصحراء أبي سمغون. أخبره النبي أنه هو نفسه مبدؤه في الطريق وأمره بترك الشيوخ الذين كان يتبعهم سابقاً.',
        hausaText: 'Farkon ƙungiyar "Tijani" ta musamman za a iya gano ta da bayyanar Annabi Muhammad ga Shaykh Ahmad Tijani a cikin hangen nesa na farkawa. Wannan ya faru a 1784, a cikin oas na hamada na Abi Samghun. Annabi ya sanar da shi cewa shi da kansa ne mafarin sa a kan Hanya kuma ya ce masa ya bar shaykhs da ya bi a baya.'
      },
      { 
        heading: 'The New Wird & Permission', 
        text: 'The Shaykh then received the basis of a new wird and was given permission to give "spiritual training to the creation in [both] the general and unlimited (itlaq)." The Prophet told him: "You are not indebted for any favor from the shaykhs of the Path, for I am your means (wasita) and your support in the [spiritual] realization, so leave the entirety of what you have taken from all the tariqas."',
        frenchText: 'Le Shaykh reçut alors la base d\'un nouveau wird et fut autorisé à donner "une formation spirituelle à la création dans [les deux] le général et l\'illimité (itlaq)." Le Prophète lui dit : "Tu n\'es redevable d\'aucune faveur des shaykhs du Chemin, car je suis ton moyen (wasita) et ton soutien dans la réalisation [spirituelle], alors laisse l\'intégralité de ce que tu as pris de toutes les tariqas."',
        arabicText: 'ثم تلقى الشيخ أساس ورد جديد وأُعطي إذناً لإعطاء "تدريب روحي للخلق في [كلا] العام وغير المحدود (إطلاق)." قال له النبي: "لست مديناً بأي معروف من شيوخ الطريق، فأنا وسيلتك (وسيلة) ودعمك في التحقق [الروحي]، فاترك كامل ما أخذته من جميع الطرق."',
        hausaText: 'Sai Shaykh ya karɓi tushen sabon wird kuma aka ba shi izini ya ba "horon ruhaniya ga halitta a cikin [duka] na gaba ɗaya da marar iyaka (itlaq)." Annabi ya ce masa: "Ba ka da bashi na wani ni\'ima daga shaykhs na Hanya, gama ni ne hanyar ka (wasita) da goyon bayan ka a cikin tabbatarwa [na ruhaniya], don haka ka bar duk abin da ka karɓa daga duk tariqas."'
      },
      { 
        heading: 'Establishment in Fes', 
        text: 'Shaykh Ahmad Tijani and a group of his closest companions took up residence in Fes beginning in 1213/1798. By the time of his arrival, his fame as a scholar possessing religious charisma or blessing (baraka) had spread throughout the Maghreb.',
        frenchText: 'Shaykh Ahmad Tijani et un groupe de ses compagnons les plus proches s\'installèrent à Fes à partir de 1213/1798. Au moment de son arrivée, sa renommée en tant que savant possédant le charisme religieux ou la bénédiction (baraka) s\'était répandue dans tout le Maghreb.',
        arabicText: 'استقر شيخ أحمد التجاني ومجموعة من أقرب رفاقه في فاس بدءاً من 1213/1798. بحلول وقت وصوله، انتشرت شهرته كعالم يمتلك الكاريزما الدينية أو البركة في جميع أنحاء المغرب.',
        hausaText: 'Shaykh Ahmad Tijani da ƙungiyar abokansa na kusa sun zauna a Fes tun daga 1213/1798. A lokacin isowarsa, sunansa a matsayin malami mai karimci na addini ko albarka (baraka) ya yadu a duk faɗin Maghreb.'
      },
      { 
        heading: 'Relationship with Sultan Mawlay Sulayman', 
        text: 'The Shaykh was met by a delegation of scholars selected by the Sultan. After a series of tests to ascertain the veracity of Tijani\'s claims to sainthood, Mawlay Sulayman became closely linked to the newcomer, appointing him to his council of religious scholars and giving him a large house ("the House of Mirrors").',
        frenchText: 'Le Shaykh fut accueilli par une délégation de savants sélectionnés par le Sultan. Après une série de tests pour vérifier la véracité des prétentions de Tijani à la sainteté, Mawlay Sulayman devint étroitement lié au nouveau venu, le nommant à son conseil de savants religieux et lui donnant une grande maison ("la Maison des Miroirs").',
        arabicText: 'استقبل الشيخ وفداً من العلماء اختارهم السلطان. بعد سلسلة من الاختبارات لتأكيد صحة ادعاءات التجاني بالولاية، أصبح مولاي سليمان مرتبطاً ارتباطاً وثيقاً بالوافد الجديد، وعينه في مجلس العلماء الدينيين وأعطاه بيتاً كبيراً ("بيت المرايا").',
        hausaText: 'Shaykh ya gamu da wakilin malamai da Sultan ya zaɓa. Bayan jerin gwaje-gwaje don tabbatar da gaskiyar da\'awar Tijani na waliyyi, Mawlay Sulayman ya zama mai alaƙa ta kud da kud da sabon shigowa, ya naɗa shi a majalisar malamai na addini kuma ya ba shi babban gida ("Gidan Madubi").'
      },
      { 
        heading: 'The House of Mirrors', 
        text: 'The House of Mirrors can still be visited today. It has an expansive courtyard decorated entirely with blue and yellow zellij tile work with a large fountain in the middle, flanked by a number of rooms that include what was the Shaykh\'s library, a room for khalwa (spiritual retreat), a salon, the bedroom, the kitchen, etc.',
        frenchText: 'La Maison des Miroirs peut encore être visitée aujourd\'hui. Elle a une cour spacieuse décorée entièrement de carreaux zellij bleus et jaunes avec une grande fontaine au milieu, flanquée d\'un certain nombre de pièces qui incluent ce qui était la bibliothèque du Shaykh, une pièce pour khalwa (retraite spirituelle), un salon, la chambre, la cuisine, etc.',
        arabicText: 'يمكن زيارة بيت المرايا حتى اليوم. له فناء واسع مزين بالكامل بأعمال البلاط الزليج الأزرق والأصفر مع نافورة كبيرة في الوسط، محاط بعدد من الغرف التي تشمل ما كان مكتبة الشيخ، وغرفة للخلوة (الاعتكاف الروحي)، وصالون، وغرفة النوم، والمطبخ، إلخ.',
        hausaText: 'Gidan Madubi har yanzu ana iya ziyartarsa a yau. Yana da babban tsakar gida wanda aka yi masa ado gaba ɗaya da fale-falen zellij shuɗi da rawaya tare da babban maɗaukaki a tsakiya, kewaye da ɗakuna da yawa waɗanda suka haɗa da abin da ya kasance ɗakin karatu na Shaykh, ɗaki don khalwa (ja da baya na ruhaniya), salon, ɗakin kwana, kicin, da sauransu.'
      },
      { 
        heading: 'Construction of the Zawiya', 
        text: 'Established in Fes, the Shaykh\'s following continued to grow, prompting him in 1215 (1800), by order of the Prophet, to begin construction of the Tijani zawiya that still serves as a place of congregation for the order to this day.',
        frenchText: 'Établi à Fes, le nombre de disciples du Shaykh continua de croître, l\'incitant en 1215 (1800), sur ordre du Prophète, à commencer la construction de la zawiya Tijani qui sert encore aujourd\'hui de lieu de rassemblement pour l\'ordre.',
        arabicText: 'بعد استقراره في فاس، استمر عدد أتباع الشيخ في النمو، مما دفعه في 1215 (1800)، بأمر من النبي، إلى بدء بناء الزاوية التجانية التي لا تزال تخدم كمكان للتجمع للطريقة حتى يومنا هذا.',
        hausaText: 'Bayan ya zauna a Fes, yawan mabiyan Shaykh ya ci gaba da girma, wanda ya sa shi a 1215 (1800), bisa umarnin Annabi, ya fara gina zawiya Tijani wacce har yanzu tana aiki a matsayin wurin taro ga ƙungiyar har yau.'
      },
      { 
        heading: 'Muqaddams & Global Propagation', 
        text: 'Before the end of his life, he had attracted thousands of followers and sent out muqaddams such as Ali Harazem al-Barada, Muhammad Ghali and Muhammad al-Hafiz as far away as the Hijaz and Mauritania. These muqaddams would spread the Tariqa throughout West Africa and beyond.',
        frenchText: 'Avant la fin de sa vie, il avait attiré des milliers de disciples et envoyé des muqaddams comme Ali Harazem al-Barada, Muhammad Ghali et Muhammad al-Hafiz aussi loin que le Hijaz et la Mauritanie. Ces muqaddams répandraient la Tariqa dans toute l\'Afrique de l\'Ouest et au-delà.',
        arabicText: 'قبل نهاية حياته، كان قد اجتذب آلاف الأتباع وأرسل مقدمين مثل علي حرازم البرادة ومحمد غالي ومحمد الحافظ إلى أماكن بعيدة مثل الحجاز وموريتانيا. هؤلاء المقدمون سينشرون الطريقة في جميع أنحاء غرب أفريقيا وما بعدها.',
        hausaText: 'Kafin ƙarshen rayuwarsa, ya jawo dubban mabiya kuma ya aika muqaddams kamar Ali Harazem al-Barada, Muhammad Ghali da Muhammad al-Hafiz zuwa nesa kamar Hijaz da Mauritania. Waɗannan muqaddams za su yada Tariqa a duk faɗin Yammacin Afirka da sauransu.'
      },
      { 
        heading: 'The Seal of Muhammadan Sainthood', 
        text: 'Shaykh Ahmad Tijani is recognized by Tijanis as the Khātam al-Wilāyah al-Muhammadiyyah (Seal of Muhammadan Sainthood), meaning that none will appear in that rank in the complete way that he appeared. He is the Seal of the complete manifestation of that rank.',
        frenchText: 'Shaykh Ahmad Tijani est reconnu par les Tijanis comme le Khātam al-Wilāyah al-Muhammadiyyah (Sceau de la Sainteté Muhammadienne), ce qui signifie qu\'aucun n\'apparaîtra dans ce rang de la manière complète dont il est apparu. Il est le Sceau de la manifestation complète de ce rang.',
        arabicText: 'يعترف التجانيون بشيخ أحمد التجاني كخاتم الولاية المحمدية، مما يعني أنه لن يظهر أحد في هذا المقام بالطريقة الكاملة التي ظهر بها. إنه خاتم التجلي الكامل لذلك المقام.',
        hausaText: 'Shaykh Ahmad Tijani ana gane shi da Tijanis a matsayin Khātam al-Wilāyah al-Muhammadiyyah (Hatimin Waliyyin Muhammadu), ma\'ana cewa ba wanda zai bayyana a wannan matsayi da cikakkiyar hanyar da ya bayyana. Shi ne Hatimin cikakken bayyanar wannan matsayi.'
      },
      { 
        heading: 'Passing & Legacy', 
        text: 'Shaykh Ahmad Tijani passed from this world in 1230 AH (1815) at the age of eighty. He left behind him a firmly established order, the Tariqa Muhammadiyya emphasis of which inspired many of his later followers to renew and spread Islam in diverse communities far from the mother zawiya in Fes.',
        frenchText: 'Shaykh Ahmad Tijani a quitté ce monde en 1230 AH (1815) à l\'âge de quatre-vingts ans. Il a laissé derrière lui un ordre fermement établi, l\'accent mis sur la Tariqa Muhammadiyya qui a inspiré nombre de ses disciples ultérieurs à renouveler et répandre l\'Islam dans diverses communautés loin de la zawiya mère à Fes.',
        arabicText: 'انتقل شيخ أحمد التجاني من هذا العالم في 1230 هـ (1815) في سن الثمانين. ترك وراءه طريقة راسخة، حيث ألهم تأكيد الطريقة المحمدية العديد من أتباعه اللاحقين لتجديد ونشر الإسلام في مجتمعات متنوعة بعيداً عن الزاوية الأم في فاس.',
        hausaText: 'Shaykh Ahmad Tijani ya bar wannan duniya a 1230 AH (1815) yana da shekara tamanin. Ya bar a bayansa ƙungiya mai ƙarfi, ƙarfafawar Tariqa Muhammadiyya wacce ta ƙarfafa yawancin mabiyansa na baya don sabunta da yada Musulunci a cikin al\'ummomi daban-daban nesa da zawiya uwar a Fes.'
      },
      { 
        heading: 'Burial & Continuing Influence', 
        text: 'Shaykh Ahmad Tijani was buried in his zawiya in Fes, which today remains a center of congregation for Tijanis around the world. His order has become the most widespread Sufi order in West Africa and continues to inspire millions of followers worldwide, maintaining its spiritual vitality and scholarly tradition.',
        frenchText: 'Shaykh Ahmad Tijani a été enterré dans sa zawiya à Fes, qui reste aujourd\'hui un centre de rassemblement pour les Tijanis du monde entier. Son ordre est devenu l\'ordre soufi le plus répandu en Afrique de l\'Ouest et continue d\'inspirer des millions d\'adeptes dans le monde, maintenant sa vitalité spirituelle et sa tradition savante.',
        arabicText: 'دفن شيخ أحمد التجاني في زاويته في فاس، التي لا تزال اليوم مركزاً للتجمع للتجانيين في جميع أنحاء العالم. أصبحت طريقته الطريقة الصوفية الأكثر انتشاراً في غرب أفريقيا وتستمر في إلهام الملايين من الأتباع في جميع أنحاء العالم، محافظة على حيويتها الروحية وتقليدها العلمي.',
        hausaText: 'An binne Shaykh Ahmad Tijani a zawiyarsa a Fes, wacce har yanzu ta kasance cibiyar taro ga Tijanis a duniya. Ƙungiyarsa ta zama ƙungiyar Sufi mafi yaduwa a Yammacin Afirka kuma ta ci gaba da ƙarfafa miliyoyin mabiya a duniya, tana kiyaye ƙarfin ruhaniya da al\'adar ilimi.'
      }
    ],
  },
  // 2. Sidi Ali Harazim Al-Barada
  {
    id: 'ali_harazim_al_barada',
    name: 'Khalifat Al-Akbar, Sidi Ali Harazim Al-Barada (R.A)',
    title: 'Greatest Inheritor of Shaykh Ahmad Tijani & Author of Jawahir al-Ma\'ani',
    bio: 'Gifted with gnosis and consummate sainthood, Sidi Ali Harazim was known as the greatest inheritor (khalifa) of Shaykh Ahmad Tijani, and was commended to the Shaykh by the Prophet Muhammad himself. He authored the Jawahir al-Ma\'ani, the primary source of Shaykh Tijani\'s life and teachings.',
    frenchBio: 'Doué de gnose et de sainteté accomplie, Sidi Ali Harazim était connu comme le plus grand héritier (khalifa) de Shaykh Ahmad Tijani, et fut recommandé au Shaykh par le Prophète Muhammad lui-même. Il a écrit le Jawahir al-Ma\'ani, la source principale de la vie et des enseignements de Shaykh Tijani.',
    arabicBio: 'موهوب بالمعرفة والولاية التامة، كان سيدي علي حرازم معروفاً بأكبر خليفة لشيخ أحمد التجاني، وقد أوصى به النبي محمد صلى الله عليه وسلم للشيخ بنفسه. ألف جوهر المعاني، المصدر الأساسي لحياة وتعاليم شيخ التجاني.',
    hausaBio: 'Mai baiwa da ilimi da cikakken waliyyi, Sidi Ali Harazim an san shi da babban magaji (khalifa) na Shaykh Ahmad Tijani, kuma Annabi Muhammadu da kansa ya ba shi shawara ga Shaykh. Ya rubuta Jawahir al-Ma\'ani, tushen farko na rayuwa da koyarwar Shaykh Tijani.',
    specialties: ['Tariqa Tijaniyya', 'Sufism', 'Spiritual Guidance', 'Jawahir al-Ma\'ani', 'Khalifa', 'Scholarship'],
    details: [
      { 
        heading: 'Prophet\'s Commendation', 
        text: 'In a waking vision, the Prophet told the Shaykh, "He is for you what Abu Bakr was for me." In another vision, the Prophet said, "O Ahmad, consult with your greatest servant (khadimik al-akbar) and your beloved, Harazim, for he is for you what Aaron was for Moses." This shows the special relationship between Shaykh Tijani and Sidi Ali Harazim.',
        frenchText: 'Dans une vision éveillée, le Prophète dit au Shaykh : "Il est pour toi ce qu\'Abu Bakr était pour moi." Dans une autre vision, le Prophète dit : "Ô Ahmad, consulte avec ton plus grand serviteur (khadimik al-akbar) et ton bien-aimé, Harazim, car il est pour toi ce qu\'Aaron était pour Moïse." Cela montre la relation spéciale entre Shaykh Tijani et Sidi Ali Harazim.',
        arabicText: 'في رؤيا يقظة، قال النبي للشيخ: "هو لك ما كان أبو بكر لي." وفي رؤيا أخرى، قال النبي: "يا أحمد، استشر أعظم خادمك (خادمك الأكبر) وحبيبك حرازم، فهو لك ما كان هارون لموسى." هذا يظهر العلاقة الخاصة بين شيخ التجاني وسيدي علي حرازم.',
        hausaText: 'A cikin hangen nesa na farkawa, Annabi ya ce wa Shaykh: "Shi gare ka ne abin da Abu Bakr ya kasance gare ni." A wani hangen nesa, Annabi ya ce: "Ya Ahmad, ka shawarta da babban bawan ka (khadimik al-akbar) da ƙaunataccen ka, Harazim, gama shi gare ka ne abin da Haruna ya kasance ga Musa." Wannan yana nuna dangantaka ta musamman tsakanin Shaykh Tijani da Sidi Ali Harazim.'
      },
      { 
        heading: 'First Meeting in Wajda', 
        text: 'Sidi Ali first met Shaykh Tijani in Wajda (or Oujda, Eastern Morocco) while the latter was en route to Fes after returning from Hajj. Both had received knowledge from God that he was to be associated with the other, but Sidi Ali did not immediately recognize Shaykh Tijani until the Shaykh said, "You have been told that your shaykh on the path will be a certain Shaykh Ahmad Tijani."',
        frenchText: 'Sidi Ali a rencontré Shaykh Tijani pour la première fois à Wajda (ou Oujda, Maroc oriental) alors que ce dernier était en route vers Fes après son retour du Hajj. Tous deux avaient reçu de Dieu la connaissance qu\'il devait être associé à l\'autre, mais Sidi Ali n\'a pas immédiatement reconnu Shaykh Tijani jusqu\'à ce que le Shaykh dise : "On vous a dit que votre shaykh sur le chemin sera un certain Shaykh Ahmad Tijani."',
        arabicText: 'التقى سيدي علي بشيخ التجاني لأول مرة في وجدة (أو وجدة، المغرب الشرقي) بينما كان الأخير في طريقه إلى فاس بعد عودته من الحج. كلاهما تلقى من الله المعرفة أنه سيرتبط بالآخر، لكن سيدي علي لم يتعرف فوراً على شيخ التجاني حتى قال الشيخ: "قيل لك أن شيخك في الطريق سيكون شيخ أحمد التجاني معين."',
        hausaText: 'Sidi Ali ya fara saduwa da Shaykh Tijani a Wajda (ko Oujda, Gabashin Morocco) yayin da na ƙarshe yake kan hanyar zuwa Fes bayan dawowar Hajji. Dukansu sun karɓi ilimi daga Allah cewa zai kasance tare da ɗayan, amma Sidi Ali bai gane Shaykh Tijani nan da nan ba har sai Shaykh ya ce: "An gaya maka cewa shaykh ɗinka a kan hanya zai zama wani Shaykh Ahmad Tijani."'
      },
      { 
        heading: 'Recognition & Initiation', 
        text: 'Much surprised at the stranger\'s ability to guess the content of his previous dreams, Sidi Ali replied, "Yes, that is so." Shaykh Tijani then said, "I am he." At this time Shaykh Tijani had not yet received his own Tariqa Muhammadiyya from the Prophet, so Shaykh Tijani instructed him in the Khalwati way.',
        frenchText: 'Très surpris de la capacité de l\'étranger à deviner le contenu de ses rêves précédents, Sidi Ali répondit : "Oui, c\'est ainsi." Shaykh Tijani dit alors : "Je suis lui." À cette époque, Shaykh Tijani n\'avait pas encore reçu sa propre Tariqa Muhammadiyya du Prophète, donc Shaykh Tijani l\'instruisit dans la voie Khalwati.',
        arabicText: 'مندهشاً جداً من قدرة الغريب على تخمين محتوى أحلامه السابقة، أجاب سيدي علي: "نعم، هذا صحيح." فقال شيخ التجاني: "أنا هو." في ذلك الوقت لم يكن شيخ التجاني قد تلقى بعد طريقته المحمدية من النبي، لذلك علمه شيخ التجاني الطريقة الخلوتية.',
        hausaText: 'Ya yi mamaki sosai da ikon baƙon na tsinkayar abin da ke cikin mafarkansa na baya, Sidi Ali ya amsa: "Ee, haka ne." Sai Shaykh Tijani ya ce: "Ni ne shi." A wannan lokacin Shaykh Tijani bai karɓi Tariqa Muhammadiyya ta kansa daga Annabi ba tukuna, don haka Shaykh Tijani ya koya masa hanyar Khalwati.'
      },
      { 
        heading: 'Accompaniment to Fes', 
        text: 'Sidi Ali accompanied the Shaykh when he settled in Fes (1798), and was responsible for composing the Jawahir al-Ma\'ani, which remains the primary source of Shaykh Tijani\'s life and teachings. This work became the foundational text of the Tariqa Tijaniyya.',
        frenchText: 'Sidi Ali accompagna le Shaykh lorsqu\'il s\'installa à Fes (1798), et fut responsable de la composition du Jawahir al-Ma\'ani, qui reste la source principale de la vie et des enseignements de Shaykh Tijani. Cette œuvre devint le texte fondateur de la Tariqa Tijaniyya.',
        arabicText: 'رافق سيدي علي الشيخ عندما استقر في فاس (1798)، وكان مسؤولاً عن تأليف جواهر المعاني، الذي يبقى المصدر الأساسي لحياة وتعاليم شيخ التجاني. أصبح هذا العمل النص التأسيسي للطريقة التجانية.',
        hausaText: 'Sidi Ali ya raka Shaykh lokacin da ya zauna a Fes (1798), kuma ya kasance mai alhakin rubuta Jawahir al-Ma\'ani, wanda ya kasance tushen farko na rayuwa da koyarwar Shaykh Tijani. Wannan aikin ya zama rubutun tushe na Tariqa Tijaniyya.'
      },
      { 
        heading: 'Jawahir al-Ma\'ani - The Masterpiece', 
        text: 'Of this book, the Prophet told Shaykh Tijani, "This book belongs to me"; and concerning the words of Sidi Ali more generally, the Shaykh used to say, "What my khalifa says, I also say that." The Jawahir al-Ma\'ani is considered the most authoritative source on the life and teachings of Shaykh Ahmad Tijani.',
        frenchText: 'De ce livre, le Prophète dit à Shaykh Tijani : "Ce livre m\'appartient" ; et concernant les paroles de Sidi Ali plus généralement, le Shaykh avait l\'habitude de dire : "Ce que mon khalifa dit, je le dis aussi." Le Jawahir al-Ma\'ani est considéré comme la source la plus autoritaire sur la vie et les enseignements de Shaykh Ahmad Tijani.',
        arabicText: 'عن هذا الكتاب، قال النبي لشيخ التجاني: "هذا الكتاب لي"؛ وبخصوص كلمات سيدي علي بشكل عام، كان الشيخ يقول: "ما يقوله خليفتي، أقول ذلك أيضاً." يعتبر جوهر المعاني المصدر الأكثر موثوقية عن حياة وتعاليم شيخ أحمد التجاني.',
        hausaText: 'Game da wannan littafin, Annabi ya ce wa Shaykh Tijani: "Wannan littafi nawa ne"; kuma game da kalmomin Sidi Ali gabaɗaya, Shaykh ya kasance yana cewa: "Abin da khalifa na ya ce, ni ma ina cewa haka." Jawahir al-Ma\'ani ana ɗaukarsa a matsayin tushen da ya fi dacewa game da rayuwa da koyarwar Shaykh Ahmad Tijani.'
      },
      { 
        heading: 'Spiritual Authority & Succession', 
        text: 'He is similarly reported to have said of Sidi Ali, "No one will receive anything from me except by way of Sidi Harazim." Although he died before Shaykh Tijani, Sidi Ali is still considered the greatest spiritual successor among the Shaykh\'s companions, even if the greatest successor alive at Shaykh Tijani\'s own passing was Sidi Ali Tamasini.',
        frenchText: 'Il est également rapporté qu\'il a dit de Sidi Ali : "Personne ne recevra rien de moi sauf par l\'intermédiaire de Sidi Harazim." Bien qu\'il soit mort avant Shaykh Tijani, Sidi Ali est toujours considéré comme le plus grand successeur spirituel parmi les compagnons du Shaykh, même si le plus grand successeur vivant au moment du décès de Shaykh Tijani était Sidi Ali Tamasini.',
        arabicText: 'وقد روي عنه أيضاً أنه قال عن سيدي علي: "لا يأخذ أحد مني شيئاً إلا عن طريق سيدي حرازم." رغم أنه مات قبل شيخ التجاني، فإن سيدي علي لا يزال يعتبر أعظم خليفة روحي بين أصحاب الشيخ، حتى لو كان أعظم خليفة حي عند وفاة شيخ التجاني هو سيدي علي تاماسيني.',
        hausaText: 'Haka kuma an ruwaito cewa ya ce game da Sidi Ali: "Ba wanda zai karɓi komai daga gare ni sai ta hanyar Sidi Harazim." Ko da yake ya mutu kafin Shaykh Tijani, Sidi Ali har yanzu ana ɗaukarsa a matsayin babban magajin ruhaniya a tsakanin sahabban Shaykh, ko da kuwa babban magajin da ke raye a lokacin mutuwar Shaykh Tijani shi ne Sidi Ali Tamasini.'
      },
      { 
        heading: 'Greater Illumination (Fath al-Akbar)', 
        text: 'After receiving the greater illumination (fath al-akbar), the Shaykh sent Sidi Ali Harazim to accomplish his pilgrimage to Mecca and to visit the Prophet Muhammad in Medina. Many miracles (karamat) and spiritual unveilings are reported on this journey.',
        frenchText: 'Après avoir reçu la plus grande illumination (fath al-akbar), le Shaykh envoya Sidi Ali Harazim accomplir son pèlerinage à La Mecque et visiter le Prophète Muhammad à Médine. De nombreux miracles (karamat) et dévoilements spirituels sont rapportés sur ce voyage.',
        arabicText: 'بعد تلقي الإشراق الأكبر (الفتح الأكبر)، أرسل الشيخ سيدي علي حرازم لإنجاز حجه إلى مكة وزيارة النبي محمد في المدينة. العديد من الكرامات والكشوفات الروحية مذكورة في هذه الرحلة.',
        hausaText: 'Bayan ya karɓi babban haske (fath al-akbar), Shaykh ya aika Sidi Ali Harazim don cika Hajjinsa zuwa Makka da ziyarci Annabi Muhammad a Madina. Yawancin mu\'ujizai (karamat) da buɗewar ruhaniya an ruwaito a wannan tafiya.'
      },
      { 
        heading: 'Journey to Mecca & Spiritual Impact', 
        text: 'Many miracles (karamat) and spiritual unveilings are reported on this journey, which we are not inclined to mention here. But it is clear his lofty spiritual zeal (himma) touched many who encountered him on this journey, among whom was Shaykh al-Islam Ibrahim Riyahi of the Zaytuna University who hosted Sidi Ali for several months in Tunis.',
        frenchText: 'De nombreux miracles (karamat) et dévoilements spirituels sont rapportés sur ce voyage, que nous ne sommes pas enclins à mentionner ici. Mais il est clair que son zèle spirituel élevé (himma) a touché beaucoup de ceux qui l\'ont rencontré sur ce voyage, parmi lesquels Shaykh al-Islam Ibrahim Riyahi de l\'Université Zaytuna qui a hébergé Sidi Ali pendant plusieurs mois à Tunis.',
        arabicText: 'العديد من الكرامات والكشوفات الروحية مذكورة في هذه الرحلة، والتي لا نميل إلى ذكرها هنا. لكن من الواضح أن حميته الروحية العالية (همة) أثرت في كثير ممن التقوا به في هذه الرحلة، ومن بينهم شيخ الإسلام إبراهيم الرياحي من جامعة الزيتونة الذي استضاف سيدي علي لعدة أشهر في تونس.',
        hausaText: 'Yawancin mu\'ujizai (karamat) da buɗewar ruhaniya an ruwaito a wannan tafiya, waɗanda ba mu son ambata a nan ba. Amma a bayyane yake cewa ƙwazo nasa na ruhaniya (himma) ya shafi yawancin waɗanda suka sadu da shi a wannan tafiya, daga cikinsu akwai Shaykh al-Islam Ibrahim Riyahi na Jami\'ar Zaytuna wanda ya ba Sidi Ali masauki na watanni da yawa a Tunis.'
      },
      { 
        heading: 'Meeting with Shaykh Riyahi in Tunis', 
        text: 'Shaykh Riyahi was no doubt inspired from meeting Sidi Ali to visit Shaykh Tijani himself on a later trip to Fes. This meeting had a profound impact on Shaykh Riyahi\'s spiritual development and his eventual embrace of the Tariqa Tijaniyya.',
        frenchText: 'Shaykh Riyahi fut sans aucun doute inspiré par sa rencontre avec Sidi Ali pour visiter Shaykh Tijani lui-même lors d\'un voyage ultérieur à Fes. Cette rencontre eut un impact profond sur le développement spirituel de Shaykh Riyahi et son adoption ultérieure de la Tariqa Tijaniyya.',
        arabicText: 'لا شك أن شيخ الرياحي استلهم من لقائه مع سيدي علي لزيارة شيخ التجاني نفسه في رحلة لاحقة إلى فاس. كان لهذا اللقاء تأثير عميق على التطور الروحي لشيخ الرياحي وتبنيه النهائي للطريقة التجانية.',
        hausaText: 'Babu shakka Shaykh Riyahi ya sami wahayi daga saduwar sa da Sidi Ali don ya ziyarci Shaykh Tijani da kansa a wani tafiya na baya zuwa Fes. Wannan saduwar ta yi tasiri mai zurfi a kan ci gabansa na ruhaniya da kuma karɓar sa na Tariqa Tijaniyya daga baya.'
      },
      { 
        heading: 'Burial at Badr Among Martyrs', 
        text: 'After accomplishing the Hajj, Sidi Ali went to visit the tomb of the Prophet. When he arrived in Badr on the way to Medina, he was overcome by love for the Prophet and fell into such a deep spiritual state (hal) that he came to be buried among the martyrs at Badr.',
        frenchText: 'Après avoir accompli le Hajj, Sidi Ali se rendit visiter le tombeau du Prophète. Quand il arriva à Badr sur le chemin de Médine, il fut submergé par l\'amour pour le Prophète et tomba dans un état spirituel si profond (hal) qu\'il en vint à être enterré parmi les martyrs à Badr.',
        arabicText: 'بعد إنجاز الحج، ذهب سيدي علي لزيارة قبر النبي. عندما وصل إلى بدر في الطريق إلى المدينة، غمره حب النبي وسقط في حالة روحية عميقة (حال) لدرجة أنه دُفن بين الشهداء في بدر.',
        hausaText: 'Bayan ya cika Hajji, Sidi Ali ya tafi ya ziyarci kabarin Annabi. Lokacin da ya isa Badr a kan hanyar zuwa Madina, ƙaunarsa ga Annabi ta mamaye shi kuma ya fadi cikin wani yanayi na ruhaniya mai zurfi (hal) har ya zama an binne shi a tsakanin shahidai a Badr.'
      },
      { 
        heading: 'Shaykh Tijani\'s Testimony at Burial', 
        text: 'At the exact moment of his burial, Shaykh Tijani told his companions in Fes, "If they did not bury him, they would hear from him sciences, gnosis and secrets such as they have never heard before and have never found in any book." This shows the depth of Sidi Ali\'s spiritual knowledge.',
        frenchText: 'Au moment exact de son enterrement, Shaykh Tijani dit à ses compagnons à Fes : "S\'ils ne l\'avaient pas enterré, ils auraient entendu de lui des sciences, des gnoses et des secrets tels qu\'ils n\'en avaient jamais entendu auparavant et qu\'ils n\'avaient jamais trouvés dans aucun livre." Cela montre la profondeur de la connaissance spirituelle de Sidi Ali.',
        arabicText: 'في اللحظة الدقيقة لدفنه، قال شيخ التجاني لأصحابه في فاس: "لو لم يدفنوه، لسمعوا منه علوماً ومعارف وأسراراً لم يسمعوا بها من قبل ولم يجدوها في أي كتاب." هذا يظهر عمق المعرفة الروحية لسيدي علي.',
        hausaText: 'A daidai lokacin binne shi, Shaykh Tijani ya ce wa sahabbansa a Fes: "Da ba su binne shi ba, da sun ji daga gare shi ilimai, gano da sirri irin waɗanda ba su taɓa ji ba a baya kuma ba su taɓa samu a kowane littafi ba." Wannan yana nuna zurfin ilimin ruhaniya na Sidi Ali.'
      },
      { 
        heading: 'Grave at Badr & Modern Visitation', 
        text: 'His grave at Badr is no longer distinguishable, like many other tombs destroyed in the last two centuries. But Shaykh Hassan Cisse, when visiting Badr some years ago, reports having been indicated the exact spot in a visionary encounter with Sidi Ali Harazem himself.',
        frenchText: 'Sa tombe à Badr n\'est plus distinguable, comme beaucoup d\'autres tombes détruites au cours des deux derniers siècles. Mais Shaykh Hassan Cisse, lors de sa visite à Badr il y a quelques années, rapporte avoir été indiqué l\'endroit exact dans une rencontre visionnaire avec Sidi Ali Harazem lui-même.',
        arabicText: 'قبره في بدر لم يعد مميزاً، مثل العديد من القبور الأخرى التي دُمرت في القرنين الماضيين. لكن شيخ حسن سيس، عند زيارته لبدر قبل بضع سنوات، يروي أنه تم إرشاده إلى المكان الدقيق في لقاء رؤيوي مع سيدي علي حرازم نفسه.',
        hausaText: 'Kabarin sa a Badr ba ya iya bambanta, kamar yawancin sauran kaburbura da aka lalata a cikin ƙarnuka biyu da suka gabata. Amma Shaykh Hassan Cisse, lokacin da ya ziyarci Badr shekaru da yawa da suka wuce, ya ruwaito cewa an nuna masa daidai wurin a cikin saduwar hangen nesa da Sidi Ali Harazem da kansa.'
      },
      { 
        heading: 'Literary Legacy', 
        text: 'The Jawahir al-Ma\'ani remains one of the most important works in the Tijaniyya tradition, providing detailed accounts of Shaykh Tijani\'s life, teachings, and spiritual experiences. It serves as the primary reference for understanding the early development of the Tariqa.',
        frenchText: 'Le Jawahir al-Ma\'ani reste l\'une des œuvres les plus importantes de la tradition Tijaniyya, fournissant des comptes rendus détaillés de la vie, des enseignements et des expériences spirituelles de Shaykh Tijani. Il sert de référence principale pour comprendre le développement précoce de la Tariqa.',
        arabicText: 'يبقى جوهر المعاني من أهم الأعمال في التقليد التجاني، حيث يقدم روايات مفصلة عن حياة وتعاليم وتجارب شيخ التجاني الروحية. إنه يخدم كمرجع أساسي لفهم التطور المبكر للطريقة.',
        hausaText: 'Jawahir al-Ma\'ani ya kasance ɗaya daga cikin muhimman ayyuka a al\'adar Tijaniyya, yana ba da cikakkun labarai game da rayuwa, koyarwa da kuma abubuwan ruhaniya na Shaykh Tijani. Yana aiki a matsayin babban tushe don fahimtar ci gaban farko na Tariqa.'
      },
      { 
        heading: 'Spiritual Lineage', 
        text: 'As the greatest inheritor of Shaykh Ahmad Tijani, Sidi Ali Harazim established a spiritual lineage that continues to influence the Tijaniyya order. His role as the primary transmitter of Shaykh Tijani\'s teachings ensures his lasting importance in the tradition.',
        frenchText: 'En tant que plus grand héritier de Shaykh Ahmad Tijani, Sidi Ali Harazim a établi une lignée spirituelle qui continue d\'influencer l\'ordre Tijaniyya. Son rôle de transmetteur principal des enseignements de Shaykh Tijani assure son importance durable dans la tradition.',
        arabicText: 'بصفته أعظم وارث لشيخ أحمد التجاني، أسس سيدي علي حرازم سلالة روحية تستمر في التأثير على الطريقة التجانية. دوره كحامل أساسي لتعاليم شيخ التجاني يضمن أهميته الدائمة في التقليد.',
        hausaText: 'A matsayin babban magajin Shaykh Ahmad Tijani, Sidi Ali Harazim ya kafa zuriyar ruhaniya wacce ta ci gaba da yin tasiri a kan ƙungiyar Tijaniyya. Rawar sa na farko na watsa koyarwar Shaykh Tijani yana tabbatar da muhimmancinsa na dindindin a al\'ada.'
      },
      { 
        heading: 'Legacy & Continuing Influence', 
        text: 'As the greatest inheritor of Shaykh Ahmad Tijani and the author of the Jawahir al-Ma\'ani, Sidi Ali Harazim\'s influence continues to be felt throughout the Tijaniyya order. His spiritual authority and scholarly contributions remain central to the understanding of the Tariqa and its foundational principles.',
        frenchText: 'En tant que plus grand héritier de Shaykh Ahmad Tijani et auteur du Jawahir al-Ma\'ani, l\'influence de Sidi Ali Harazim continue d\'être ressentie dans tout l\'ordre Tijaniyya. Son autorité spirituelle et ses contributions savantes restent centrales pour la compréhension de la Tariqa et de ses principes fondamentaux.',
        arabicText: 'بصفته أعظم وارث لشيخ أحمد التجاني ومؤلف جوهر المعاني، يستمر تأثير سيدي علي حرازم في الشعور به في جميع أنحاء الطريقة التجانية. سلطته الروحية ومساهماته العلمية تبقى مركزية لفهم الطريقة ومبادئها الأساسية.',
        hausaText: 'A matsayin babban magajin Shaykh Ahmad Tijani kuma marubucin Jawahir al-Ma\'ani, tasirin Sidi Ali Harazim ya ci gaba da kasancewa a duk faɗin ƙungiyar Tijaniyya. Ikon sa na ruhaniya da gudummawar sa na ilimi sun kasance tsakiyar fahimtar Tariqa da ka\'idojinta na asali.'
      }
    ],
  },
  // 3. Sidi Ali Tamasini
  {
    id: 'ali_tamasini',
    name: 'Al-Qutb Sidi Al-Hajj Ali Ibn \'Isa Tamasini (R.A)',
    title: 'Khalifa of Shaykh Ahmad Tijani & Qutb',
    bio: 'Sidi Ali Tamasin (1766-1844) was the designated successor (khalifa) of Shaykh Ahmad Tijani (RA), and he became known as the world\'s highest spiritual authority (qutb) following the passing of Shaykh Tijani. He was from the eastern Algerian oasis of Tamasin.',
    frenchBio: 'Sidi Ali Tamasin (1766-1844) était le successeur désigné (khalifa) de Shaykh Ahmad Tijani (RA), et il devint connu comme la plus haute autorité spirituelle mondiale (qutb) après le décès de Shaykh Tijani. Il était de l\'oasis algérienne orientale de Tamasin.',
    arabicBio: 'كان سيدي علي تاماسين (1766-1844) الخليفة المعهود لشيخ أحمد التجاني (رضي الله عنه)، وأصبح معروفاً بأعلى سلطة روحية في العالم (قطب) بعد وفاة شيخ التجاني. كان من واحة تاماسين الشرقية الجزائرية.',
    hausaBio: 'Sidi Ali Tamasin (1766-1844) shi ne magajin da aka zaɓa (khalifa) na Shaykh Ahmad Tijani (RA), kuma ya zama sananne da babban hukuma na ruhaniya a duniya (qutb) bayan mutuwar Shaykh Tijani. Ya kasance daga cikin oas na gabashin Algeria na Tamasin.',
    specialties: ['Tariqa Tijaniyya', 'Qutbaniyya', 'Spiritual Training', 'Karamat', 'Healing', 'Visionary Encounters'],
    details: [
      { 
        heading: 'Birth & Succession', 
        text: 'Sidi Ali Tamasin (1766-1844), may Allah be pleased with him, was the designated successor (khalifa) of Shaykh Ahmad Tijani (RA), and he became known as the world\'s highest spiritual authority (qutb) following the passing of Shaykh Tijani. He was from the eastern Algerian oasis of Tamasin, where his zawiya is still a center of Tijani notables.',
        frenchText: 'Sidi Ali Tamasin (1766-1844), qu\'Allah soit satisfait de lui, était le successeur désigné (khalifa) de Shaykh Ahmad Tijani (RA), et il devint connu comme la plus haute autorité spirituelle mondiale (qutb) après le décès de Shaykh Tijani. Il était de l\'oasis algérienne orientale de Tamasin, où sa zawiya reste encore un centre de notables Tijanis.',
        arabicText: 'كان سيدي علي تاماسين (1766-1844)، رضي الله عنه، الخليفة المعهود لشيخ أحمد التجاني (رضي الله عنه)، وأصبح معروفاً بأعلى سلطة روحية في العالم (قطب) بعد وفاة شيخ التجاني. كان من واحة تاماسين الشرقية الجزائرية، حيث لا تزال زاويته مركزاً لشخصيات تجانية بارزة.',
        hausaText: 'Sidi Ali Tamasin (1766-1844), Allah ya yarda da shi, shi ne magajin da aka zaɓa (khalifa) na Shaykh Ahmad Tijani (RA), kuma ya zama sananne da babban hukuma na ruhaniya a duniya (qutb) bayan mutuwar Shaykh Tijani. Ya kasance daga cikin oas na gabashin Algeria na Tamasin, inda zawiyarsa har yanzu ke zama cibiyar fitattun mutanen Tijani.'
      },
      { 
        heading: 'Investiture by Shaykh Tijani', 
        text: 'Shaykh Ahmad Tijani invested him with the imama in the grand zawiya in Fes in the presence of many other notable scholars and saints. Once when asked by another disciple to be given permission for a certain prayer mastered by Ali Tamasin, Shaykh Tijani replied, "Is there another like Ali Tamasin?"',
        frenchText: 'Shaykh Ahmad Tijani l\'a investi de l\'imama dans la grande zawiya de Fes en présence de nombreux autres savants et saints notables. Une fois, lorsqu\'un autre disciple lui a demandé d\'obtenir la permission pour une certaine prière maîtrisée par Ali Tamasin, Shaykh Tijani a répondu : "Y a-t-il un autre comme Ali Tamasin ?"',
        arabicText: 'استثمره شيخ أحمد التجاني بالإمامة في الزاوية الكبرى في فاس بحضور العديد من العلماء والقديسين البارزين الآخرين. مرة واحدة عندما طلب منه تلميذ آخر أن يُعطى إذناً لصلاة معينة أتقنها علي تاماسين، أجاب شيخ التجاني: "هل هناك آخر مثل علي تاماسين؟"',
        hausaText: 'Shaykh Ahmad Tijani ya ba shi imama a babban zawiya a Fes a gaban yawancin sauran malamai da waliyyai masu daraja. Sau ɗaya lokacin da wani almajiri ya tambaye shi ya ba shi izini don wani salla da Ali Tamasin ya ƙware, Shaykh Tijani ya amsa: "Akwai wani kamar Ali Tamasin?"'
      },
      { 
        heading: 'Karamat & Miracles', 
        text: 'He was renowned for the karamat (saintly miracles) flowing from his hands. He was a gifted healer and knew certain secrets to travel great distances with one step or to send objects to others. For the open demonstration of these latter two abilities, he was reprimanded by Shaykh Tijani.',
        frenchText: 'Il était renommé pour les karamat (miracles saints) qui coulaient de ses mains. Il était un guérisseur doué et connaissait certains secrets pour voyager sur de grandes distances en un pas ou pour envoyer des objets à d\'autres. Pour la démonstration ouverte de ces deux dernières capacités, il fut réprimandé par Shaykh Tijani.',
        arabicText: 'كان مشهوراً بالكرامات (المعجزات القدسية) التي تتدفق من يديه. كان شفاءً موهوباً وعرف أسراراً معينة للسفر لمسافات كبيرة بخطوة واحدة أو لإرسال أشياء للآخرين. بسبب إظهار هاتين القدرتين الأخيرتين علناً، تم توبيخه من قبل شيخ التجاني.',
        hausaText: 'Ya kasance sananne da karamat (mu\'ujizai na waliyyi) waɗanda ke fitowa daga hannayensa. Ya kasance mai warkarwa mai baiwa kuma ya san wasu sirri don tafiya nesa mai nisa da mataki ɗaya ko aika abubuwa ga wasu. Saboda nuna waɗannan iyawa biyu na ƙarshe a fili, Shaykh Tijani ya tsawata masa.'
      },
      { 
        heading: 'Shaykh Tijani\'s Guidance', 
        text: 'Shaykh Tijani told him, "If you want to visit me for the sake of Allah, you should come like the common folk: with sandals, on a horse, feeling fatigue, thirst and trepidation." Shaykh Tijani likewise told him to stop sending dates from his farm by tossing them up in the air to appear hundreds of miles away on Shaykh Tijani\'s prayer mat.',
        frenchText: 'Shaykh Tijani lui dit : "Si tu veux me rendre visite pour l\'amour d\'Allah, tu devrais venir comme les gens ordinaires : avec des sandales, sur un cheval, ressentant la fatigue, la soif et l\'appréhension." Shaykh Tijani lui dit également d\'arrêter d\'envoyer des dattes de sa ferme en les lançant en l\'air pour qu\'elles apparaissent à des centaines de kilomètres sur le tapis de prière de Shaykh Tijani.',
        arabicText: 'قال له شيخ التجاني: "إذا كنت تريد زيارتي من أجل الله، يجب أن تأتي مثل عامة الناس: بنعال، على حصان، تشعر بالتعب والعطش والقلق." وقال له شيخ التجاني أيضاً أن يتوقف عن إرسال التمر من مزرعته برميه في الهواء ليظهر على بعد مئات الأميال على سجادة صلاة شيخ التجاني.',
        hausaText: 'Shaykh Tijani ya ce masa: "Idan kana son ziyarce ni saboda Allah, ya kamata ka zo kamar talakawa: da takalmi, a kan doki, kana jin gajiya, ƙishirwa da tsoro." Shaykh Tijani ya kuma ce masa ya daina aika dabino daga gonarsa ta hanyar jefa su sama don su bayyana nesa da mil ɗari a kan kafetar salla na Shaykh Tijani.'
      },
      { 
        heading: 'Visionary Encounters with Prophet', 
        text: 'He was also gifted with frequent visionary encounters with the Prophet Muhammad. According to Ahmad Sukayrij, "Once, when he overheard some people discussing the vision of the Prophet, he said, \'There are some people present with you in this time who do not do anything, small or large, without obtaining permission from the Prophet by way of face-to-face encounter as seen by the eyes.\'"',
        frenchText: 'Il était également doué de rencontres visionnaires fréquentes avec le Prophète Muhammad. Selon Ahmad Sukayrij : "Une fois, quand il entendit des gens discuter de la vision du Prophète, il dit : \'Il y a des gens présents avec vous en ce temps qui ne font rien, petit ou grand, sans obtenir la permission du Prophète par une rencontre face à face comme vue par les yeux.\'"',
        arabicText: 'كان أيضاً موهوباً بلقاءات رؤيوية متكررة مع النبي محمد. وفقاً لأحمد السكايرج: "مرة واحدة، عندما سمع بعض الناس يناقشون رؤية النبي، قال: \'هناك بعض الناس حاضرون معكم في هذا الوقت لا يفعلون شيئاً، صغيراً أو كبيراً، دون الحصول على إذن من النبي من خلال لقاء وجهاً لوجه كما يُرى بالعينين.\'"',
        hausaText: 'Ya kuma kasance mai baiwa da saduwar hangen nesa akai-akai da Annabi Muhammad. A cewar Ahmad Sukayrij: "Sau ɗaya, lokacin da ya ji wasu mutane suna tattaunawa game da hangen nesa na Annabi, ya ce: \'Akwai wasu mutane da ke tare da ku a wannan lokaci waɗanda ba sa yin komai, ƙanana ko manya, ba tare da samun izini daga Annabi ta hanyar saduwar fuska da fuska kamar yadda idanu suke gani ba.\'"'
      },
      { 
        heading: 'Overwhelming Love for Shaykh Tijani', 
        text: 'He had an overwhelming love for Shaykh Ahmad Tijani that preceded his own ancestors. According to Sukayrij, "He did not trace his ancestry to anyone except Shaykh Ahmad Tijani, may Allah be pleased with him." When asked about his lineage, he said, "Surely, I am Ali, the son of Ahmad al-Tijani, may Allah be pleased with him."',
        frenchText: 'Il avait un amour écrasant pour Shaykh Ahmad Tijani qui précédait ses propres ancêtres. Selon Sukayrij : "Il ne retraçait son ascendance à personne d\'autre qu\'à Shaykh Ahmad Tijani, qu\'Allah soit satisfait de lui." Quand on lui demanda de sa lignée, il dit : "Certes, je suis Ali, le fils d\'Ahmad al-Tijani, qu\'Allah soit satisfait de lui."',
        arabicText: 'كان لديه حب ساحق لشيخ أحمد التجاني يسبق أسلافه. وفقاً للسكايرج: "لم يتبع نسبه لأحد إلا شيخ أحمد التجاني، رضي الله عنه." عندما سُئل عن نسبه، قال: "بالتأكيد، أنا علي، ابن أحمد التجاني، رضي الله عنه."',
        hausaText: 'Yana da ƙauna mai ƙarfi ga Shaykh Ahmad Tijani wacce ta gabaci kakanninsa. A cewar Sukayrij: "Bai bi zuriyarsa ga kowa ba sai Shaykh Ahmad Tijani, Allah ya yarda da shi." Lokacin da aka tambaye shi game da zuriyarsa, ya ce: "Tabbas, ni ne Ali, ɗan Ahmad al-Tijani, Allah ya yarda da shi."'
      },
      { heading: 'Station of Polehood', text: 'It is widely reported that Ali Tamasin attained the station of polehood after the passing of Shaykh Tijani. He thus became a primary propagator of the Tariqa Tijaniyya and responsible for the spiritual training of initiates.' },
      { heading: 'Spiritual Training & Ecstatic Flood', text: 'Ahmad Sukayrij writes, "After the passing of the Shaykh, may Allah be pleased with him, the indications of the grand illumination appeared on Ali Tamasin, and he undertook the spiritual training (tarbiya) in the Tariqa. An ecstatic flood (fayadan wijdani) appeared on him such that his like was not found among the perfected shaykhs."' },
      { heading: 'Global Recognition', text: 'People came to him from the farthest horizons to take (the Tariqa) from him and get blessing from him. His spiritual authority was recognized throughout the Islamic world.' },
      { heading: 'Early Piety & Scholarship', text: 'Sidi Ali Tamasin was known from an early age for his piety and scholarship, and was first trained by his father, al-Hajj Isa, himself renowned for his virtuosity and learning.' },
      { heading: 'Successful Entrepreneur', text: 'Sidi Ali was also a successful entrepreneur, and became a wealthy date farmer in the desert of Algeria, showing his practical approach to life alongside his spiritual pursuits.' },
      { heading: 'First Meeting with Shaykh Tijani', text: 'He first met Shaykh Tijani in 1790 before the Shaykh\'s establishment in Fes and some years after the founding of the Tijaniyya. Shaykh Tijani quickly recognized Sidi Ali\'s spiritual aptitude.' },
      { heading: 'Founding of Tamasin Zawiya', text: 'Shaykh Tijani ordered him to found his own Tijani zawiya in Tamasin in 1803. Such was his trust in Sidi Ali that Shaykh Tijani entrusted his own sons to Sidi Ali\'s care upon his passing.' },
      { heading: 'Care for Shaykh Tijani\'s Children', text: 'Shaykh Tijani asked him to install his sons in Ain Madi in all comfort, saying, "Only the Sahara will do for my children." This shows the deep trust and responsibility placed upon Sidi Ali.' },
      { heading: 'Practical Approach to Leadership', text: 'Charged with the formidable task of succeeding to the leadership of the Tariqa, he took a practical approach relying on scholarship, physical work and spiritual purification. He is reported as saying, "I recommend to you the writing board, the hoe and rosary until the soul should leave the body."' },
      { heading: 'Visits from Scholars', text: 'In Tamasin, he received visits from Shaykh Ibrahim Riyahi of Tunis and other scholars from Mauritania and Sudan, demonstrating his recognition as a leading authority in the Tariqa.' },
      { heading: 'Correspondence & Instruction', text: 'He was also in frequent correspondence with Sidi al-\'Arabi ibn Sa\'ih, and personally instructed Sidi Ahmad Abdalawi, showing his role in training other important figures in the Tariqa.' },
      { heading: 'Current Leadership', text: 'The Tamasin zawiya is currently led by Sidi Ali\'s descendent, Sidi Muhammad al-\'Id, ensuring the continuity of his spiritual legacy.' },
      { heading: 'Legacy & Continuing Influence', text: 'As the designated successor of Shaykh Ahmad Tijani and the Qutb who succeeded him, Sidi Ali Tamasin\'s influence continues to be felt throughout the Tijaniyya order, with his zawiya in Tamasin remaining a center of spiritual guidance and learning.' }
    ],
  },
  // 4. Sidi Muhammad Ghali
  {
    id: 'muhammad_ghali',
    name: 'Sidi Muhammad Al-Ghali (R.A)',
    title: 'Khalifa of Shaykh Ahmad Tijani & Teacher of Al-Hajj Umar',
    bio: 'Sidi Muhammad al-Ghali was a prominent student of Shaykh Ahmad Tijani and played a crucial role in the early spread of the Tariqa Tijaniyya. He was the teacher who gave Al-Hajj Umar al-Futi Tal his khalifa status and ijaza.',
    frenchBio: 'Sidi Muhammad al-Ghali était un étudiant éminent de Shaykh Ahmad Tijani et a joué un rôle crucial dans la propagation précoce de la Tariqa Tijaniyya. Il était l\'enseignant qui a donné à Al-Hajj Umar al-Futi Tal son statut de khalifa et son ijaza.',
    arabicBio: 'كان سيدي محمد الغالي طالباً بارزاً لشيخ أحمد التجاني ولعب دوراً حاسماً في الانتشار المبكر للطريقة التجانية. كان المعلم الذي منح الحاج عمر الفوتي تال منصبه كخليفة وإجازته.',
    hausaBio: 'Sidi Muhammad al-Ghali ya kasance ɗalibi mai daraja na Shaykh Ahmad Tijani kuma ya taka muhimmiyar rawa a farkon yaduwar Tariqa Tijaniyya. Shi ne malamin da ya ba Al-Hajj Umar al-Futi Tal matsayinsa na khalifa da ijaza.',
    specialties: ['Tariqa Tijaniyya', 'Khalifa', 'Spiritual Training', 'West Africa', 'Ijaza'],
    details: [
      { 
        heading: 'Relationship with Shaykh Tijani', 
        text: 'Sidi Muhammad al-Ghali was one of the prominent students of Shaykh Ahmad Tijani in Fes. He received direct instruction and authorization from the Shaykh himself, making him a key figure in the early Tariqa Tijaniyya.',
        frenchText: 'Sidi Muhammad al-Ghali était l\'un des étudiants éminents de Shaykh Ahmad Tijani à Fes. Il a reçu une instruction directe et une autorisation du Shaykh lui-même, ce qui en fait une figure clé dans la Tariqa Tijaniyya primitive.',
        arabicText: 'كان سيدي محمد الغالي من الطلاب البارزين لشيخ أحمد التجاني في فاس. تلقى تعليماً مباشراً وإذناً من الشيخ نفسه، مما جعله شخصية رئيسية في الطريقة التجانية المبكرة.',
        hausaText: 'Sidi Muhammad al-Ghali ya kasance ɗaya daga cikin fitattun ɗaliban Shaykh Ahmad Tijani a Fes. Ya karɓi koyarwa kai tsaye da izini daga Shaykh da kansa, wanda ya sa ya zama babban jigo a farkon Tariqa Tijaniyya.'
      },
      { 
        heading: 'Role in West Africa', 
        text: 'He played a crucial role in the spread of the Tariqa Tijaniyya to West Africa, particularly through his relationship with Al-Hajj Umar al-Futi Tal, whom he trained and authorized as a khalifa.',
        frenchText: 'Il a joué un rôle crucial dans la propagation de la Tariqa Tijaniyya en Afrique de l\'Ouest, en particulier par sa relation avec Al-Hajj Umar al-Futi Tal, qu\'il a formé et autorisé comme khalifa.',
        arabicText: 'لعب دوراً حاسماً في انتشار الطريقة التجانية في غرب أفريقيا، خاصة من خلال علاقته مع الحاج عمر الفوتي تال، الذي دربه وأذن له كخليفة.',
        hausaText: 'Ya taka muhimmiyar rawa a yaduwar Tariqa Tijaniyya a Yammacin Afirka, musamman ta hanyar dangantakarsa da Al-Hajj Umar al-Futi Tal, wanda ya horar da shi kuma ya ba shi izini a matsayin khalifa.'
      },
      { heading: 'Meeting with Al-Hajj Umar', text: 'When Al-Hajj Umar arrived in Mecca in 1827, he became acquainted with Sidi Muhammad al-Ghali, who was a prominent student of Shaykh Ahmad Tijani. This meeting would prove pivotal for the spread of the Tariqa in West Africa.' },
      { heading: 'Vision of Shaykh Tijani', text: 'Following a vision of Shaykh Ahmad Tijani in the Prophet\'s mosque in Medina, where Shaykh Tijani told al-Ghali, "I have given Shaykh Umar ibn Sa\'id all that he needs in this Tariqa in the way of litanies and secrets," al-Ghali gave Al-Hajj Umar full investiture in the Tariqa.' },
      { heading: 'Authorization of Al-Hajj Umar', text: 'Sidi al-Ghali gave Hajj Umar the status of khalifa in the Tariqa, making him a representative of the Shaykh without restriction. This authorization was crucial for the establishment of the Tariqa Tijaniyya in West Africa.' },
      { heading: 'Mission to West Africa', text: 'Before Al-Hajj Umar left in 1830, al-Ghali confirmed his status as khalifa for West Africa and told him to "clean the lands of the stench of paganism." This directive would shape Al-Hajj Umar\'s mission in West Africa.' },
      { heading: 'Spiritual Authority', text: 'As a direct student of Shaykh Ahmad Tijani, Sidi Muhammad al-Ghali held significant spiritual authority within the early Tariqa Tijaniyya. His authorization of Al-Hajj Umar demonstrates his role as a key transmitter of the Tariqa.' },
      { heading: 'Legacy in West Africa', text: 'Through his authorization of Al-Hajj Umar, Sidi Muhammad al-Ghali indirectly influenced the entire development of the Tariqa Tijaniyya in West Africa, as Al-Hajj Umar became one of the most important figures in spreading the Tariqa throughout the region.' },
      { heading: 'Connection to Hijaz', text: 'His presence in the Hijaz and his role in authorizing Al-Hajj Umar shows the international reach of the early Tariqa Tijaniyya and the importance of the Hijaz as a center for Tijani authorization.' },
      { heading: 'Continuing Influence', text: 'Sidi Muhammad al-Ghali\'s influence continues to be felt through the many West African Tijani communities that trace their spiritual lineage back to Al-Hajj Umar, who received his authorization from al-Ghali.' }
    ],
  },
  // 5. Ibrahim Riyahi
  {
    id: 'ibrahim_riyahi',
    name: 'Shaykh Al-Islam Ibrahim Al-Riyahi (R.A)',
    title: 'Imam of Zaytuna University & Introducer of Tariqa Tijaniyya in Tunisia',
    bio: 'Shaykh Ibrahim al-Riyahi (1766-1850) was the Imam of Zaytuna University in Tunis and the Maliki Shaykh al-Islam of Tunisia. He was the first to introduce the Tariqa Tijaniyya in Tunisia and played a crucial role in its spread throughout North Africa.',
    frenchBio: 'Shaykh Ibrahim al-Riyahi (1766-1850) était l\'Imam de l\'Université Zaytuna à Tunis et le Shaykh al-Islam Maliki de Tunisie. Il fut le premier à introduire la Tariqa Tijaniyya en Tunisie et joua un rôle crucial dans sa propagation à travers l\'Afrique du Nord.',
    arabicBio: 'كان شيخ الإسلام إبراهيم الرياحي (1766-1850) إمام جامعة الزيتونة في تونس وشيخ الإسلام المالكي لتونس. كان أول من أدخل الطريقة التجانية في تونس ولعب دوراً حاسماً في انتشارها في جميع أنحاء شمال أفريقيا.',
    hausaBio: 'Shaykh Ibrahim al-Riyahi (1766-1850) ya kasance Imam na Jami\'ar Zaytuna a Tunis da Shaykh al-Islam Maliki na Tunisia. Shi ne na farko da ya gabatar da Tariqa Tijaniyya a Tunisia kuma ya taka muhimmiyar rawa a yaduwarta a Arewacin Afirka.',
    specialties: ['Tariqa Tijaniyya', 'Maliki Fiqh', 'Zaytuna University', 'Tunisia', 'Islamic Law', 'Scholarship'],
    details: [
      { 
        heading: 'Birth & Early Life', 
        text: 'Shaykh Ibrahim al-Riyahi was born in 1180 AH (1766 CE) in Tunis, Tunisia. He came from a family of scholars and was raised in an environment of Islamic learning and piety.',
        frenchText: 'Shaykh Ibrahim al-Riyahi est né en 1180 AH (1766 CE) à Tunis, en Tunisie. Il venait d\'une famille de savants et a été élevé dans un environnement d\'apprentissage islamique et de piété.',
        arabicText: 'ولد شيخ إبراهيم الرياحي في 1180 هـ (1766 م) في تونس، تونس. جاء من عائلة من العلماء وتربى في بيئة من التعلم الإسلامي والتقوى.',
        hausaText: 'An haifi Shaykh Ibrahim al-Riyahi a 1180 AH (1766 CE) a Tunis, Tunisia. Ya fito daga dangin malamai kuma an rene shi a cikin yanayin ilimin Musulunci da taqawa.'
      },
      { 
        heading: 'Education at Zaytuna', 
        text: 'He received his education at the prestigious Zaytuna University in Tunis, where he studied under the leading scholars of his time. He excelled in various Islamic sciences, particularly in Maliki jurisprudence and hadith.',
        frenchText: 'Il a reçu son éducation à la prestigieuse Université Zaytuna de Tunis, où il a étudié sous les savants de premier plan de son époque. Il a excellé dans diverses sciences islamiques, en particulier dans la jurisprudence malikite et le hadith.',
        arabicText: 'تلقى تعليمه في جامعة الزيتونة المرموقة في تونس، حيث درس تحت إشراف كبار العلماء في عصره. تفوق في مختلف العلوم الإسلامية، خاصة في الفقه المالكي والحديث.',
        hausaText: 'Ya karɓi iliminsa a Jami\'ar Zaytuna mai daraja a Tunis, inda ya yi karatu a ƙarƙashin fitattun malamai na zamaninsa. Ya yi fice a fannoni daban-daban na ilimin Musulunci, musamman a fannin shari\'ar Maliki da hadisi.'
      },
      { heading: 'Appointment as Imam', text: 'Due to his exceptional knowledge and piety, he was appointed as the Imam of Zaytuna University, one of the most prestigious positions in the Islamic world. This appointment reflected his standing as a leading Islamic scholar.' },
      { heading: 'Maliki Shaykh al-Islam', text: 'He was also recognized as the Maliki Shaykh al-Islam of Tunisia, making him the highest religious authority in the Maliki school of jurisprudence in the country. This position gave him significant influence in religious and legal matters.' },
      { heading: 'Introduction to Tariqa Tijaniyya', text: 'Shaykh Ibrahim al-Riyahi was the first to introduce the Tariqa Tijaniyya in Tunisia. His acceptance and promotion of the Tariqa played a crucial role in its establishment and growth in North Africa.' },
      { heading: 'Meeting with Sidi Ali Harazim', text: 'He hosted Sidi Ali Harazim for several months in Tunis during the latter\'s journey to Mecca. This meeting had a profound impact on Shaykh Ibrahim and influenced his eventual embrace of the Tariqa Tijaniyya.' },
      { heading: 'Visit to Shaykh Tijani', text: 'Inspired by his meeting with Sidi Ali Harazim, Shaykh Ibrahim later visited Shaykh Ahmad Tijani in Fes. This visit solidified his commitment to the Tariqa and his role in spreading it in Tunisia.' },
      { heading: 'Scholarly Contributions', text: 'As a leading scholar, Shaykh Ibrahim wrote extensively on Islamic jurisprudence and other Islamic sciences. His works contributed to the scholarly tradition of North Africa and the Maliki school of law.' },
      { heading: 'Teaching & Students', text: 'He taught numerous students at Zaytuna University, many of whom went on to become prominent scholars themselves. His teaching methods and scholarly approach influenced generations of Islamic scholars in Tunisia and beyond.' },
      { heading: 'Recognition by Shaykh Ibrahim Niasse', text: 'Shaykh Ibrahim Niasse (d. 1975) said about him: "Were Shaykh Ahmad al-Tijani to have no other follower but Abu Ishaq Ibrahim al-Riyahi, it would suffice us as proof to also follow him." This shows the high regard in which he was held by later Tijani scholars.' },
      { heading: 'Death & Legacy', text: 'Shaykh Ibrahim al-Riyahi died shortly after his son, from the same cholera epidemic. The last of the many favors that he received from God was that he was destined to leave the world on the night of Ramadan 27th, 1266 (August 6th, 1850).' },
      { heading: 'Continuing Influence', text: 'As the Imam of Zaytuna University, Maliki Shaykh al-Islam of Tunis, and the man who introduced the Tariqa Tijaniyya in Tunisia, Shaykh Ibrahim al-Riyahi\'s influence continues to be felt in both the scholarly and spiritual traditions of North Africa.' }
    ],
  },
  // 6. Muhammad Hafiz Shinqiti
  {
    id: 'muhammad_al_hafiz_shinqiti',
    name: 'Sidi Muhammad Al-Hafiz Al-Shinqiti (R.A)',
    title: 'First Introducer of Tariqa Tijaniyya in Mauritania',
    bio: 'Muhammad al-Hafiz b. al-Mukhtar b. al-Habib (1759-1830) is credited with first introducing the Tariqa Tijaniyya in Mauritania, whereby it was introduced into sub-Saharan West Africa. He became the preeminent instructor (muqaddam) of the Tijaniyya in Mauritania after spending years with Shaykh Ahmad Tijani in Fes.',
    frenchBio: 'Muhammad al-Hafiz b. al-Mukhtar b. al-Habib (1759-1830) est crédité d\'avoir introduit pour la première fois la Tariqa Tijaniyya en Mauritanie, par laquelle elle fut introduite en Afrique de l\'Ouest subsaharienne. Il devint l\'instructeur prééminent (muqaddam) de la Tijaniyya en Mauritanie après avoir passé des années avec Shaykh Ahmad Tijani à Fes.',
    arabicBio: 'يُنسب إلى محمد الحافظ بن المختار بن الحبيب (1759-1830) أنه أول من أدخل الطريقة التجانية في موريتانيا، ومن خلالها تم إدخالها إلى أفريقيا الغربية جنوب الصحراء. أصبح المعلم البارز (مقدم) للتجانية في موريتانيا بعد قضاء سنوات مع شيخ أحمد التجاني في فاس.',
    hausaBio: 'Muhammad al-Hafiz b. al-Mukhtar b. al-Habib (1759-1830) ana ba shi laifi da farkon gabatar da Tariqa Tijaniyya a Mauritania, ta hanyar da aka gabatar da ita a Yammacin Afirka na kudu da Sahara. Ya zama babban malamin (muqaddam) na Tijaniyya a Mauritania bayan ya shafe shekaru da Shaykh Ahmad Tijani a Fes.',
    specialties: ['Tariqa Tijaniyya', 'Mauritania', 'West Africa', 'Hadith', 'Fiqh', 'Sufism', 'Idaw Ali'],
    details: [
      { 
        heading: 'Birth & Lineage', 
        text: 'Muhammad al-Hafiz b. al-Mukhtar b. al-Habib (1759-1830) hailed from the noble Idaw \'Ali people in Mauritania, who trace descent from Muhammad Ibn Hanafiyya, a son of Ali b. Abi Talib. This noble lineage connected him to the Ahl al-Bayt (family of the Prophet).',
        frenchText: 'Muhammad al-Hafiz b. al-Mukhtar b. al-Habib (1759-1830) était originaire du noble peuple Idaw \'Ali en Mauritanie, qui descend de Muhammad Ibn Hanafiyya, fils d\'Ali b. Abi Talib. Cette noble lignée l\'a connecté à l\'Ahl al-Bayt (famille du Prophète).',
        arabicText: 'ينحدر محمد الحافظ بن المختار بن الحبيب (1759-1830) من شعب إداو علي النبيل في موريتانيا، الذي ينحدر من محمد بن الحنفية، ابن علي بن أبي طالب. هذه النسب النبيلة ربطته بأهل البيت (عائلة النبي).',
        hausaText: 'Muhammad al-Hafiz b. al-Mukhtar b. al-Habib (1759-1830) ya fito daga mutanen Idaw \'Ali masu daraja a Mauritania, waɗanda suka samo asali daga Muhammad Ibn Hanafiyya, ɗan Ali b. Abi Talib. Wannan zuriyar mai daraja ta haɗa shi da Ahl al-Bayt (dangin Annabi).'
      },
      { 
        heading: 'Family Background', 
        text: 'His father, Mukhtar b. Habib (d. 1806) was also an Islamic scholar, and particularly distinguished for his mastery of the art of calligraphy. His grandfather on his mother\'s side, Muhammad al-Alawi, was the chief judge (qadi) among the important Trarza region of Mauritania in the mid-1700s.',
        frenchText: 'Son père, Mukhtar b. Habib (d. 1806) était également un érudit islamique, particulièrement distingué pour sa maîtrise de l\'art de la calligraphie. Son grand-père maternel, Muhammad al-Alawi, était le juge en chef (qadi) dans la région importante de Trarza en Mauritanie au milieu des années 1700.',
        arabicText: 'كان والده، المختار بن حبيب (ت. 1806) أيضاً عالماً إسلامياً، وتميز بشكل خاص في إتقانه لفن الخط. كان جده من ناحية والدته، محمد العلوي، القاضي الرئيسي في منطقة ترارزة المهمة في موريتانيا في منتصف القرن الثامن عشر.',
        hausaText: 'Mahaifinsa, Mukhtar b. Habib (d. 1806) shi ma malami ne na Musulunci, kuma ya yi fice musamman a fannin fasahar rubutu. Kakansa na bangaren mahaifiyarsa, Muhammad al-Alawi, shi ne babban alkali (qadi) a yankin Trarza mai muhimmanci na Mauritania a tsakiyar shekarun 1700.'
      },
      { heading: 'Scholarly Family', text: 'Sidi al-Hafiz was not the only scholar among his siblings, and two brothers, Muhammad Sa\'id and Muhammad al-Amin were also famous scholars. The same was true of his brother-in-law, Muhamdi b. Abd Allah al-Alawi, known as "Baddi," who authored the most complete biography of Sidi al-Hafiz, called Nuzhat al-Mustam\' wa-l-lafiz fi manaqib al-shaykh Muhammad al-Hafiz (1832).' },
      { heading: 'Early Education', text: 'Shaykh Muhammad al-Hafiz began his Islamic education with the Qur\'an, and memorized the entire Holy Book by the age of seven. This early mastery of the Qur\'an laid the foundation for his later scholarly achievements.' },
      { heading: 'Studies with Grandmother', text: 'Following the death of his grandfather, he continued his studies in jurisprudence (fiqh) with his grandmother – herself a learned scholar who taught him the Alfiyya of Ibn Malik, the Risala of Ibn Abi Zayd and the Mukhtasar of Sidi Khalil. This demonstrates the high level of Islamic education among women in his family.' },
      { heading: 'Studies with Abd Allah b. Ahmaddan', text: 'After the death of his grandmother, he traveled to study grammar (nahw) among other sciences with the learned Faqih, Abd Allah b. Ahmaddan (d. 1815). Sidi Ahmaddan was also a shaykh of the Shadhiliyya Nasiriyya, but there is no evidence that Sidi al-Hafiz took the Shadhili wird at this time.' },
      { heading: 'Advanced Studies', text: 'He next studied the Qur\'anic sciences, logic (mantiq) and theology (\'aqida) with Hurma b. Abd al-Jalil (d. 1827) and then completed his study of jurisprudence (fiqh) with Abd Allah b. Ahmad b. Mahham b. al-Qadi (d. 1826).' },
      { heading: 'Studies with Abd Allah b. al-Hajj Ibrahim', text: 'Continuing in the tradition of a traveling student in search of sacred knowledge, he next went to study with Abd Allah b. al-Hajj Ibrahim (d. 1818), a celebrated scholar in Mauritania who had studied in Fes and who had become a friend of the Moroccan Sultan, Mawlay Muhammad b. Abd Allah.' },
      { heading: 'Six Years of Intensive Study', text: 'Sidi al-Hafiz spent six years with Sidi Abd Allah, studying Prophetic traditions (hadith), legal principles (usul al-fiqh) and rhetoric (ilm al-bayan). He also married his teacher\'s daughter, further strengthening the bond between teacher and student.' },
      { heading: 'Respect for Teachers', text: 'The companions of Shaykh Tijani in Fes remarked that even after his submission to Shaykh Tijani, Sidi al-Hafiz maintained the utmost respect for his previous teachers; and for Sidi Abd Allah in particular. This demonstrates his character and adherence to Islamic etiquette.' },
      { heading: 'Journey to Fes', text: 'Indeed, it was following Sidi Abd Allah\'s example that Sidi al-Hafiz embarked on his journey seeking knowledge in Fes. But there was also a more immediate reason for his journey to Fes.' },
      { heading: 'Supplication During Hajj', text: 'Sidi al-Hafiz had made persistent supplication while performing Hajj to be united with a perfected spiritual master. As he was circumambulating the Holy House in Mecca, an unknown man approached him to tell him that Shaykh Ahmad Tijani was to be his spiritual master.' },
      { heading: 'Meeting Shaykh Ahmad Tijani', text: 'After learning the identity of this mysterious Shaykh from a group of Moroccan pilgrims, Sidi al-Hafiz traveled to Fes to meet him. He spent four years with Shaykh Tijani in Fes, from 1800-1804/5. The ijaza he received, still preserved among his descendents in Mauritania, was dictated by Shaykh Tijani and written in the hand of Muhammad b. Mishry, the close companion of Shaykh Tijani and author of Kitab al-Jami\'.' },
      { heading: 'Shaykh Tijani\'s Advice', text: 'Before leaving to return home, Shaykh Tijani advised him, "Do not seek to appear (before the people) until Allah makes you appear." This advice reflects the principle of spiritual humility and divine timing in the Sufi tradition.' },
      { heading: 'Discrete Practice', text: 'For the first year after his return, Sidi al-Hafiz thus practiced the Tariqa with great discretion as he taught the Islamic sciences, neither informing others of the Tariqa nor of his appointment as propagator (muqaddam).' },
      { heading: 'Divine Sign', text: 'Then he received a surprise visit from an ascetic famous for his visionary encounters with Khidr, the mystical instructor of Moses as mentioned in the Qur\'an. The ascetic told him to give him the wird he was hiding. With this sign, Sidi al-Hafiz began to speak openly of the Tariqa Tijaniyya.' },
      { heading: 'Teaching & Scholarship', text: 'His teachings attracted a great many students and, besides his credentials as a Sufi shaykh, he was particularly renowned as a distinguished scholar of hadith, possessing a highly desirable chain (isnad) of transmission through Salih al-Fulani in Medina.' },
      { heading: 'Literary Works', text: 'He wrote a commentary on the Alfiyya discussing the rules of hadith transmission. He was also known for his teaching of jurisprudence and grammar. His instruction in tasawwuf emphasized the Kitab al-Hikam of Ibn \'Ata Allah in addition to Tijani sources.' },
      { heading: 'Tolerance & Respect', text: 'Sidi al-Hafiz discouraged conflict between Sufi orders and advised his disciples not to disrespect the followers of other Sufi paths, saying "Do not ask him who follows another Sufi order to abandon his litany and do not seek to dampen his enthusiasm for it. Tell him instead that all the litanies (awrad) are paths that lead to Allah."' },
      { heading: 'Innovation in Sufi Practice', text: 'Following the advice of Shaykh Tijani, Sidi al-Hafiz\'s own Sufi instruction differed from existing Sufi practice in Mauritania by its absence of khalwa and a de-emphasis of talismanic sciences. This represented a new approach to Sufi practice in the region.' },
      { heading: 'Idaw Ali Propagation', text: 'Through Muhammad al-Hafiz the Idaw \'Ali quickly became the principle propagators of the Tijaniyya in West Africa. The "Hafiziyya" tradition was marked by many great scholars after the passing of Sidi al-Hafiz.' },
      { heading: 'Hafiziyya Legacy', text: 'The book of Ubayda ibn Muhammad al-Saghir al-Tashit, Mizab al-Rahma al-Rabbaniyya fi al-Tarbiya bi al-Tariqa al-Tijaniyya (1851), is considered a masterful synthesis of the Tijani legacy left by Muhammad al-Hafiz. It describes the essence of the Tariqa as gratitude (shukr) to Allah and details a methodology of spiritual training (tarbiya) through the three stages of Islam (submission), Iman (faith) and Ihsan (spiritual excellence).' },
      { heading: 'Mawlud Fal', text: 'The most famous disciple of Muhammad al-Hafiz was Mawlud Fal, who is credited with the expansion of al-Hafiz\'s teachings outside of the Idaw \'Ali. Mawlud Fal was from the Id-Ayqub, a people of Mauritania famous for their expertise in jurisprudence.' },
      { heading: 'Mawlud Fal\'s Journey', text: 'He became a close disciple of Shaykh al-Hafiz and eventually married his sister. He left for Fes in 1815 hoping to meet Shaykh Tijani in person, but arrived just after his passing. The Tijani notables of Fes nonetheless renewed his ijaza originally given him by al-Hafiz.' },
      { heading: 'Mawlud Fal\'s Studies in Fes', text: 'He studied closely with the son of Ali Harazim, who instructed him in the practice of khalwa and other supererogatory litanies not transmitted to him by Muhammad al-Hafiz. After his study in Fes, Mawlud Fal traveled widely throughout West Africa.' },
      { heading: 'Expansion Through Mawlud Fal', text: 'During his travels, Mawlud Fal appointed many teachers who themselves helped spread the Tariqa all over Africa. Thus \'Abd al-Karim b. Ahmad al-Naqil (the first shaykh of al-Hajj Umar Futi) became one of his important muqaddams in Futa Jallon; Mudibu Ahmad Raji received an ijaza from Mawlud Fal to spread the Tariqa in Northern Nigeria; and Wad Dulayb spread the Tariqa in the Sudan under the silsilah of Mawluf Fal.' },
      { heading: 'Support for Al-Hajj Umar\'s Jihad', text: 'The "Hafiziyya" branch of the Tijaniyya also played an important role in securing support for the Jihad of al-Hajj Umar among the Moroccan Tijani scholars. Al-Hajj Umar kept in close contact with the Hafiziyya zawiya in Mauritania even after his training with Muhammad al-Ghali.' },
      { heading: 'Connection to Sokoto', text: 'Once, when the Sokoto Sultan Muhammad Bello requested permission from him for the prayer hizb al-bahr and the book Jawahir al-Khams, al-Hajj Umar responded that he himself could not give such permission, but that he would request it from the Hafiziyya zawiya in Mauritania. To this end, al-Hajj Umar sent his elder brother Alfa Ahmad, who had his own ijaza renewed by the Hafiziyya zawiya.' },
      { heading: 'Twentieth Century Influence', text: 'Even in the twentieth century, the Hafiziyya tradition played a large role in shaping the careers of Tijani scholars. One of al-Hajj Malik Sy\'s most important initiations into the Tariqa was through the son of Mawlud Fal, known as al-Shaykh.' },
      { heading: 'Connection to Shaykh Ibrahim Niasse', text: 'Shaykh Ibrahim Niasse\'s most significant early ijaza besides that from his father was from al-Hajj Abdullahi Wuld al-Hajj, a renowned representative of the Hafiziyya tradition who had been seeking the spiritual flood (fayda) of Shaykh Ahmad Tijani for many years before recognizing it in the person of Shaykh Ibrahim Niasse.' },
      { heading: 'Legacy & Continuing Influence', text: 'As the first introducer of the Tariqa Tijaniyya in Mauritania and the founder of the Hafiziyya tradition, Sidi Muhammad al-Hafiz al-Shinqiti\'s influence continues to be felt throughout West Africa. His scholarly excellence, spiritual depth, and commitment to spreading the Tariqa established a foundation that has endured for centuries.' }
    ],
  },
  // 7. Umar Futi
  {
    id: 'umar_al_futi_tal',
    name: 'Shaykh Al-Hajj Umar Al-Futi Tal (R.A)',
    title: 'Khalifa of Tariqa Tijaniyya & Jihad Leader',
    bio: 'Shaykh al-Hajj Umar b. Sa\'id al-Futi al-Turi (1796-1864), perhaps the most famous of all Tijani figures in the nineteenth century. An accomplished scholar, author and social activist who combined spiritual jihad with military jihad to establish a Muslim empire of justice and peace in West Africa.',
    specialties: ['Tariqa Tijaniyya', 'Jihad', 'Islamic Law', 'Sufism', 'Political Leadership', 'Scholarship'],
    image: require('../../assets/Umar.jpg'),
    details: [
      { heading: 'Birth & Lineage', text: 'Al-Hajj Umar was born in Helwar, Futa Toro, in present-day northern Senegal. He hailed from the noble Fulani, a people who had become renowned for their Islamic scholarship throughout West Africa by the seventeenth century. His father Cerno Saidu (Arabic, Sa\'id) studied at the famous Islamic university of Pir Sanikhor in Senegal.' },
      { heading: 'Father\'s Character', text: 'Saidu lived the life of a simple farmer, devoting himself to studies and worship rather than participate in the Fulani jihad of Abd al-Qadir Kane in 1776. Al-Hajj Umar had great respect for his father, who taught all sorts of sciences to his disciples, farmed while reciting the Qur\'an, and had many saintly sons.' },
      { heading: 'Mother\'s Piety', text: 'Soxna Adama Aise, the mother of al-Hajj Umar, likewise had a great reputation for piety. She was a niece of the famous Qadiri scholar and jihadist Sulayman Bal. A touching story relates that during a torrential downpour at Umar\'s birth, while everybody else became soaking wet, Soxna Adama and her son remained dry.' },
      { heading: 'Early Education', text: 'Al-Hajj Umar was a precocious student of the Islamic sciences, memorizing the Qur\'an with his father at a young age. He was next trained to be a Qur\'an school master by his elder brother Alfa Ahmadu, until he began traveling in search of knowledge.' },
      { heading: 'Love for the Prophet', text: 'From an early age, he developed a keen interest in books and poetry detailing the life and character of the Prophet Muhammad. He would later say: "Allah, from His bounty, endowed me with the love for His Prophet. I was confounded with love for him, a love permeating my interior and exterior."' },
      { heading: 'Teachers in Futa Toro', text: 'Umar studied under many of the renowned teachers in Futa Toro of his day, such as Cerno Lamin Saxo, Amar Saydi, Yero Buso and Horefonde. He excelled in the study of jurisprudence (fiqh), and even after his establishment as a Sufi shaykh, scholars used to visit him in Dingiray to discuss points of jurisprudence.' },
      { heading: 'Pir Sanikhor', text: 'His studies in Futa inevitably led him to the famous school of Pir Sanikhor, where his teacher, Serin Demba Fal, observed in him exceptional scholastic ability. His first stay outside of Futa in search of knowledge was in the Mauritanian town of Tagant.' },
      { heading: 'Tijani Initiation', text: 'During a second visit to Mauritania, or perhaps during a visit to Futa Jallon (present-day Guinea), Umar was initiated into the Tariqa Tijaniyya by Abd al-Karim al-Naqil, a student of Mawlud Fal. The two became close companions, and traveled together to Futa Jallon where Umar spent years learning from him.' },
      { heading: 'Journey to Mecca', text: 'Soon after the death of Abd al-Karim, Umar set off with his family to accomplish the pilgrimage to Mecca. He arrived in 1827 and soon became acquainted with the prominent student of Shaykh Ahmad Tijani, Sidi Muhammad al-Ghali.' },
      { heading: 'Meeting with Sidi al-Ghali', text: 'Al-Hajj Umar became Sidi al-Ghali\'s closest disciple, and al-Ghali gave him full investiture in the Tariqa following a vision of Shaykh Ahmad Tijani in the Prophet\'s mosque in Medina, where Shaykh Tijani told al-Ghali, "I have given Shaykh Umar ibn Sa\'id all that he needs in this Tariqa in the way of litanies and secrets."' },
      { heading: 'Khalifa Status', text: 'Sidi al-Ghali thus gave Hajj Umar the status of khalifa in the Tariqa. Where Hajj Umar describes the degree of the muqaddam as someone commissioned to "teach the obligatory remembrances," he describes the position of khalifa as "a representative of the Shaykh without restriction."' },
      { heading: 'Mission from Sidi al-Ghali', text: 'Before leaving the company of Sidi al-Ghali in 1830, al-Ghali confirmed his status as khalifa for West Africa and told him to "clean the lands of the stench of paganism." While in the Middle East, al-Hajj Umar also visited Jerusalem, Syria and Egypt.' },
      { heading: 'Middle East Travels', text: 'It is said he led the prayer in the Dome of the Rock (Jerusalem), cured the son of a sultan from madness in Syria, and astonished scholars in Cairo by his vast erudition. His reputation for piety and learning were recognized throughout the region.' },
      { heading: 'Return via Sokoto', text: 'Al-Hajj Umar returned from the Middle East by way of Sokoto (which he had also visited on the way to the Hijaz), arriving in 1831-2. He was accorded a grand reception by Sultan Muhammad Bello, the son of Shehu Usman dan Fodio.' },
      { heading: 'Friendship with Sultan Bello', text: 'There is no evidence that Sultan Bello actually took the Tariqa Tijaniyya, but it is undeniable the two were the best of friends. Bello gave Shaykh Umar his daughter Maryam in marriage, and Umar accompanied Bello on various military campaigns.' },
      { heading: 'Sultan Bello\'s Dream', text: 'In his Rimah, Shaykh Umar recorded a significant dream Sultan Bello had on the 14th of Rabi al-Awal in 1251 A.H. In the dream, Shaykh al-Tijani came to their land with Umar as his lieutenant. Bello expressed his love for the Shaykh and asked for assurance of meeting him in Paradise.' },
      { heading: 'Settlement in Futa Jallon', text: 'After traveling widely throughout West Africa, Shaykh Umar settled in Futa Jallon, eventually founding the town of Dingiray. In Futa Jallon, Shaykh Umar spent ten years teaching his growing numbers of disciples, especially renowned for his teaching of jurisprudence, hadith and Sufism.' },
      { heading: 'The Jihad', text: 'Resenting his growing influence, the non-Muslim leaders in the area attacked his settlement in 1851. Nearly a year later, Shaykh Umar received official permission for the jihad from the Prophet Muhammad and Shaykh Ahmad Tijani in a visionary encounter.' },
      { heading: 'Military Campaigns', text: 'The jihad was first exclusively directed against the non-Muslim Bambara, whom al-Hajj Umar accused of grave injustices, enslaving Muslims and threatening the practice of Islam. When he conquered the Bambara city of Segu in 1861, he found evidence of an alliance against him.' },
      { heading: 'Conflict with Masina', text: 'His resultant jihad against Masina, whose capital Hamdullahi he captured in 1864, touched off a virulent polemic between the supporters of al-Hajj Umar and the supporters of Masina, the latter which included the scholars of Timbuktu.' },
      { heading: 'French Conflict', text: 'By 1854, Shaykh Umar\'s mobilization of Futa Toro led to direct conflict with advancing French commercial and military hegemony. Besieged on two fronts, Shaykh Umar died in battle in 1864 near Hamdulillahi.' },
      { heading: 'The Rimah', text: 'His magnum opus, the Kitab rimah hizb al-rahim \'ala nuhur hizb al-rajim ("The book of the lances of the league of (Allah) the Merciful against the necks of the league of (Satan) the accursed"), is considered a "veritable compendium" and one of the most important works of the nineteenth century anywhere in the Muslim world.' },
      { heading: 'Political Legacy', text: 'The "Umarian" state al-Hajj Umar had forged by 1860, although short-lived, was one of the largest ever seen in West Africa. His empire was held together by his son Ahmad until being dismantled by the French some twenty years after the Shaykh\'s death.' },
      { heading: 'Scholarly Legacy', text: 'His scholarly legacy has far outlasted any temporary political role he endured. His descendent Seydou Nourou Tall became a key Muslim and Tijani figure in twentieth century West Africa. Later Tijani scholars such as Al-Hajj Abdoulaye Niasse and al-Hajj Malik Sy had important initiations through students of al-Hajj Umar.' },
      { heading: 'Continuing Influence', text: 'Shaykh Umar\'s book, the Rimah, remains one of the mostly widely read books of the Tijaniyya order. His legacy of resistance to French colonial conquest has inspired West Africans from all walks of life to the present time.' }
    ],
  },
  // 8. Muhammad Arabi ibn Sa'ih
  {
    id: 'sidi_muhammad_al_arabi',
    name: 'Shaykh Sīdi Muhammad al-Arabī bin al-Sā\'ih (R.A)',
    title: 'Renowned Tijāni Saint & Scholar of Hadīth',
    bio: 'Sayyidina al-Shaykh al-\'Arif bi-Llah Abū-Hāmid Muhammad al-Arabī bin Muhammad al-Sā\'ih al-Sharqī al-Umarī was born in Meknes, Morocco, in 1229 (1814). A renowned nineteenth-century Moroccan scholar of Hadīth, Maliki Fiqh, Tasawwuf and Arabic poetry, and one of the greatest Tijāni Saints of his time.',
    specialties: ['Tariqa Tijaniyya', 'Hadith', 'Maliki Fiqh', 'Tasawwuf', 'Arabic Poetry', 'Sufism'],
    image: require('../../assets/shaykh_sidi.jpg'),
    details: [
      { heading: 'Birth & Lineage', text: 'Sayyidina al-Shaykh al-\'Arif bi-Llah Abū-Hāmid Muhammad al-Arabī bin Muhammad al-Sā\'ih al-Sharqī al-Umarī was born in the ancient city of Meknes, Morocco, in 1229 (1814), to a family who were direct descendants of Sayyidinā Umar al-Fārūq ibn al-Khattāb, may Allah be pleased with him.' },
      { heading: 'Scholarly Excellence', text: 'He was a renowned nineteenth-century Moroccan scholar of Hadīth, Maliki Fiqh, Tasawwuf and Arabic poetry. His teachers included men like al-Faqih al-Muhaddith Sidi Abd-al-Qādir al-Kawhan, al-\'Allāmah Muhammad al-Hādi Bādu, Shaykh al-Sharīf Walīd al-Irāqi and other savants.' },
      { heading: 'Ijāzahs & Scholarly Exchange', text: 'He also exchanged Ijāzahs with many famous North African scholars, demonstrating his deep knowledge and recognition among the scholarly community of his time.' },
      { heading: 'Tijāni Initiation', text: 'Moreover, al-Wali al-Sālih, Sīdī al-Arabī bin al-Sā\'ih was one of the greatest Tijāni Saints of his time. He took the Tijāni Tarīqah from accomplished spiritual masters such as Sīdī Abd-al-Wahhāb al-Ahmar and Mawlay Muhammad bin Abu\'n-Nasr al-Alawi of Fez, and the Qutb Sīdī Ali al-Tamāsīni of Algeria.' },
      { heading: 'Spiritual Masters', text: 'All of his spiritual masters were venerated Muqaddams of the Muhammadan Saint Shaykh Ahmad al-Tijāni (R.A.), showing the authenticity and high level of his spiritual lineage.' },
      { heading: 'Spiritual Guidance', text: 'Renowned as a friend of Allāh, countless seekers approached him to take the Way. Among these were men who later on became great spiritual masters themselves, demonstrating his ability to guide others to spiritual excellence.' },
      { heading: 'Zāwiyah in Rabat', text: 'Sīdi al-Arabi also established a beautiful Tijāni Zāwiyah in Rabat that became a well-known center of Islamic knowledge and spirituality and remains so till today. It is also from these few Zāwiyahs which have preserved the traditional Moroccan Fāsi style of reciting the blessed Qasīdat al-Burdah.' },
      { heading: 'Bughyat al-Mustafīd', text: 'His greatest service to the Tarīqah was authoring the masterpiece called Bughyat al-Mustafīd which became one of the major source-books of Tijāni Sufism. The work was a detailed commentary on the Sufi Poem called Munyat al-Murīd, written by the Mauritanian Tijāni master, Shaykh Ahmad Tijāni bin Sīdī Bāba al-Alawi al-Shinqītī.' },
      { heading: 'Mastery of Sciences', text: 'Due to his mastery of the sciences of Sharī\'ah and Haqīqah, as well as deep understanding of the Tijani Path, Sīdī al-Arabi\'s works became essential reference works for later Tijānis.' },
      { heading: 'Ibn Arabi Studies', text: 'Sīdī al-Arabī also mastered the works of al-Shaykh al-Akbar Muhyi\'ddīn Ibn-Arabi and quotes from them extensively in his own works, showing his deep understanding of advanced Sufi concepts.' },
      { heading: 'Bughyat al-Mustafīd Excellence', text: 'The Bughyat al-Mustafīd is a brilliant exposition of Tasawwuf and has gone through numerous prints, the best one being the 2002 edition by the Dar al-Kutub al-Ilmiyyah of Beirut.' },
      { heading: 'Explanation of Awrād', text: 'Explaining the Wirds (litanies) that disciples of the Sufi Orders recite after gaining permission from their Shaykhs, he writes: "The reality of the Awrād is that they are contracts and commitments that Allāh has taken from His servants through the Shaykhs."' },
      { heading: 'Contract with Allah', text: 'He emphasizes that "he who has honored the Shaykhs and stayed true to his contract and fulfilled his commitments will gain the goodness of both Worlds," quoting from the Qur\'an: "O Ye who Believe! Fulfill your contracts" (Surat al-Maidah: 1).' },
      { heading: 'Khātam al-Wilāyah', text: 'Explaining the Maqām (spiritual rank) of Khātam al-Wilāyah al-Muhammadiyyah (Seal of Muhammadan Sainthood), which Tijanis attribute to Shaykh Sīdi Ahmad al-Tijāni, he writes: "The meaning of his being the Khātam is that none will appear in that rank in the (complete) way that he appeared."' },
      { heading: 'Seal of Complete Manifestation', text: 'He clarifies that Shaykh Ahmad al-Tijāni is "the Seal of the complete manifestation of that rank, and not (the seal of) the rank itself," showing his deep understanding of the spiritual hierarchy.' },
      { heading: 'Biographical Works', text: 'Quite a few scholars authored separate works on Sīdi\'s al-Arabi\'s life and intellectual and spiritual achievements, such as the Moroccan historian Shaykh al-Faqīh Muhammad al-Hajūjī who authored al-Azhār al-Atirat al-Rawā\'ih fī al-Ta\'rīf bī Mawlāna al-\'Arabī bin al-Sā\'ih.' },
      { heading: 'Contemporary Research', text: 'The contemporary Moroccan Tijāni research scholar Dr. al-Sharīf Muhammad al-Rādi Gannoun al-Hasanī al-Idrīsī authored al-Misk al-Fa\'ih bi-Dhikr ba\'d Manāqib Sīdī al-\'Arabī bin al-Sā\'ih, and Shaykh al-Arabī bin Abd-Allāh al-Wazzānī also wrote about him.' },
      { heading: 'Professor Abdelaziz Benabdallah', text: 'One of the foremost representatives of Sidi al-\'Arabi b. Sa\'ih\'s legacy in contemporary Morocco is the distinguished Professor Abdelaziz Benabdallah, who has authored a comprehensive work concerning Ibn Sa\'ih and the Bughyat al-Mustafid.' },
      { heading: 'Academic Recognition', text: 'The biography of Ibn Sa\'ih can also be found in Al-A\'lām by al-Zarakli, Al-Ightibāt bi-Tarājim A\'lām al-Rabāt by al-Bojandār, and A\'lām al-Fikr al-Mu\'āsir bi\'l-Udwatayn by Abd-Allāh al-Jarrāri.' },
      { heading: 'Poetic Tribute', text: 'His trusted friend, the saintly scholar and poet, Sīdi Muhammd Balamīnu al-Rabāti wrote about him: "I traveled the lands of the East and the West (in vain) To find the likeness of the Imam al-\'Arabi bin al-Sā\'ih The Star of Guidance, the Pole of (spiritual) height, Our Teacher The succor of every inanimate and animate object."' },
      { heading: 'Passing & Legacy', text: 'Sīdī al-\'Arabī bin al-Sā\'ih passed away in 1309 (1892) in Rabāt, where he used to live, and where his blessed Tomb and Zāwiyah remain. May Allah sanctify his Secret. Amīn.' },
      { heading: 'Continuing Influence', text: 'His works, particularly the Bughyat al-Mustafīd, continue to be studied and referenced by Tijāni scholars and students of Tasawwuf worldwide, ensuring his legacy endures in the Islamic scholarly tradition.' }
    ],
  },
  // 12. Sheikh Ibrahim Niasse
  {
    id: 'ibrahim_niasse',
    name: 'Shaykh Ibrahim Niasse (R.A)',
    title: 'Shaykh al-Islam & Khalifa of Tariqa Tijaniyya',
    bio: 'Born in Tayba, Senegal. Renowned scholar, spiritual guide, and global Islamic leader who spread Tariqa Tijaniyya across Africa and the Muslim world.',
    specialties: ['Tariqa Tijaniyya', 'Islamic Law', 'Hadith', 'Sufism', 'Da\'wah', 'Arabic Literature'],
    image: require('../../assets/Shaykh Ibrahim.jpg'),
    details: [
      { heading: 'Birth & Early Life', text: 'Shaykh Ibrahim Niasse (RA—may Allah have mercy on him and be pleased with him) was born on Thursday, Rajab 15, 1320 AH (October 1902), in Tayba, which is a small village near Kaolack in Senegal. He grew up in the care of his father, the great scholar and warrior al-Hajj Abdullahi b. Muhammad b. Mademba.' },
      { heading: 'Education & Knowledge', text: 'He recited the Qur\'an with his father until he had memorized it fluently in the recitation of Warsh, and then went on to learn different sacred sciences. His high aspiration and consistent, wholehearted engagement in seeking knowledge propelled him to become deeply versed in all branches of the sacred sciences, manifest and hidden. His father was his only teacher.' },
      { heading: 'Early Recognition', text: 'His superiority became clear while he was still young. As a youth, he gained distinction in his knowledge of commentary on the Qur\'an and all its related sciences, as well as in hadith sciences, jurisprudence, the foundations of jurisprudence (Usul al-Fiqh), linguistic sciences, and Sufism. He became an authority in all of these sciences, and before he reached the age of 30 he was giving benefit to many.' },
      { heading: 'Global Influence', text: 'People from all kinds of countries, Arab and non-Arab, came to him to drink from his knowledge. Scholars came before the generality of Muslims bending their knees in his presence, drinking from the pearls of his knowledge, yearning for knowledge of the spiritual greats and of how to discipline and purify the self. For them, he was an ocean without shore, a fountain of sweet water that never tires, a locus of comprehension that made great ones seem small in comparison.' },
      { heading: 'Medina Baye', text: 'Shaykh Ibrahim (RA) busied himself with guiding, teaching, and refining humanity, and the village he founded, Medina Baye—located just outside of Kaolack—became a lighthouse of knowledge and rectification.' },
      { heading: 'Global Travels', text: 'Shaykh Ibrahim\'s (RA) call did not stop here; he toured Africa, the Muslim lands, and many other countries, promoting the religion of Allah, calling to Islam with beautiful words, and spreading his knowledge amongst the masses, debating with scholars in order to give and receive benefit.' },
      { heading: 'Visited Centers of Knowledge', text: 'He visited different centers of knowledge and of Islam, including Mauritania, Morocco, Tunisia, Al-Azhar in Egypt, the Hijaz in Saudi Arabia, Pakistan, India, and China, and he belonged to several global organizations dedicated to the promotion of Islam.' },
      { heading: 'Global Organizations', text: 'He was the vice president and later president of the World Muslim Congress in Karachi, a founding member of the Muslim World League, a founding president of the African Union\'s Organization of Preachers of Islam, a founding member of the Federation of the Universities of the Islamic World in Rabat, a member of the Supreme Council for Islamic Affairs in Cairo, a member of the Islamic Research Academy in Cairo, and a member of the Higher Islamic Council in Algeria, as well as serving in other organizations.' },
      { heading: 'Goals of Calling to Allah', text: 'In an interview he gave with the Saudi newspaper "Al-Bilad Daily" in the 1970s, Shaykh Ibrahim (RA) articulated the aims of his global efforts: calling non-Muslims to enter into the religion of Allah and leave polytheism and other false religious practices; striving to raise the consciousness of Muslims, advise them, guide them, and increase their faith; enlisting all possible energies in propagating the language of the Qur\'an; calling for deepening the feeling of Islamic fraternity; connecting one\'s preaching with global Islamic movements and organizations; counteracting forces that aim to corrupt Muslims, such as Christian evangelical movements and hidden Zionism.' },
      { heading: 'Elevated Status in Muslim World', text: 'Shaykh Ibrahim (RA) was known as a person of his knowledge throughout the Muslim world. He was honored and distinguished in all kinds of Muslim countries, and visited almost all of them, as well as Muslim communities in other countries. He met with the Muslim scholars of his time, and had mutually beneficial relationships with them.' },
      { heading: 'Saudi Arabia & Al-Azhar', text: 'One of the countries he visited the most was Saudi Arabia, where he made the pilgrimage to Allah\'s Sacred House dozens of times. He also visited Cairo ten times. He had strong connections to the heads of Al-Azhar University, such as Shaykh Mahmoud Shaltut and Shaykh Dr. Abd al-Halim Mahmud, both former presidents of Al-Azhar. The scholars of Al-Azhar honored him by giving him the title "Shaykh al-Islam." It\'s said that Shaykh Shaltut was the one who gave him this title.' },
      { heading: 'Historic Jumu\'ah Prayer', text: 'They honored him another time by requesting him to lead the Jumu\'ah prayer in Al-Azhar, in the month of Safar, 1381 AH (July 21, 1961), and he was the first black African to have this honor. After the prayer, Shaykh Muhammad al-Ghazali commented on Shaykh Ibrahim\'s khutbah by saying, "We rest assured regarding the future of the Muslim world as long as there are the likes of our eminent guest Shaykh al-Islam Shaykh Ibrahim amongst the Muslims."' },
      { heading: 'First West African at Al-Azhar', text: 'Niasse was the first West African to have led al-Azhar Mosque in Egypt, after which he was titled "Sheikh al-Islam". He became close to many freedom fighters in West Africa due to his contribution for Independence in African States. He was friends with and an adviser to Ghana\'s first President, Kwame Nkrumah, and friends with Gamal Abdel Nasser and King Faisal of Saudi Arabia. Sheikh served as the Vice President of the Muslim World League with Faisal as president.' },
      { heading: 'Literary Works', text: 'His prolific body of work includes numerous anthologies of poems, commentaries, and theological treatises such as Ruh al-Adab, Kashif al-ilbas, Sabil al-salam, Al-Kanz al-Masun, and Al-Ifriqiyyal il-Ifriqiyyin, Ad-Dawawin as-sitta, Tabsiratul Anam, Jawahir Rasail, kanzul Arifina, and many others.' }
    ],
  },
  // 9. Ahmad Sukayrij
  {
    id: 'sukayrij',
    name: 'Shaykh Ahmad al-Ayyashi Sukayrij (R.A)',
    title: 'Renowned Scholar & Qadi of Morocco',
    bio: 'Born in Fes, educated at Qarawiyin University. Prolific author, government jurist, and consummate gnostic of the Tijaniyya.',
    specialties: ['Islamic Law', 'Tariqa Tijaniyya', 'Hadith', 'Sufism'],
    image: require('../../assets/Shaykh Ahmad.jpg'),
    details: [
      { heading: 'Biography', text: 'Shaykh Ahmad al-Ayyashi Sukayrij (1878-1944) was born in Fes and educated in the Islamic sciences at the prestigious Qarawiyin University. He was a prolific author and a renowned scholar throughout North Africa. His expertise in Islamic law earned him numerous government appointments.' },
      { heading: 'Birth & Passing', text: 'Born: 1878, Fes, Morocco. Passed: 1944, Marrakech, Morocco (aged 66). Buried in the Mausoleum of Qadi `Iyad ibn Musa in Marrakech, fulfilling a dream he had before his passing.' },
      { heading: 'Government Appointments', text: 'Supervisor of waqf (inalienable trusts) property in Fes (1914-1919), Chief Jurist (Qadi) of Wajda (1919-1924), Qadi of al-Jadida (1924-1929), and Qadi of Settat (1929-1944). His broad scholarly expertise earned him recognition as "the most knowledgeable person of our time" by Egyptian Hadith scholar Shaykh Muhammad al-Hafiz al-Misri.' },
      { heading: 'Spiritual Journey', text: 'A consummate gnostic who studied under illustrious Tijaniyya scholars of the 19th century, including Ahmad Abdalawi and Abdul-Karim Bannis (author of Durrat al-Taj). Known for his sobriety in Sufi practice, disapproving of excessive emotional displays during dhikr. Emphasized humility and orthodoxy of Tijaniyya scholars in his defense of the order.' },
      { heading: 'Notable Students', text: 'Among his students was Mawlay `Abdul Hafiz, Sultan of Morocco (1908-1912). The Sultan, previously an enemy of Tijaniyya who cooperated with Salafiyya movements against Sufi orders, became a chief advocate after taking the Tijani wird from Shaykh Sukayrij. He later wrote "al-Jami\'a al-\'irfaniyya al-wafiya" praising the Tijaniyya and its scholars.' },
      { heading: 'Literary Works', text: 'Authored approximately 160 works on all aspects of Islamic knowledge, including: 20,000-line Nazm version of al-Suyuti\'s Khasa\'is al-Kubra, 500-line Nazm version of Qadi Iyad\'s Shifa, commentary on the Burdah, the renowned "Kashf al-Hijab amman Talaqa ma`a al-Shaykh al-Tijani min al-Ashab" (1907), and "al-Kawkab al-Wahhaj li tawdih al-minhaj" (1910).' },
      { heading: 'Ijazas & Transmission', text: 'Possessed more than 600 ijazas (diplomas) in various Islamic sciences, transcribed in "Qadam al-Rusukh fima li-Mu\'allifihi min al-Shuyukh." The first person to whom he gave authorization in all chains of transmission was Khalifa al-Hajj Ibrahim Niyass, whom he called "the \'Alim (scholar) of Black Africa (al-Sudan)."' },
      { heading: 'Connection to Shaykh Ibrahim Niasse', text: 'Shaykh Ibrahim Niasse addressed him as "Our greatest love, the esteemed shaykh, the most famous scholar, the full moon in efflorescent radiance, the proof of this [Tijani] path." Although Shaykh Ibrahim had numerous ijazahs in Tijaniyya, he always used the one given by Shaykh Sukayrij during their 1937 meeting in Morocco. The silsilah through Sukayrij was the shortest to Shaykh Ahmad Tijani of any 20th century scholar.' },
      { heading: 'Personal Saintliness', text: 'His personal saintliness attained wide renown. When questioned about accepting judgeships for government stipends, he lifted his pillow and shook it, causing money to fall to the floor, then simply said that God provided his needs and he worked only for the sake of Islam.' }
    ],
  },
  {
    id: 'maikano',
    name: 'Sheikh Alhaji Abdullahi Ahmad Maikano (R.A)',
    title: 'Tijaniyya Scholar & Caller to Allah',
    bio: 'Known as Baba Jalloo; devoted to Salah, Azkar, Istighfar, Quran, Durood, and calling to Allah across Ghana and beyond.',
    specialties: ['Tariqa Tijaniyya', 'Da7wah', 'Quran & Dhikr'],
    image: require('../../assets/Sheikh Abdullah.jpg'),
    details: [
      { heading: 'Biography', text: 'Sheikh Alhaji Abdullahi Ahmad Maikano (Baba Jalloo) (R.A) is a true and faithful scholar whose interest lay in prayers (obligatory and supererogatory), remembrance of Allah (Azkar), repentance (Istighfar), habitual recitation of the Holy Quran, sending abundant Durood upon the Prophet (S.A.W), and scholarly research.' },
      { heading: 'Birth & Passing', text: 'Born: 16 July 1926, Aborso, Ghana. Passed: 12 September 2005, Aborso, Ghana (aged 77). Renowned in Ghana, West Africa, and beyond for bravery and dedication to Islam; devoted his life to service of Allah—preaching and calling to the path of Allah (SWT).' },
      { heading: 'Family', text: 'Father: Sheikh Ahmad Badawi (R.A). Mother: Sayyada Zainab. Grandparents: Sheikh Abdul Mumin (R.A) and Sayyada Amamatu (Naana Maulla). Only child of his mother; one of eight children of his father. A sincere family man with four wives and many children, including: Sheikh Ahmad Abdul Faide (Khalifa), Sheikh Muhammad Nasurullah, Sheikh Aliu Kalaamullah, Sheikh Ibrahim Niasse, Sheikh Ahmad Tijani, Sheikh Ridwaanullah, Sheikh Muhammad Amaanullah, Sayyada Naamau, Sayyada Ayaa, Sayyada Maryam, Sayyada Hikimatullah, Sayyada Najat, Sayyada Rukayya, Sayyada Nadratu and others.' },
      { heading: 'Spreading Tijaniyya (from 1946)', text: 'He spread the wings of Tariqa Tijaniyya long before visiting Maulana Sheikh Ibrahim Niasse (R.A) in Kaolack, accepting and believing in him even before the widespread recognition of Sheikhul Islam in Africa.' },
      { heading: 'Sacrifices for Tijaniyya', text: 'He suffered greatly for the establishment and spread of Tijaniyya in various localities. Across Africa and the world, Tijani communities record his contributions directly or via his students (e.g., Nasrul Faida in Germany). Major Ghanaian cities such as Kumasi, Tamale, and Yendi bear witness to his sacrifices.' },
      { heading: 'First Visit to Kaolack (1948)', text: 'Inspired by the book  27Kashiful Bars 27 of Sheikhul Islam, obtained from Sheikh Muhammad Hadi via his father, he resolved to visit the author. Sponsored by Alhaji Abdul Mumin and Alhaji Abubakar. The famed  27Big Nine 27 entourage: (1) Sheikh Abdullahi Ahmad Maikano (Prang), (2) Imam Muhammad Chiroma (Kumasi), (3) Sheikh Haruna (Kumasi), (4) Mallam Muhammad Maysona (Salaga), (5) Mallam Yusif Laa (Kumasi), (6) Imam Gariba Hakim (Kumasi), (7) Mallam Rabi’u (Kumasi), (8) Mallam Baba Waziri (Kumasi), (9) Mallam Awudun-Kaaka (Kumasi). Upon return, they testified to Ghanaian Muslims that Sheikh Ibrahim Niasse (R.A) was truly the Khalifa of Sheikh Ahmad Tijani (R.A).' }
    ],
  },
  {
    id: 'muhammad_al_hafiz',
    name: 'Shaykh Muhammad Al-Hafiz Al-Misri (R.A)',
    title: 'Imam al-Muhaddithin & Friend of Allah',
    bio: 'One of the greatest scholars of Prophetic traditions (hadith) of Egypt in the twentieth century, as well as a renowned Friend of Allah and spiritual master of Tariqa Tijaniyya.',
    specialties: ['Hadith', 'Tariqa Tijaniyya', 'Tafsir', 'Sufism', 'Islamic History', 'Manuscript Verification'],
    image: require('../../assets/SHAYKH MUHAMMAD AL-HAFIZ.jpg'),
    details: [
      { heading: 'Birth & Lineage', text: 'Al-Sayyid Muhammad al-Hafiz bin `Abdul Latif bin Salim was born in the district of Munufiyya in Egypt in the year 1315 (c. 1897) to a family connected to the noble Ahlul Bayt (household of the Prophet).' },
      { heading: 'Early Education', text: 'After studying the religious sciences in Cairo, Shaykh al-Hafiz traveled abroad to Syria, Tunisia, Sudan, Algeria and Morocco in the pursuit of sacred knowledge. During these blessed journeys, he gained precious diplomas (ijazahs) from some of the greatest scholars of the time from the East and the West of the Islamic world.' },
      { heading: 'Distinguished Teachers', text: 'He received ijazahs from Shaykh Badruddin al-Hasani of Syria, Sharif `Abdul Hayy al-Kattani and Sidi Ahmad Sukayrij of Morocco, Shaykh Alfa Hashim of Medina and Shaykh `Abdul Baqi al-Ansari of Mecca.' },
      { heading: 'Teaching Career', text: 'After his period of learning, Sayyidina Muhammad al-Hafiz totally dedicated himself to the teaching of Hadith. He taught the entire multi-volume Sahih al-Bukhari more than 40 times in Egypt, and many other books of Hadith as well. It is said that he used to know them by heart.' },
      { heading: 'Memory & Scholarship', text: 'It is narrated that when he went to Fez, Morocco, to visit the blessed tomb of Shaykh Ahmad Tijani, he was asked by the shaykhs in Fez to teach them Imam al-Nawawi\'s famous "Forty Hadith" collection, which he did from memory.' },
      { heading: 'Literary Works', text: 'He authored many great works on Hadith, Qur\'anic exegesis (tafsir), history and Sufism (tasawwuf), and made tahqiq (verification) of many original gems in the field of Hadith, which were part of his private library which also has one of the best collections of manuscripts in Egypt.' },
      { heading: 'Manuscript Collection', text: 'For this he had copied and collected manuscripts from the most ancient libraries in Mecca, Medina, Jerusalem, Damascus, Cairo, Fez, Tunis, Sudan and other centers of Islamic learning that he had visited. Shaykh Dr.`Abdul Halim Mahmud, the Rector of al-Azhar, wrote in Sidi al-Hafiz\'s obituary, "the Imam al-muhaddithin (leading hadith scholar) has died."' },
      { heading: 'Political Involvement', text: 'Shaykh al-Hafiz also took part in the Jihad against the English in Egypt in the early 1900\'s, and even Imam Hassan al-Banna, founder of the Muslim Brotherhood, used to seek his advice.' },
      { heading: 'Tariq al-Haqq Magazine', text: 'In 1951, he began editing a magazine dedicated to promulgating traditional Islam, called Tariq al-Haqq ("The Path of Truth"), which was widely read throughout Egypt. He also debated and defeated the Orientalists in Cairo during his time.' },
      { heading: 'International Recognition', text: 'His renown as a scholar even reached Western literary circles, and his important biography of al-Hajj Umar Futi Tal was translated into French by the Canadian scholar Fernand Dumond in 1983.' },
      { heading: 'Spiritual Station', text: 'Exceeding all of this by way of distinction, however, was the fact Shaykh Muhammad al-Hafiz used to meet Sayyidina Muhammad Rasulullah in a state of wakefulness. This was clear indication of his high spiritual station (maqam) in sainthood (wilaya).' },
      { heading: 'Spiritual Journey', text: 'He was originally involved in the honorable Khalwati, Naqshbandi, and Shadhili tariqahs, then left all of them to take the Way of Shaykh Ahmad Tijani at the hand of the Mauritanian Shaykh, Sidi Ahmad al-`Alawi al-Shinqiti.' },
      { heading: 'Tijaniyya Leadership', text: 'Numerous people from all walks of life took the Tijani Spiritual Path from Shaykh al-Hafiz and attained great spiritual heights. He was as famous as a Spiritual Master par excellence as he was a hadith scholar of the age, a combination extremely rare in modern times.' },
      { heading: 'Cairo Zawiyah', text: 'His Tijani Zawiyah in Cairo was and remains a great center of spiritual refreshment for those who live in or visit Cairo. His books on tasawwuf and tariqa are considered gems of spiritual knowledge.' },
      { heading: 'Connection to Sayyid Muhammad bin Alawi', text: 'Our late teacher, Sayyid Muhammad bin `Alawi al-Maliki of Mecca, was a very keen student of Shaykh Muhammad al-Hafiz in Hadith and tasawwuf when he was studying at the Azhar. He would fondly remember the "blessed gatherings" of Shaykh al-Hafiz, and always referring to him as "a great Wali of Allah", and would often mention some of his miracles (karamat).' },
      { heading: 'Relationship with Shaykh Ibrahim Niasse', text: 'Shaykh Muhammad al-Hafiz was in close correspondence with most of the leading Tijani authorities of his time, including Shaykh Ibrahim Niasse. Shaykh Ibrahim had the occasion to visit the zawiya of Shaykh al-Hafiz during an official state visit to Egypt in 1961.' },
      { heading: 'Shaykh Ibrahim\'s Testimony', text: 'In the presence of the Tijani notables of Egypt, Shaykh Ibrahim referred to Shaykh al-Hafiz as "a man who is without doubt an inheritor (khalifa) of the Shaykh Sidi Ahmad Tijani, whose description matches that of the Shaykh as I myself know him to be." In other words, whoever has seen the face of Shaykh al-Hafiz has seen the face of Sidi Ahmad al-Tijani.' },
      { heading: 'Passing & Succession', text: 'Shaykh al-Hafiz al-Tijani passed away in 1398 (1978) in Cairo. He was succeeded by his learned son Shaykh Ahmad Muhammad al-Hafiz, who authored a detailed biography of his father.' },
      { heading: 'International Students', text: 'Among those who were blessed to achieve spiritual education at the hands of Shaykh Muhammad al-Hafiz was the Italian Shaykh Abd al-Samad Paolo, who has translated and commented several important Sufi works (amongst them the Kitab al-ta\'arruf of Kalabadhi and the Mahasin al-majalis of Ibn al-\'Arif) into Italian.' },
      { heading: 'Legacy', text: 'Shaykh Muhammad al-Hafiz was indeed a giant of the twentieth century. May Allah be pleased with him, and may we benefit from his example, steeped as he was in both the Sacred Law (Shari\'a) and the Divine realities (Haqiqa), as a paradigm of true Muslim scholarship continuing into modern times.' }
    ],
  },
  // 10. Abdoulaye Niasse
  {
    id: 'al_hajj_abdoulaye_niasse',
    name: 'Al-Hajj Abdoulaye Bin Mamadou Niasse (R.A)',
    title: 'First Ijaza Mutlaqa Holder in Senegambia',
    bio: 'One of the greatest scholars of the Senegambia region in the early twentieth century, he was the first to obtain the unlimited authorization (ijaza mutlaqa) in the Tijaniyya in the Senegambia.',
    specialties: ['Tariqa Tijaniyya', 'Islamic Law', 'Hadith', 'Sufism', 'Islamic Education', 'Jihad'],
    image: require('../../assets/Al hajj abdoulaye.jpg'),
    details: [
      { heading: 'Birth & Early Life', text: 'Al-Hajj Abdoulaye (1845-1922) was one of the greatest scholars of the Senegambia region in the early twentieth century. One time Jihadist and subsequent farmer, he was the first to obtain the unlimited authorization (ijaza mutlaqa) in the Tijaniyya in the Senegambia and was famous for his teachings on a wide range of Islamic sciences.' },
      { heading: 'French Recognition', text: 'The French commandant in Nioro, Senegal, observed in 1898: "Abdoulaye is the leader of all the marabouts of Rip and of Saloum, and is superior to all of them – consequently, he enjoys a great authority over the masses" (Klein, p. 224).' },
      { heading: 'Family Background', text: 'Mamadou Niasse, the father of al-Hajj Abdoulaye, was also a marabout, or Islamic scholar, who immigrated to the Saloum region from Djoloff and founded his own village of Niacene in 1865. This was at the time of the religious wars of al-Hajj Umar Futi, carried out in the Saloum region by another Tijani, Ma Ba Diakhou.' },
      { heading: 'Jihad Participation', text: 'Abdoulaye would later participate in the war as an advisor to Saer Maty, the son of Ma Ba who assumed leadership of the movement after his father was assassinated by French intrigue. He soon dissociated himself from the jihad however, and devoted himself exclusively to teaching and farming.' },
      { heading: 'Village Foundation', text: 'Like his father, he also founded his own village, Taiba Niacene. But the memory of his participation in the jihads, along with his growing local influence, was too much for the new French-appointed rulers in the region.' },
      { heading: 'Exile to Gambia', text: 'In 1900, he and 200 of his disciples were forced to flee to Gambia by the French-appointed governor, even as three villages belonging to his followers, including Taiba Niacene and the central mosque and extensive library therein, were burned to the ground.' },
      { heading: 'Return to Kaolack', text: 'Abdoulaye only returned to the Saloum region in 1910, when he installed himself finally in Kaolack, probably only after the intervention of his friend, al-Hajj Malik Sy, with the French authorities.' },
      { heading: 'International Travels', text: 'Al-Hajj Abdoulaye made several journeys abroad. He accomplished the pilgrimage to Mecca as early as 1890. Other travels brought him to Fes, Cairo and, according to Paul Marty, even Marseille, France. He is said to have been given an ijaza by al-Azhar University during his stay in Egypt.' },
      { heading: 'Fes Journey & Manuscripts', text: 'In Fes, he was given an original manuscript of the Jawahir al-Ma\'ani in the handwriting of Sidi Ali Harazim, which had been in the possession of Shaykh Ahmad Tijani himself for more than ten years. He also met with Shaykh Ahmad Tijani in a waking vision and obtained some of the Shaykh\'s prayer beads from the head muqaddam of the Fes zawiya, Sidi al-\'Arabi bin Muhibb.' },
      { heading: 'Vision of Shaykh Ibrahim', text: 'Besides the ijaza mutlaqa, he also came to Fes praying Allah that one of his children would become the ghawth al-zaman. Before he left the Tijani zawiya in Fes, he saw a vision of his young son Ibrahim in the courtyard and knew all his prayers had been answered.' },
      { heading: 'Tijani Initiation', text: 'First initiated into the Tijaniyya through the silsila of al-Hajj Umar Futi at the hand of Shaykh Mamadou Diallo in 1875, al-Hajj Abdoulaye became connected with some of the most eminent Tijani scholars of his time.' },
      { heading: 'Ijaza Mutlaqa from Sukayrij', text: 'In Morocco, it was the renowned Shaykh Ahmad Sukayrij who gave al-Hajj Abdoulaye the ijaza mutlaqa. Shaykh Sukayrij would later mention al-Hajj Abdoulaye in one of his poems.' },
      { heading: 'International Connections', text: 'Al-Hajj Abdoulaye also remained on excellent terms with Sharif Ahmad bin Saih of Ain Maadi, Algeria (who visited him in Gambia and Senegal in 1909 and 1913), and Muhammad Ould Cheikh of the influential Mauritanian Idaw Ali tribe.' },
      { heading: 'Friendship with Al-Hajj Malik Sy', text: 'He also remained in close correspondence with al-Hajj Malik Sy. When he first met Shaykh Sukayrij to request the ijaza mutlaqa, the Moroccan Qadi informed him of a letter he had already received from al-Hajj Malik requesting the same.' },
      { heading: 'Intervention for Al-Hajj Malik', text: 'Shaykh Sukayrij told al-Hajj Abdoulaye to tell his friend and countryman to come to Fes in person the same way he had done. Al-Hajj Abdoulaye responded that whatever he himself was deserving of, his peer al-Hajj Malik was also deserving of the same.' },
      { heading: 'Stay in Tivaouane', text: 'As a result of this intervention and their long-time friendship, al-Hajj Malik requested al-Hajj Abdoulaye to stay with him in Tivaouane on his return from Fes. Marty in fact reports that he stayed in Tivaouane for several years.' },
      { heading: 'Teaching in Tivaouane', text: 'During al-Hajj Abdoulaye\'s time in Tivaouane, according to Shaykh Hassan Cisse, al-Hajj Malik would direct all requests for initiation into the Tijaniyya to his distinguished guest.' },
      { heading: 'Children & Legacy', text: 'Al-Hajj Abdoulaye had many children who continued his scholarly mission. Aside from Shaykh al-Islam Ibrahim Niasse, his first son Muhammad Khalifa Niasse was also a prolific author and scholar who traveled widely.' },
      { heading: 'Muhammad Khalifa Niasse', text: 'Among other things, Muhammad wrote a remarkable defense of the Tijaniyya which has been translated into French by Ousmane Kane in Triaud and Robinson (eds.), La Tijaniyya (Paris, 2000).' },
      { heading: 'Shaykh Ibrahim Niasse', text: 'But it was one of his younger sons, Shaykh Ibrahim, who became the greatest testament to al-Hajj Abdoulaye\'s scholarly legacy.' }
    ],
  },
  // 11. Malik Sy
  {
    id: 'al_hajj_malik_sy',
    name: 'Al-Hajj Malik Sy (R.A)',
    title: 'Renewer of Islam & Tijaniyya Scholar',
    bio: 'The prodigious scholar and righteous saint who was one of the key figures for the renewal of Islam and spread of the Tariqa Tijaniyya in Senegal in the late nineteenth and early twentieth centuries.',
    specialties: ['Tariqa Tijaniyya', 'Islamic Renewal', 'Arabic Poetry', 'Islamic Education', 'Sufism', 'Theology'],
    image: require('../../assets/Al-HajjMalikSy.jpg'),
    details: [
      { heading: 'Birth & Ancestry', text: 'Al-Hajj Malik Sy (1855-1922) was born in Gaya, in northern Senegal, of mixed Fulani and Wolof ancestry. His father was Ousmane Sy, but his most significant early teacher seems to have been his maternal uncle Mayoro Wale, from whom he took the Tijani wird at the age of eighteen.' },
      { heading: 'Early Education & Tijani Initiation', text: 'Mayoro was himself an accomplished Tijani scholar, having received initiation at the hands of Shaykh Mawlud Fal and later from al-Hajj Umar al-Futi Tal. After memorizing the Qur\'an and completing his early education, al-Hajj Malik traveled throughout Senegal studying with some of the most prominent scholars of his time.' },
      { heading: 'Studies in Mauritania', text: 'He spent a short time studying in Trarza, Mauritania, where he renewed his Tariqa affiliation under Muhammad Ali who was closely associated with the legacy of Muhammad al-Hafiz al-Shinqiti and the influential Idaw Ali shurafa\' of Mauritania.' },
      { heading: 'Pilgrimage to Mecca', text: 'He accomplished the Hajj in 1889, passing en route to Mecca through Marseille, Alexandria and Jeddah. Upon his return, he opened schools in Saint Louis, Dakar and in Marné before settling permanently in Tivaouane in 1902.' },
      { heading: 'Tivaouane Zawiyah', text: 'There his zawiya attained great renown as one of the premier centers of Islamic scholarship in the Senegambia. Al-Hajj Malik trained an elite cadre of Islamic intellectuals in the entirety of the Islamic sciences, before sending them throughout Senegal to teach others.' },
      { heading: 'International Relations', text: 'Al-Hajj Malik maintained active relations with the important branches of the Tijaniyya of his day, including the Tijani scholars of Fes and those of Ain Maadi, Algeria; both of which he remained in correspondence through letters.' },
      { heading: 'Family Connections', text: 'He also married his daughter Khadia to Saidou Nourou Tal, the grandson of al-Hajj Umar Tal and whom the French had named the "Grand Marabout" of West Africa.' },
      { heading: 'Relationship with Al-Hajj Abdoulaye Niasse', text: 'His relations with al-Hajj Abdoulaye Niasse were particularly close. Al-Hajj Abdoulaye visited al-Hajj Malik in Tivaouane when returning from one of his trips from Fes, and it was through him that al-Hajj Malik received the coveted ijaza mutlaqa from Shaykh Ahmad Sukayrij of Marakesh.' },
      { heading: 'Literary Works', text: 'Many of his poems in praise of the Prophet have attained great renown and are still recited by his followers, especially during the Mawlid season. Some twenty of his Arabic works were published, most of them in Tunis. Aside from poetry, his writings included treatises on theology, law, Sufism and biography of the Prophet Muhammad.' },
      { heading: 'Historical Context', text: 'Along with contemporaries Ahmadu Bamba and al-Hajj Abdoulaye Niasse, al-Hajj Malik played an important role in preserving and adapting the transmission of the traditional Islamic sciences in Senegal in the aftermath of French conquest.' },
      { heading: 'Geographic Influence', text: 'His followers are today found mostly in northern Senegal, although important communities exist from the Gambia to the Futa region of southern Mauritania.' },
      { heading: 'Succession & Legacy', text: 'Since the death of al-Hajj Malik, the Tivaouane zawiya has been headed by Abu Bakr Sy (d. 1957), Abd al-Aziz Sy (1957-1997) and Mansour Sy who is the present leader of the Sy family. Shaykh Mansour is usually represented by his official spokesman, Abd al-Aziz Sy.' },
      { heading: 'American Representation', text: 'The most prominent representative of the Sy family in America is Shaykh Ahmad Sy, a grandson of al-Hajj Malik who currently lives in Maryland.' },
      { heading: 'Educational Impact', text: 'Al-Hajj Malik\'s educational system produced generations of scholars who spread throughout West Africa, establishing schools and zawiyas that continue to serve Muslim communities to this day.' },
      { heading: 'Spiritual Leadership', text: 'As a spiritual leader, he combined deep knowledge of the Islamic sciences with practical guidance for his followers, establishing a model of scholarship that emphasized both learning and spiritual development.' },
      { heading: 'Cultural Preservation', text: 'Through his poetry and writings, he played a crucial role in preserving Arabic language and Islamic culture in West Africa during a period of colonial influence and cultural change.' },
      { heading: 'Modern Relevance', text: 'His teachings and approach to Islamic education continue to influence contemporary Islamic scholarship and practice in West Africa, particularly in the areas of Tijaniyya spirituality and Arabic literature.' }
    ],
  },
  // 13. Sheikh Abdullahi Maikano
  {
    id: 'sheikh_abdullahi_maikano',
    name: 'Sheikh Abdullahi Maikano (R.A)',
    title: 'First National Chief Imam of Ghana Armed Forces',
    bio: 'Sheikh Abdullahi Ahmed Maikano Jallo was a prominent Ghanaian Tijaniyya cleric and the first National Chief Imam of the Ghana Armed Forces. He was the father of Sheikh Ahmed Abulfaid Khalifa Jallo.',
    specialties: ['Tariqa Tijaniyya', 'Ghana Armed Forces', 'Islamic Leadership', 'Military Chaplaincy', 'Ghana'],
    details: [
      { heading: 'Position & Role', text: 'Sheikh Abdullahi Ahmed Maikano Jallo served as the first National Chief Imam of the Ghana Armed Forces, making him a pioneer in providing Islamic spiritual guidance to Ghana\'s military personnel.' },
      { heading: 'Tijaniyya Leadership', text: 'As a prominent Tijaniyya cleric in Ghana, he played a significant role in the development and organization of the Tijaniyya Muslim community in the country, establishing a foundation for its future growth.' },
      { heading: 'Family Legacy', text: 'He was the father of Sheikh Ahmed Abulfaid Khalifa Jallo, who would later become the President and Supreme Leader of the Tijaniyya Muslim Council of Ghana, continuing the family\'s tradition of Islamic leadership.' },
      { heading: 'Military Chaplaincy', text: 'His role as National Chief Imam of the Ghana Armed Forces involved providing religious guidance, conducting prayers, and offering spiritual support to Muslim military personnel, establishing important precedents for Islamic chaplaincy in Ghana\'s military.' },
      { heading: 'Community Building', text: 'Through his leadership, he helped build bridges between the Muslim community and Ghana\'s military establishment, promoting understanding and cooperation between religious and military institutions.' },
      { heading: 'Religious Authority', text: 'As a respected Islamic scholar and leader, he provided guidance on religious matters to both military personnel and the broader Muslim community in Ghana, establishing himself as an authoritative voice in Islamic affairs.' },
      { heading: 'Legacy in Ghana', text: 'His pioneering work in establishing Islamic chaplaincy in Ghana\'s military and his leadership in the Tijaniyya community laid the groundwork for the significant growth of the Tijaniyya Muslim Council of Ghana under his son\'s leadership.' },
      { heading: 'Continuing Influence', text: 'Through his son Sheikh Ahmed Abulfaid Khalifa Jallo, his legacy continues to influence the Tijaniyya community in Ghana, with the family maintaining its position as leaders of the Tijaniyya Muslim Council of Ghana.' }
    ],
  },
  // 14. Muhammad Hafiz Mishiri
  {
    id: 'muhammad_hafiz_mishiri',
    name: 'Shaykh Muhammad Al-Hafiz Al-Mishiri (R.A)',
    title: 'Renowned Scholar & Spiritual Guide',
    bio: 'Shaykh Muhammad al-Hafiz al-Mishiri was a distinguished Islamic scholar and spiritual guide known for his deep knowledge of Islamic sciences and his role in spreading Islamic education and spirituality.',
    specialties: ['Islamic Scholarship', 'Spiritual Guidance', 'Education', 'Tariqa Tijaniyya', 'Islamic Sciences'],
    details: [
      { heading: 'Scholarly Excellence', text: 'Shaykh Muhammad al-Hafiz al-Mishiri was recognized for his exceptional knowledge of Islamic sciences, including jurisprudence, hadith, tafsir, and Arabic language, making him a respected authority in Islamic scholarship.' },
      { heading: 'Spiritual Guidance', text: 'As a spiritual guide, he provided guidance and instruction to numerous students and followers, helping them develop both their intellectual understanding and spiritual practice of Islam.' },
      { heading: 'Educational Contributions', text: 'He played a significant role in Islamic education, teaching students in various Islamic sciences and contributing to the preservation and transmission of Islamic knowledge to future generations.' },
      { heading: 'Tariqa Tijaniyya Connection', text: 'His association with the Tariqa Tijaniyya reflects his commitment to the spiritual dimensions of Islam and his role in maintaining the tradition of Islamic spirituality and guidance.' },
      { heading: 'Community Leadership', text: 'As a respected scholar and spiritual guide, he provided leadership to his community, offering guidance on religious matters and helping to resolve issues within the Muslim community.' },
      { heading: 'Legacy of Learning', text: 'His dedication to Islamic scholarship and education left a lasting impact on his students and the broader Islamic community, contributing to the continued development of Islamic learning and practice.' },
      { heading: 'Spiritual Influence', text: 'Through his spiritual guidance and teaching, he influenced many individuals in their religious development, helping them to deepen their understanding and practice of Islam.' },
      { heading: 'Continuing Impact', text: 'His contributions to Islamic scholarship and spiritual guidance continue to be remembered and valued by those who benefited from his teaching and guidance, ensuring his legacy endures in the Islamic community.' }
    ],
  },
  {
    id: 'muhammad_al_ghali',
    name: 'Al-Muqaddam Al-Sharif, Sidi Muhammad Al-Ghali Abu Talib Al-Tijani Al-Hassani (R.A)',
    title: 'Elite Companion of Shaykh Ahmad Tijani',
    bio: 'Muhammad al-Ghali was one of the elite companions of Shaykh Ahmad Tijani and a descendent of the Prophet Muhammad through Sayyidina Hassan. He was blessed with the grand illumination (fath al-akbar) at the hand of the Prophet Muhammad.',
    specialties: ['Tariqa Tijaniyya', 'Elite Companion', 'Spiritual Zeal', 'Visionary Encounters', 'Propagation', 'Hijaz'],
    details: [
      { heading: 'Elite Status', text: 'Muhammad al-Ghali was one of the elite companions of Shaykh Ahmad Tijani and a descendent of the Prophet Muhammad through Sayyidina Hassan. According to Shaykh Ahmad Sukayrij, Sidi al-Ghali was one of ten companions of Shaykh Tijani whom Allah blessed with the grand illumination (fath al-akbar) at the hand of the Prophet Muhammad.' },
      { heading: 'Shaykh Tijani\'s Fondness', text: 'Shaykh Tijani was very fond of Sidi al-Ghali, and it was him whom he called to pronounce the famous words, "These two feet of mine are on the shoulders of every saint of Allah." This shows the special relationship between Shaykh Tijani and Sidi al-Ghali.' },
      { heading: 'Funeral Prayer Prediction', text: 'Shaykh Tijani also let it be known that it would necessary for Muhammad al-Ghali to perform the funeral prayer over him when he passed. At the time of Shaykh Tijani\'s passing, however, Muhammad al-Ghali was traveling.' },
      { heading: 'Burial & Reburial', text: 'Upon burial, the children of the Shaykh dug up the body of their father to take it back to Algeria. When the disciples in Fes prevailed upon the noble descendents of the Shaykh to let the blessed body be reburied in the Zawiya in Fes, Muhammad al-Ghali was there to perform the final funerary rites – thus fulfilling the prediction of Shaykh Tijani.' },
      { heading: 'Spiritual Zeal & Concentration', text: 'Muhammad al-Ghali was endowed with immense spiritual zeal and concentration. He used to spend hours in his prayers and remembrances; and it is reported he used to glorify Allah twenty-seven times in a single prostration.' },
      { heading: 'Deep Concentration', text: 'He once was so deep in concentration during his litany that he failed to notice his own daughter fall off the roof of his house in front of him. This demonstrates the depth of his spiritual absorption.' },
      { heading: 'Spiritual Heat', text: 'Once, one of his disciples happened to visit him after he had just finished his remembrances. The disciple noticed Sidi al-Ghali\'s body was strangely hot, as if he was in the midst of a steam bath. When he touched his hand, the disciple felt his hand burned as if he were touching hot coals.' },
      { heading: 'Explanation of Phenomenon', text: 'Shaykh Sukayrij explained, "Such a phenomenon is not uncommon among the people of Truth, considering what they are authorized to recite. Some may burn their tongue uttering the Magnificent Name." This shows the intensity of his spiritual practice.' },
      { heading: 'Visionary Encounter with Prophet', text: 'Among his visionary encounters was a meeting with the Prophet Muhammad, who told him, "You are the son of the beloved one of Allah, and you taken the spiritual path of the beloved one of Allah." This confirms his special status and lineage.' },
      { heading: 'Meeting with Shaykh Tijani After Death', text: 'He also met Shaykh Ahmad Tijani after his passing and asked him, "O Sidi! You went away and left us alone!" The Shaykh replied, "I am not distant from you and I did not leave you; I have only moved from an earthly dwelling place to an abode of light."' },
      { heading: 'Journey to Hijaz', text: 'After his training with Shaykh Tijani, Sidi al-Ghali went to the Hijaz to propagate the Tariqa. There he met al-Hajj Umar al-Futi, trained him and granted him license to spread the Tariqa Tijaniyya in West Africa.' },
      { heading: 'Training of Al-Hajj Umar', text: 'Al-Hajj Umar\'s Kitab al-Rimah describes Muhammad al-Ghali as being in frequent visionary contact with the Prophet and Shaykh Ahmad Tijani and traveling often between Mecca and Medina. This shows his continued spiritual connection even after Shaykh Tijani\'s passing.' },
      { heading: 'Death & Burial', text: 'Sidi al-Ghali died in 1244 (1829) in Mecca, and was buried in the same graveyard as Sayyida Khadija, the wife of the Prophet Muhammad. This is a great honor, being buried near the Prophet\'s beloved wife.' },
      { heading: 'Legacy & Influence', text: 'As one of the elite companions of Shaykh Ahmad Tijani and a key figure in the early propagation of the Tariqa Tijaniyya, particularly in the Hijaz and West Africa through his training of al-Hajj Umar al-Futi, Sidi Muhammad al-Ghali\'s influence continues to be felt throughout the Tijaniyya order.' }
    ],
  },
  {
    id: 'ibrahim_al_riyahi',
    name: 'Shaykh Al-Islam Ibrahim Al-Riyahi (R.A)',
    title: 'Imam of Zaytuna University & Maliki Shaykh al-Islam of Tunis',
    bio: 'Ibrahim al-Riyahi (1767-1850), the Imam of the Zaytuna University and Maliki Shaykh al-Islam of Tunis from 1832, stands as one of the most noteworthy testimonies to the richness of Zaytuna scholarship. He was the man who introduced the Tariqa Tijaniyya in Tunisia.',
    specialties: ['Tariqa Tijaniyya', 'Maliki Fiqh', 'Zaytuna University', 'Islamic Law', 'Poetry', 'Diplomacy', 'Sufism'],
    details: [
      { heading: 'Birth & Lineage', text: 'Ibrahim al-Riyahi (1767-1850) was born in Testour, Tunisia. His full name was Abu Ishaq Ibrahim b. \'Abd al-Qadir b. Ahmad b. Ibrahim al-Tarabulusi al-Riyahi. He derived the nisba al-Tarabulusi from his great grandfather Ibrahim, a Qur\'anic teacher who had moved with his family from Libya to join other members of his tribe (Banu Riyah) who had settled in the hilly region of Teboursouk, in the inland of Northern Tunisia.' },
      { heading: 'Family Background', text: 'Ahmad, son of the latter and grandfather of Ibrahim al-Riyahi, had later moved to Testour, an ancient town in the hills that dominate the Medjerda valley, rebuilt in 1609 by Muslims and Jewish fleeing from Andalusia after the Reconquista. Here, in Testour, Ibrahim was born in 1767 to \'Abd al-Qadir, a son of Ahmad, who, like his father and his grandfather, earned his living by teaching the Qur\'an.' },
      { heading: 'Early Education', text: 'After having memorized the Qur\'an from his father when he was in his late teens (some time between 1782 and 1785), Ibrahim was sent out to pursue higher studies in Tunis. He settled in the Madrasa of the Hawanit al-\'Ashur (Houanet Achour) ward, a western quarter of the Medina.' },
      { heading: 'Studies at Zaytuna', text: 'He attended courses in all the major religious and philological disciplines at the Houanet Achour Madrasa, and then at the Zaytuna, the oldest center of Islamic learning in North Africa, which had been established in the eighth century and functioned as a major hub of Maliki legal thought. Under Ottoman rule, a parallel system of Hanafi law had been established, and the two legal doctrines were taught at the Zaytuna and practiced by the Tunisian courts.' },
      { heading: 'Distinguished Teachers', text: 'At the Zaytuna, Ibrahim al-Riyahi studied with the most renowned scholars in Tunis of his time. Among his teachers were Muhammad al-Mahjub (Maliki Bash-mufti), Isma\'il al-Tamimi (who succeeded the former as Maliki Bash-mufti), Muhammad Bayram II (Hanafi Bash-mufti), Hasan al-Sharif (Chief-Imam of the Zaytuna), Ahmad Abu Khris, Muhammad al-Fasi, Salih al-Kawwash, \'Umar al-Mahjub, and Tahir b. Mas\'ud.' },
      { heading: 'Recognition & Teaching', text: 'He quickly attained great recognition for his sharp intelligence and for the passion with which he devoted to study. After obtaining ijazas in the major disciplines, he was encouraged by his masters to accept students of his own, which he did some time in his late twenties under one of the pillars of the Zaytuna mosque as was customary. He specialized in the teaching of grammar, prosody, rhetoric, and Maliki fiqh.' },
      { heading: 'Teaching Excellence', text: 'It is related that one day his former teacher Tahir b. Mas\'ud, while commenting on the Mukhtasar of Sa\'d, overheard Ibrahim al-Riyahi teaching the same book to another group of students a few meters away. He interrupted his own lesson, and sent his students to listen to his former pupil\'s explanations.' },
      { heading: 'Advanced Teaching', text: 'Later on, Shaykh Ibrahim al-Riyahi would also start teaching qur\'anic exegesis (the Ash\'ari theological tafsir by Baydawi, for which he had obtained an ijaza from Shaykh Salih al-Kawwash), and hadith (Bukhari, with the commentary of Qastallani). Among his students were a number of influential persons in the intellectual and political life of Tunis in late nineteenth century.' },
      { heading: 'Notable Students', text: 'Among his students were the historian and Ministerial councilor Ahmad Ibn Abi Diyaf, Bayram V, Mahmud Qabadu, and the poet al-Baji al-Mas\'udi, demonstrating his influence on the intellectual elite of Tunisia.' },
      { heading: 'Early Sufi Inclinations', text: 'The pathway which would eventually lead Ibrahim al-Riyahi to join the Tijaniyya developed out of his early search for knowledge in Tunis. Esoteric sciences, however, were probably already part of his family legacy: indeed the esoteric sciences associated with Arabic letters of the Qur\'an (\'ilm al-huruf) were integrated into his ancestors\' study and transmission of the Qur\'anic sciences.' },
      { heading: 'Shadhili Initiation', text: 'While pursuing his training in other classical Islamic sciences in Tunis, he simultaneously evidenced strong Sufi inclinations. He first embraced the path of Sidi Abu al-Hasan al-Shadhili, the famous Moroccan saint who visited Tunis, where his Tariqa is still very popular. He devotedly pursued this path under the direction of his master Sidi \'Abd al-Rahman al-Bashir Mashish.' },
      { heading: 'Meeting with Sidi Ali Harazim', text: 'Some years later, his encounter with the Moroccan Sidi \'Ali Harazim, one of the closest companions of Shaykh Ahmad al-Tijani, would lead him to embrace the Tijani path. \'Ali Harazim had come to Tunis en route to accomplishing the pilgrimage, after having been confirmed as a consummate \'Arif billah (Gnostic) by Shaykh Ahmad Tijani and sent from Fez to spread the new order.' },
      { heading: 'Premonitory Dream', text: 'Ibrahim met Sidi \'Ali Harazim in the Zaytuna after a premonitory dream, and then invited the Moroccan Sufi to be his guest in the Madrasa \'Ashuriyya. \'Ali Harazim was gifted with many karamat (miraculous signs), and some intense events marked the acquaintance of the two, probably deeply affecting the young Zaytuna professor.' },
      { heading: 'Answered Prayers', text: 'It is related that one night \'Ali Harazim woke up Ibrahim and told him: "wake up and ask God what you desire, for this is the time of the answered prayer". Ibrahim wrote down 14 implorations (amongst them "to be granted constant vision of the Prophet Muhammad (sAws)", "obtaining complete ma\'rifa", "to be granted mastery in exoteric and esoteric sciences", "to be granted a wife who will assist me", "pious children", and "to die as a believer"). It seems that God did indeed grant Ibrahim his supplications through the intermediary of Sidi Ali Harazim.' },
      { heading: 'Tijani Initiation', text: 'Notwithstanding the intense period of acquaintance with Sidi \'Ali Harazim and the latter\'s close affiliation with the Tijaniyya, Ibrahim al-Riyahi did not ask for actual initiation into the new order until he met Abu al-Hasan al-Shadhili in a dream encouraging him. Then, after he had asked permission the shaykh who had initiated him into the Shadhiliyya, Sidi al-Mashish, he took the tijani pact at the hand of Sidi Ali Harazem.' },
      { heading: 'Diplomatic Mission to Morocco', text: 'In 1803, an insistent drought in Tunis prompted the Bey to send a mission to Morocco, in order to convince the Sultan Moulay Sulayman to sell a certain quantity of crops that would allow Tunisia to overcome the food crisis. Ibrahim al-Riyahi was selected to conduct the mission, bringing a letter written by Isma\'il al-Tamimi.' },
      { heading: 'Visit to Shaykh Ahmad Tijani', text: 'While in Fez, he also visited Shaykh Ahmad al-Tijani, about whom he would later remember: "I have never met anybody whose qiyam and whose sujud lasted longer than his." He received further instruction in the Tijani path from Shaykh Ahmad Tijani himself, whom he would later praise with beautiful verses.' },
      { heading: 'Poetic Praise of Shaykh Tijani', text: 'He praised Shaykh Ahmad Tijani with verses such as: "The succor of creation, Abul-\'Abbas [Ahmad al-Tijani], Whose essence is too exalted to be disclosed on paper. The spirit of existence, the pole, center and support of being; Its secret radiating to men."' },
      { heading: 'Political Recognition', text: 'The fact that, at about 35 years of age, he was selected for such a delicate diplomatic mission, demonstrates that the Tunisian political authorities had already started to notice the young scholar. Only a few months before, however, Shaykh Ibrahim al-Riyahi had been very close to abandoning Tunis and looking for a teaching career abroad.' },
      { heading: 'Settlement in Tunis', text: 'It was thanks to the intervention of Yusuf Sahib al-Taba\', Minister and Privy Seal of the reigning Bey Hammuda Pasha, that Ibrahim al-Riyahi definitely gave up his plans of leaving Tunis. Yusuf Sahib al-Taba\' offered him a house and arranged a marriage for him, and thus Ibrahim could settle in a street of the Houanet Achour ward, where the first tijani zawiya in Tunis would also be built shortly later.' },
      { heading: 'First Tijani Zawiya in Tunis', text: 'The first tijani zawiya in Tunis was built in the street where Ibrahim al-Riyahi settled, hosting today the founder\'s mausoleum. This marked the establishment of the Tariqa Tijaniyya in Tunisia.' },
      { heading: 'Political Independence', text: 'The behavior of Ibrahim al-Riyahi towards the political authorities — a mixture of good sense, firmness and dignity — constitute one of the most fascinating traits of his biography. His relations with political authorities recalls the Muslim adage, "the best of the Sultans is the one who looks for the company of the scholars, and the best of the scholars is the one who keeps himself far from the Sultans".' },
      { heading: 'Refusal of Qadi Position', text: 'In 1806, Ibrahim al-Riyahi refused the position of qadi offered to him by Bey Hammuda Pasha to replace Shaykh \'Umar al-Mahjub, with whom the Bey was rancorous after the latter had publicly sent him an allusive critique during a Friday sermon at the Zaytuna. Ibrahim al-Riyahi had to escape to Zaghwan to seek refuge in a zawiya which enjoyed the right of asylum in order to escape the Bey\'s offer.' },
      { heading: 'Dignified Interaction with Bey', text: 'In 1816, Husayn Bey II invited him at the Bardo Palace to confer on him the teaching of Tafsir al-Baydawi at the Zaytuna after the death of Shaykh al-Fasi. When Husayn extended his hand towards him to have it kissed, Ibrahim, instead, shook it. Nervously, the son of the sovereign asked him: "What did you come to do here?", and the Shaykh answered promptly: "Nothing: but you have invited me, and here I am".' },
      { heading: 'Maliki Bash-Mufti', text: 'In 1823, Husayn Bey II chose to raise Ibrahim al-Riyahi to the position of Maliki Bash-Mufti, the highest rank in the Tunisian judiciary hierarchy. The Shaykh initially refused and only accepted after the Bey repeated insistence. A number of the fatwas he issued during the 27 years he served as Mufti are reported in his biography, the Ta\'tir al-nawahi.' },
      { heading: 'Religious & Social Approach', text: 'In religious issues, he was a scrupulous Maliki. In social issues, he always tried to implement the principle that "Religion enjoins ease". He was often also solicited on social and political matters.' },
      { heading: 'Support for Abolition of Slavery', text: 'When he was asked by Ahmad Bey to give his advice on the measures the Bey had adopted that enjoined the release of a number of enslaved blacks and the abolition of slavery in the Regency, he commended the decisions describing them as "totally legitimate, and worthy of being upheld by all reasonable and soundly educated minds".' },
      { heading: 'Mission to Istanbul', text: 'In 1838, he was again entrusted with an official mission, this time to the Ottoman Court in Istanbul, in order to ask for the exoneration of Tunis from an annual tribute and for the recognition of the partial autonomy of the Regency. Before praising him by a poem which exalted his ascendancy and the accomplishments of his ancestors, he addressed the Sultan standing, refusing the customary bowing.' },
      { heading: 'First Imam of Zaytuna', text: 'In 1839, he was appointed as First Imam of the Zaytuna. He was the first person in Tunis who combined the position of Maliki Shaykh al-Islam and that of First Imam. From the pulpit of the Zaytuna, he used to enjoin to people zuhd (asceticism), but also to reprimand the economic policies of the Bey when he felt compelled to do so.' },
      { heading: 'Pilgrimage & Travels', text: 'Other travels of Shaykh Ibrahim al-Riyahi include the Pilgrimage to Mecca and the visit to Medina. He also had occasion to visit the Algerian town of Tamasin to pay his respects to the Khalifa of Shaykh Ahmad Tijani, Sidi Ali al-Tamasini.' },
      { heading: 'Literary Works', text: 'Among his many writings were dozens of poems, collected in a published Diwan (praises of the Prophet [sAws] and of Shaykh Ahmad al-Tijani [rAh]; elegies for his teachers); a dazzling devotional text on the Prophet [sAws] titled al-Narjasa al-\'anbariyya fi al-salati \'ala Khayr al-bariyya; glosses on the commentary by Fakihani to the Qatr al-nada; a writing in the defense of the sound Ash\'arism of Sidi Ahmad al-Tijani; a versification of the Ajurrumiyya; a refutation of the Wahhabi doctrine; and numerous khutbas, fatwas and answers to legal problems.' },
      { heading: 'Mawlid Revival', text: 'He also revived the celebration of the Mawlid nabawi in Tunis and wrote a short text for the occasion, contributing to the preservation of Islamic traditions in Tunisia.' },
      { heading: 'Death & Legacy', text: 'Shaykh Ibrahim al-Riyahi died shortly after his son, from the same cholera epidemic. The last of the many favors that he received from God was that he was destined to leave the world on the night of Ramadan 27th, 1266 (August 6th, 1850).' },
      { heading: 'Shaykh Ibrahim Niasse\'s Testimony', text: 'Shaykh Ibrahim Niasse (d. 1975) said about him: "Were Shaykh Ahmad al-Tijani to have no other follower but Abu Ishaq Ibrahim al-Riyahi, it would suffice us as proof to also follow him." This shows the high regard in which he was held by later Tijani scholars.' },
      { heading: 'Continuing Influence', text: 'As the Imam of Zaytuna University, Maliki Shaykh al-Islam of Tunis, and the man who introduced the Tariqa Tijaniyya in Tunisia, Shaykh Ibrahim al-Riyahi\'s influence continues to be felt in both the scholarly and spiritual traditions of North Africa.' }
    ],
  },
  // 15. Sheikh Abulfaid Khalifa
  {
    id: 'sheikh_ahmed_jallo',
    name: 'Sheikh Ahmed Abulfaid Khalifa Jallo (R.A)',
    title: 'President & Supreme Leader of Tijaniyya Muslim Council of Ghana',
    bio: 'Sheikh Ahmed Abulfaid Khalifa Jallo, also known as Sheikh Khalifa Abul Faidi Ahmed Maikano, is the President and Supreme Leader of the Tijaniyya Muslim Council of Ghana. He succeeded his late father and leads over four million followers in Ghana.',
    specialties: ['Tariqa Tijaniyya', 'Leadership', 'Peace & Unity', 'Community Building', 'Interfaith Relations', 'Ghana'],
    image: require('../../assets/Sheikh_ahmedjallo.jpg'),
    details: [
      { heading: 'Leadership Position', text: 'Sheikh Ahmed Abulfaid Khalifa Jallo, also known as Sheikh Khalifa Abul Faidi Ahmed Maikano, is the President and Supreme Leader of the Tijaniyya Muslim Council of Ghana. He holds the highest position within this prominent Muslim organization in Ghana.' },
      { heading: 'Succession & Family Legacy', text: 'He succeeded his late father, Sheikh Abdulai Ahmed Maikano Jallo, who was a prominent Ghanaian Tijaniyya cleric and the first National Chief Imam of the Ghana Armed Forces. This represents a continuation of a distinguished family tradition of Islamic leadership and service.' },
      { heading: 'Community Growth', text: 'Under Sheikh Khalifa Abul Faidi\'s leadership, the Tijaniyya Muslim Council has grown to over four million followers in Ghana. This remarkable growth demonstrates his effective leadership and the community\'s trust in his guidance.' },
      { heading: 'Recognition for Peace', text: 'He is recognized for his dedication to peace and unity within the Muslim community and the nation at large. In 2015, he was honored as a "Man of Peace" by various embassies and organizations, including the Iranian Consulate, the Norwegian Embassy, the Algerian Embassy, the Jallo Foundation, and the Coalition of Muslim Organizations in Ghana.' },
      { heading: 'International Recognition', text: 'The "Man of Peace" honor in 2015 reflects his commitment to fostering harmony and understanding, not only within the Muslim community but also in broader society. This recognition from multiple international embassies and organizations highlights his global impact.' },
      { heading: 'Promoting Reconciliation', text: 'Sheikh Khalifa Abul Faidi has also been active in promoting reconciliation and unity among different communities. In 2019, he congratulated Yaa Na Abubakari Mahama II on his enskinment as the new overlord of Dagbon, urging the people of Dagbon to embrace peace and unity.' },
      { heading: 'Inter-Community Relations', text: 'His efforts in promoting reconciliation extend beyond religious communities to include traditional leadership structures, demonstrating his commitment to building bridges between different segments of Ghanaian society.' },
      { heading: 'Religious Leadership & Vision', text: 'As a religious leader and visionary, his leadership is credited with revitalizing the Tijaniyya movement and promoting spiritual growth among his followers. He has brought new energy and direction to the Tijaniyya community in Ghana.' },
      { heading: 'Unity Through Religious Tours', text: 'He undertakes religious tours across Ghana to foster unity between the Tijaniyya Muslim Council and traditional leaders, enhancing inter-community relations. These tours serve to strengthen bonds and promote mutual understanding.' },
      { heading: 'Central Figure in Major Events', text: 'He is the leader for the annual Maulid (birthday celebration) of Sheikh Ahmad Tijani, a large gathering held in Prang, Bono East region. This annual event brings together thousands of Tijaniyya followers from across Ghana and beyond.' },
      { heading: 'Family Connection', text: 'He is the son of the late Sheikh Abdullahi Maikano Jalloo, another revered religious figure. This family connection represents a continuation of spiritual leadership and service to the Tijaniyya community in Ghana.' },
      { heading: 'Geographical Focus', text: 'His activities are concentrated in Ghana, with specific mention of the Prang and Savanna regions. These areas serve as important centers for Tijaniyya activities and community gatherings.' },
      { heading: 'Supreme Leadership Role', text: 'As Supreme Leader of Tijaniyya Muslim Council of Ghana, Sheikh Abulfaid holds the highest position within this prominent Muslim organization in Ghana. His leadership influences the spiritual direction and community activities of millions of followers.' },
      { heading: 'Peaceful Coexistence', text: 'His leadership continues to influence the Tijaniyya Muslim community in Ghana, emphasizing peaceful coexistence and spiritual growth. He promotes values of tolerance, understanding, and harmony within the community and with other groups.' },
      { heading: 'Community Building', text: 'Through his leadership, he has built strong community networks that support the spiritual and social needs of Tijaniyya followers. His approach emphasizes both individual spiritual development and collective community welfare.' },
      { heading: 'Traditional Leadership Relations', text: 'His work with traditional leaders demonstrates his understanding of Ghana\'s cultural landscape and his ability to navigate between religious and traditional authority structures, promoting mutual respect and cooperation.' },
      { heading: 'Annual Maulid Celebrations', text: 'The annual Maulid celebrations in Prang serve as a major gathering point for the Tijaniyya community, bringing together followers from across Ghana and neighboring countries to celebrate the birth of Sheikh Ahmad Tijani.' },
      { heading: 'Spiritual Guidance', text: 'As a spiritual leader, he provides guidance on religious matters, personal development, and community issues. His leadership combines traditional Islamic scholarship with contemporary approaches to community building.' },
      { heading: 'International Relations', text: 'His recognition by various international embassies and organizations reflects his role as a bridge between the Ghanaian Muslim community and the international community, promoting understanding and cooperation.' },
      { heading: 'Legacy of Service', text: 'Following in his father\'s footsteps, Sheikh Ahmed Abulfaid continues a legacy of service to the Tijaniyya community and the broader Ghanaian society, maintaining the family\'s commitment to Islamic leadership and community development.' },
      { heading: 'Modern Leadership Approach', text: 'His leadership represents a modern approach to traditional Islamic leadership, combining spiritual guidance with practical community development and interfaith cooperation.' },
      { heading: 'Continuing Influence', text: 'As the current Supreme Leader of the Tijaniyya Muslim Council of Ghana, Sheikh Ahmed Abulfaid Khalifa Jallo continues to shape the spiritual and social landscape of the Tijaniyya community in Ghana, promoting peace, unity, and spiritual growth among his millions of followers.' }
    ],
  },
  {
    id: 'muhammad_al_hafiz_shinqiti',
    name: 'Sidi Muhammad Al-Hafiz Al-Shinqiti (R.A)',
    title: 'First Introducer of Tariqa Tijaniyya in Mauritania',
    bio: 'Muhammad al-Hafiz b. al-Mukhtar b. al-Habib (1759-1830) is credited with first introducing the Tariqa Tijaniyya in Mauritania, whereby it was introduced into sub-Saharan West Africa. He became the preeminent instructor (muqaddam) of the Tijaniyya in Mauritania after spending years with Shaykh Ahmad Tijani in Fes.',
    specialties: ['Tariqa Tijaniyya', 'Mauritania', 'West Africa', 'Hadith', 'Fiqh', 'Sufism', 'Idaw Ali'],
    details: [
      { heading: 'Birth & Lineage', text: 'Muhammad al-Hafiz b. al-Mukhtar b. al-Habib (1759-1830) hailed from the noble Idaw \'Ali people in Mauritania, who trace descent from Muhammad Ibn Hanafiyya, a son of Ali b. Abi Talib. This noble lineage connected him to the Ahl al-Bayt (family of the Prophet).' },
      { heading: 'Family Background', text: 'His father, Mukhtar b. Habib (d. 1806) was also an Islamic scholar, and particularly distinguished for his mastery of the art of calligraphy. His grandfather on his mother\'s side, Muhammad al-Alawi, was the chief judge (qadi) among the important Trarza region of Mauritania in the mid-1700s.' },
      { heading: 'Scholarly Family', text: 'Sidi al-Hafiz was not the only scholar among his siblings, and two brothers, Muhammad Sa\'id and Muhammad al-Amin were also famous scholars. The same was true of his brother-in-law, Muhamdi b. Abd Allah al-Alawi, known as "Baddi," who authored the most complete biography of Sidi al-Hafiz, called Nuzhat al-Mustam\' wa-l-lafiz fi manaqib al-shaykh Muhammad al-Hafiz (1832).' },
      { heading: 'Early Education', text: 'Shaykh Muhammad al-Hafiz began his Islamic education with the Qur\'an, and memorized the entire Holy Book by the age of seven. This early mastery of the Qur\'an laid the foundation for his later scholarly achievements.' },
      { heading: 'Studies with Grandmother', text: 'Following the death of his grandfather, he continued his studies in jurisprudence (fiqh) with his grandmother – herself a learned scholar who taught him the Alfiyya of Ibn Malik, the Risala of Ibn Abi Zayd and the Mukhtasar of Sidi Khalil. This demonstrates the high level of Islamic education among women in his family.' },
      { heading: 'Studies with Abd Allah b. Ahmaddan', text: 'After the death of his grandmother, he traveled to study grammar (nahw) among other sciences with the learned Faqih, Abd Allah b. Ahmaddan (d. 1815). Sidi Ahmaddan was also a shaykh of the Shadhiliyya Nasiriyya, but there is no evidence that Sidi al-Hafiz took the Shadhili wird at this time.' },
      { heading: 'Advanced Studies', text: 'He next studied the Qur\'anic sciences, logic (mantiq) and theology (\'aqida) with Hurma b. Abd al-Jalil (d. 1827) and then completed his study of jurisprudence (fiqh) with Abd Allah b. Ahmad b. Mahham b. al-Qadi (d. 1826).' },
      { heading: 'Studies with Abd Allah b. al-Hajj Ibrahim', text: 'Continuing in the tradition of a traveling student in search of sacred knowledge, he next went to study with Abd Allah b. al-Hajj Ibrahim (d. 1818), a celebrated scholar in Mauritania who had studied in Fes and who had become a friend of the Moroccan Sultan, Mawlay Muhammad b. Abd Allah.' },
      { heading: 'Six Years of Intensive Study', text: 'Sidi al-Hafiz spent six years with Sidi Abd Allah, studying Prophetic traditions (hadith), legal principles (usul al-fiqh) and rhetoric (ilm al-bayan). He also married his teacher\'s daughter, further strengthening the bond between teacher and student.' },
      { heading: 'Respect for Teachers', text: 'The companions of Shaykh Tijani in Fes remarked that even after his submission to Shaykh Tijani, Sidi al-Hafiz maintained the utmost respect for his previous teachers; and for Sidi Abd Allah in particular. This demonstrates his character and adherence to Islamic etiquette.' },
      { heading: 'Journey to Fes', text: 'Indeed, it was following Sidi Abd Allah\'s example that Sidi al-Hafiz embarked on his journey seeking knowledge in Fes. But there was also a more immediate reason for his journey to Fes.' },
      { heading: 'Supplication During Hajj', text: 'Sidi al-Hafiz had made persistent supplication while performing Hajj to be united with a perfected spiritual master. As he was circumambulating the Holy House in Mecca, an unknown man approached him to tell him that Shaykh Ahmad Tijani was to be his spiritual master.' },
      { heading: 'Meeting Shaykh Ahmad Tijani', text: 'After learning the identity of this mysterious Shaykh from a group of Moroccan pilgrims, Sidi al-Hafiz traveled to Fes to meet him. He spent four years with Shaykh Tijani in Fes, from 1800-1804/5. The ijaza he received, still preserved among his descendents in Mauritania, was dictated by Shaykh Tijani and written in the hand of Muhammad b. Mishry, the close companion of Shaykh Tijani and author of Kitab al-Jami\'.' },
      { heading: 'Shaykh Tijani\'s Advice', text: 'Before leaving to return home, Shaykh Tijani advised him, "Do not seek to appear (before the people) until Allah makes you appear." This advice reflects the principle of spiritual humility and divine timing in the Sufi tradition.' },
      { heading: 'Discrete Practice', text: 'For the first year after his return, Sidi al-Hafiz thus practiced the Tariqa with great discretion as he taught the Islamic sciences, neither informing others of the Tariqa nor of his appointment as propagator (muqaddam).' },
      { heading: 'Divine Sign', text: 'Then he received a surprise visit from an ascetic famous for his visionary encounters with Khidr, the mystical instructor of Moses as mentioned in the Qur\'an. The ascetic told him to give him the wird he was hiding. With this sign, Sidi al-Hafiz began to speak openly of the Tariqa Tijaniyya.' },
      { heading: 'Teaching & Scholarship', text: 'His teachings attracted a great many students and, besides his credentials as a Sufi shaykh, he was particularly renowned as a distinguished scholar of hadith, possessing a highly desirable chain (isnad) of transmission through Salih al-Fulani in Medina.' },
      { heading: 'Literary Works', text: 'He wrote a commentary on the Alfiyya discussing the rules of hadith transmission. He was also known for his teaching of jurisprudence and grammar. His instruction in tasawwuf emphasized the Kitab al-Hikam of Ibn \'Ata Allah in addition to Tijani sources.' },
      { heading: 'Tolerance & Respect', text: 'Sidi al-Hafiz discouraged conflict between Sufi orders and advised his disciples not to disrespect the followers of other Sufi paths, saying "Do not ask him who follows another Sufi order to abandon his litany and do not seek to dampen his enthusiasm for it. Tell him instead that all the litanies (awrad) are paths that lead to Allah."' },
      { heading: 'Innovation in Sufi Practice', text: 'Following the advice of Shaykh Tijani, Sidi al-Hafiz\'s own Sufi instruction differed from existing Sufi practice in Mauritania by its absence of khalwa and a de-emphasis of talismanic sciences. This represented a new approach to Sufi practice in the region.' },
      { heading: 'Idaw Ali Propagation', text: 'Through Muhammad al-Hafiz the Idaw \'Ali quickly became the principle propagators of the Tijaniyya in West Africa. The "Hafiziyya" tradition was marked by many great scholars after the passing of Sidi al-Hafiz.' },
      { heading: 'Hafiziyya Legacy', text: 'The book of Ubayda ibn Muhammad al-Saghir al-Tashit, Mizab al-Rahma al-Rabbaniyya fi al-Tarbiya bi al-Tariqa al-Tijaniyya (1851), is considered a masterful synthesis of the Tijani legacy left by Muhammad al-Hafiz. It describes the essence of the Tariqa as gratitude (shukr) to Allah and details a methodology of spiritual training (tarbiya) through the three stages of Islam (submission), Iman (faith) and Ihsan (spiritual excellence).' },
      { heading: 'Mawlud Fal', text: 'The most famous disciple of Muhammad al-Hafiz was Mawlud Fal, who is credited with the expansion of al-Hafiz\'s teachings outside of the Idaw \'Ali. Mawlud Fal was from the Id-Ayqub, a people of Mauritania famous for their expertise in jurisprudence.' },
      { heading: 'Mawlud Fal\'s Journey', text: 'He became a close disciple of Shaykh al-Hafiz and eventually married his sister. He left for Fes in 1815 hoping to meet Shaykh Tijani in person, but arrived just after his passing. The Tijani notables of Fes nonetheless renewed his ijaza originally given him by al-Hafiz.' },
      { heading: 'Mawlud Fal\'s Studies in Fes', text: 'He studied closely with the son of Ali Harazim, who instructed him in the practice of khalwa and other supererogatory litanies not transmitted to him by Muhammad al-Hafiz. After his study in Fes, Mawlud Fal traveled widely throughout West Africa.' },
      { heading: 'Expansion Through Mawlud Fal', text: 'During his travels, Mawlud Fal appointed many teachers who themselves helped spread the Tariqa all over Africa. Thus \'Abd al-Karim b. Ahmad al-Naqil (the first shaykh of al-Hajj Umar Futi) became one of his important muqaddams in Futa Jallon; Mudibu Ahmad Raji received an ijaza from Mawlud Fal to spread the Tariqa in Northern Nigeria; and Wad Dulayb spread the Tariqa in the Sudan under the silsilah of Mawluf Fal.' },
      { heading: 'Support for Al-Hajj Umar\'s Jihad', text: 'The "Hafiziyya" branch of the Tijaniyya also played an important role in securing support for the Jihad of al-Hajj Umar among the Moroccan Tijani scholars. Al-Hajj Umar kept in close contact with the Hafiziyya zawiya in Mauritania even after his training with Muhammad al-Ghali.' },
      { heading: 'Connection to Sokoto', text: 'Once, when the Sokoto Sultan Muhammad Bello requested permission from him for the prayer hizb al-bahr and the book Jawahir al-Khams, al-Hajj Umar responded that he himself could not give such permission, but that he would request it from the Hafiziyya zawiya in Mauritania. To this end, al-Hajj Umar sent his elder brother Alfa Ahmad, who had his own ijaza renewed by the Hafiziyya zawiya.' },
      { heading: 'Twentieth Century Influence', text: 'Even in the twentieth century, the Hafiziyya tradition played a large role in shaping the careers of Tijani scholars. One of al-Hajj Malik Sy\'s most important initiations into the Tariqa was through the son of Mawlud Fal, known as al-Shaykh.' },
      { heading: 'Connection to Shaykh Ibrahim Niasse', text: 'Shaykh Ibrahim Niasse\'s most significant early ijaza besides that from his father was from al-Hajj Abdullahi Wuld al-Hajj, a renowned representative of the Hafiziyya tradition who had been seeking the spiritual flood (fayda) of Shaykh Ahmad Tijani for many years before recognizing it in the person of Shaykh Ibrahim Niasse.' },
      { heading: 'Legacy & Continuing Influence', text: 'As the first introducer of the Tariqa Tijaniyya in Mauritania and the founder of the Hafiziyya tradition, Sidi Muhammad al-Hafiz al-Shinqiti\'s influence continues to be felt throughout West Africa. His scholarly excellence, spiritual depth, and commitment to spreading the Tariqa established a foundation that has endured for centuries.' }
    ],
  },
  {
    id: 'imam_an_nawawi',
    name: 'Imam An-Nawawi (R.A)',
    title: 'Shaykh al-Islam & Hadith Scholar',
    bio: 'Abu Zakariyya Yahya ibn Sharaf al-Nawawi (1233-1277) was a renowned Shafi\'i jurist and hadith scholar. Known as "Shaykh al-Islam," he authored numerous influential works including Riyadh as-Salihin and Al-Arba\'in An-Nawawiya.',
    specialties: ['Hadith', 'Fiqh', 'Shafi\'i School', 'Spirituality', 'Scholarship'],
    details: [
      { heading: 'Birth & Early Life', text: 'Imam An-Nawawi was born in 631 AH (1233 CE) in the village of Nawa, near Damascus, Syria. His father was a pious man who ensured his son received the best Islamic education from an early age.' },
      { heading: 'Education in Damascus', text: 'At the age of 18, he moved to Damascus to study at the famous Dar al-Hadith al-Ashrafiyya. He studied under the most prominent scholars of his time, including Ibn al-Salah, who was the leading hadith scholar of the era.' },
      { heading: 'Memorization of Hadith', text: 'Imam An-Nawawi memorized thousands of hadith and became known for his exceptional memory and understanding of the Prophetic traditions. He was particularly skilled in distinguishing authentic from weak hadith.' },
      { heading: 'Riyadh as-Salihin', text: 'His most famous work, Riyadh as-Salihin (Gardens of the Righteous), is a collection of authentic hadith organized by topics of Islamic ethics and spirituality. It remains one of the most widely read Islamic books worldwide.' },
      { heading: 'Al-Arba\'in An-Nawawiya', text: 'His collection of 40 hadith, known as Al-Arba\'in An-Nawawiya, contains fundamental hadith that cover the essential aspects of Islamic belief and practice. This work is studied in Islamic schools worldwide.' },
      { heading: 'Sharh Sahih Muslim', text: 'He wrote a comprehensive commentary on Sahih Muslim, one of the most authentic collections of hadith. This commentary is considered one of the most important works in hadith scholarship.' },
      { heading: 'Al-Minhaj fi Sharh Sahih Muslim', text: 'This detailed commentary on Sahih Muslim demonstrates his deep understanding of hadith sciences and Islamic jurisprudence. It remains a reference work for scholars today.' },
      { heading: 'Kitab al-Adhkar', text: 'His work on supplications and remembrances (dhikr) is a comprehensive guide to the various forms of worship and remembrance in Islam, based on authentic hadith.' },
      { heading: 'Shafi\'i Jurisprudence', text: 'As a leading Shafi\'i jurist, he wrote extensively on Islamic law. His works in fiqh are still studied in Shafi\'i madhhabs worldwide and have influenced Islamic legal thought.' },
      { heading: 'Asceticism & Piety', text: 'Imam An-Nawawi was known for his extreme asceticism and piety. He lived a simple life, devoted entirely to worship and scholarship, and was known for his humility and detachment from worldly matters.' },
      { heading: 'Teaching & Students', text: 'He taught numerous students who went on to become prominent scholars themselves. His teaching methods and scholarly approach influenced generations of Islamic scholars.' },
      { heading: 'Death & Legacy', text: 'Imam An-Nawawi died in 676 AH (1277 CE) at the young age of 45. Despite his short life, he left behind a legacy of scholarly works that continue to benefit Muslims worldwide.' },
      { heading: 'Recognition as Shaykh al-Islam', text: 'He was recognized as "Shaykh al-Islam" during his lifetime, a title given to the most prominent Islamic scholars. His works are considered authoritative in the Islamic scholarly tradition.' },
      { heading: 'Influence on Islamic Scholarship', text: 'His works have been translated into numerous languages and continue to be studied in Islamic institutions worldwide. His methodology in hadith criticism and Islamic jurisprudence remains influential.' },
      { heading: 'Continuing Relevance', text: 'Imam An-Nawawi\'s works remain essential reading for students of Islamic studies. His Riyadh as-Salihin is particularly popular for its practical guidance on Islamic ethics and spirituality.' }
    ],
  },
  {
    id: 'ibn_kathir',
    name: 'Ibn Kathir (R.A)',
    title: 'Mufassir & Historian',
    bio: 'Abu al-Fida\' Isma\'il ibn \'Umar ibn Kathir (1300-1373) was a renowned Islamic scholar, mufassir (Qur\'an commentator), and historian. He is best known for his Tafsir Ibn Kathir and his historical work Al-Bidayah wa al-Nihayah.',
    specialties: ['Tafsir', 'History', 'Hadith', 'Fiqh', 'Shafi\'i School'],
    details: [
      { heading: 'Birth & Early Life', text: 'Ibn Kathir was born in 700 AH (1300 CE) in the city of Busra, Syria. His father died when he was young, and he was raised by his brother, who was also a scholar.' },
      { heading: 'Education in Damascus', text: 'He moved to Damascus at a young age to pursue Islamic education. He studied under prominent scholars including Ibn Taymiyyah, who had a significant influence on his intellectual development.' },
      { heading: 'Relationship with Ibn Taymiyyah', text: 'Ibn Kathir was a close student of Ibn Taymiyyah and was influenced by his approach to Islamic scholarship. However, he maintained his own independent scholarly voice and methodology.' },
      { heading: 'Tafsir Ibn Kathir', text: 'His most famous work is his comprehensive commentary on the Qur\'an, known as Tafsir Ibn Kathir. This work is considered one of the most authoritative and widely used tafsir works in the Islamic world.' },
      { heading: 'Methodology in Tafsir', text: 'Ibn Kathir\'s tafsir methodology emphasizes interpreting the Qur\'an through the Qur\'an itself, then through authentic hadith, and finally through the statements of the Companions and early scholars.' },
      { heading: 'Al-Bidayah wa al-Nihayah', text: 'His historical work, Al-Bidayah wa al-Nihayah (The Beginning and the End), is a comprehensive history of the world from creation to his own time. It remains an important source for Islamic history.' },
      { heading: 'Hadith Scholarship', text: 'Ibn Kathir was also a prominent hadith scholar. He wrote extensively on hadith sciences and was known for his expertise in distinguishing authentic from weak hadith.' },
      { heading: 'Fiqh and Islamic Law', text: 'As a Shafi\'i jurist, he wrote on Islamic jurisprudence and legal principles. His works in fiqh demonstrate his deep understanding of Islamic law and its application.' },
      { heading: 'Teaching Career', text: 'He taught at various institutions in Damascus and had many students who went on to become prominent scholars. His teaching covered tafsir, hadith, history, and Islamic jurisprudence.' },
      { heading: 'Works on Prophetic Biography', text: 'He wrote extensively on the life of the Prophet Muhammad, including his famous work on the Prophetic biography (sirah), which is considered one of the most comprehensive accounts of the Prophet\'s life.' },
      { heading: 'Scholarly Approach', text: 'Ibn Kathir was known for his balanced and scholarly approach to Islamic studies. He combined traditional Islamic scholarship with critical analysis and historical methodology.' },
      { heading: 'Influence on Later Scholars', text: 'His works have influenced countless Islamic scholars throughout history. His tafsir methodology is still taught in Islamic institutions worldwide.' },
      { heading: 'Death & Burial', text: 'Ibn Kathir died in 774 AH (1373 CE) in Damascus. He was buried in the Sufiyya cemetery, and his grave remains a place of visitation for scholars and students.' },
      { heading: 'Legacy in Islamic Scholarship', text: 'His works continue to be studied and referenced by Islamic scholars worldwide. His tafsir is particularly popular for its accessibility and comprehensive coverage of Qur\'anic interpretation.' },
      { heading: 'Modern Relevance', text: 'Ibn Kathir\'s works have been translated into numerous languages and remain essential reading for students of Islamic studies. His historical works provide valuable insights into Islamic civilization and history.' }
    ],
  },
  {
    id: 'imam_al_ghazali',
    name: 'Imam Al-Ghazali (R.A)',
    title: 'Hujjat al-Islam & Theologian',
    bio: 'Abu Hamid Muhammad ibn Muhammad al-Ghazali (1058-1111) was a Persian Islamic theologian, jurist, philosopher, and mystic. Known as "Hujjat al-Islam" (Proof of Islam), he is considered one of the most influential Islamic scholars in history.',
    specialties: ['Aqidah', 'Tasawwuf', 'Philosophy', 'Fiqh', 'Shafi\'i School', 'Theology'],
    details: [
      { heading: 'Birth & Early Life', text: 'Imam Al-Ghazali was born in 450 AH (1058 CE) in Tus, Khorasan (present-day Iran). His father was a wool spinner, and the family was of modest means but pious and learned.' },
      { heading: 'Education in Tus', text: 'He received his early education in Tus, studying Arabic, Qur\'an, and basic Islamic sciences. His father died when he was young, leaving him and his brother Ahmad in the care of a Sufi friend.' },
      { heading: 'Studies in Nishapur', text: 'He moved to Nishapur to study under the famous scholar Imam al-Haramayn al-Juwayni, who was the leading Ash\'ari theologian of his time. This period shaped his theological and philosophical thinking.' },
      { heading: 'Appointment at Nizamiyya', text: 'In 1091, he was appointed as a professor at the prestigious Nizamiyya madrasa in Baghdad by the Seljuk vizier Nizam al-Mulk. This position brought him great fame and influence in the Islamic world.' },
      { heading: 'Spiritual Crisis', text: 'Despite his academic success, Al-Ghazali experienced a profound spiritual crisis in 1095. He questioned the value of his scholarly pursuits and felt a deep need for spiritual fulfillment.' },
      { heading: 'Renunciation & Travel', text: 'He left his position at the Nizamiyya and embarked on a period of spiritual retreat and travel. He spent time in Damascus, Jerusalem, and Mecca, engaging in intensive spiritual practices and reflection.' },
      { heading: 'Ihya Ulum al-Din', text: 'During this period, he wrote his masterpiece, Ihya Ulum al-Din (The Revival of the Religious Sciences), a comprehensive work on Islamic spirituality and ethics that remains one of the most influential Islamic books ever written.' },
      { heading: 'Return to Teaching', text: 'After his spiritual journey, he returned to teaching but with a renewed focus on the inner dimensions of Islam. He taught at various institutions and continued to write extensively on Islamic spirituality.' },
      { heading: 'Tahafut al-Falasifa', text: 'He wrote Tahafut al-Falasifa (The Incoherence of the Philosophers), a critical examination of Islamic philosophy, particularly the works of Ibn Sina and Al-Farabi. This work had a significant impact on Islamic philosophical thought.' },
      { heading: 'Al-Munqidh min al-Dalal', text: 'His spiritual autobiography, Al-Munqidh min al-Dalal (Deliverance from Error), provides insights into his intellectual and spiritual journey and remains a classic of Islamic literature.' },
      { heading: 'Synthesis of Knowledge', text: 'Al-Ghazali successfully synthesized various branches of Islamic knowledge, including theology, philosophy, jurisprudence, and mysticism. His approach influenced Islamic scholarship for centuries.' },
      { heading: 'Influence on Islamic Thought', text: 'His works had a profound impact on Islamic intellectual history. He is credited with reconciling Islamic theology with Sufism and establishing a balanced approach to Islamic spirituality.' },
      { heading: 'Legacy in Education', text: 'His educational philosophy emphasized the importance of combining intellectual knowledge with spiritual development. This approach influenced Islamic education systems throughout the Muslim world.' },
      { heading: 'Death & Burial', text: 'Imam Al-Ghazali died in 505 AH (1111 CE) in Tus. He was buried in his hometown, and his grave remains a place of visitation for scholars and spiritual seekers.' },
      { heading: 'Modern Relevance', text: 'His works continue to be studied in Islamic institutions worldwide. His approach to combining intellectual rigor with spiritual depth remains relevant for contemporary Islamic scholarship and practice.' }
    ],
  },
];

export default function ScholarsScreen({ navigation }: any) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<Scholar | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const onOpen = (item: Scholar) => {
    navigation.navigate('ScholarDetail', { scholar: item });
  };

  const onImagePress = (image: any) => {
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  const filteredScholars = SCHOLARS.filter(scholar => 
    scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholar.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholar.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const renderItem = ({ item }: { item: Scholar }) => (
    <TouchableOpacity style={styles.card} onPress={() => onOpen(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.tag}><Text style={styles.tagText}>{item.title}</Text></View>
      </View>
      {!!item.image && (
        <TouchableOpacity onPress={() => onImagePress(item.image)}>
        <Image source={item.image} style={styles.thumb} resizeMode="cover" />
        </TouchableOpacity>
      )}
      <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
      <View style={styles.chips}>
        {item.specialties.map(s => (
          <View key={s} style={styles.chip}><Text style={styles.chipText}>{s}</Text></View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
        <Text style={styles.headerTitle}>{t('scholars.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('scholars.subtitle')}</Text>
        
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('scholars.search_placeholder')}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <FlatList
        data={filteredScholars}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No scholars found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search terms</Text>
          </View>
        }
      />

      {/* Detail handled via dedicated screen */}

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
            onPress={() => setImageModalVisible(false)}
          >
            <View style={styles.imageModalContent}>
              <TouchableOpacity 
                style={styles.imageModalCloseButton}
                onPress={() => setImageModalVisible(false)}
              >
                <Ionicons name="close" size={30} color="#FFFFFF" />
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.textPrimary },
  headerSubtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 4 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.mintSurface,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 4,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  tag: { backgroundColor: colors.mintSurface, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  tagText: { color: colors.textDark, fontSize: 12, fontWeight: '600' },
  thumb: { marginTop: 10, width: '100%', height: 140, borderRadius: 10 },
  bio: { color: colors.textSecondary, marginTop: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  chip: { backgroundColor: colors.mintSurface, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 6 },
  chipText: { color: colors.textDark, fontSize: 12, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '92%', backgroundColor: colors.surface, borderRadius: 16, padding: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  modalSubtitle: { color: colors.textSecondary, marginBottom: 8 },
  hero: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12 },
  section: { backgroundColor: colors.mintSurface, borderRadius: 12, padding: 12, marginBottom: 10 },
  modalTextTitle: { color: colors.textPrimary, fontWeight: '700', marginTop: 12 },
  sectionTitle: { color: colors.textDark, fontWeight: '800', marginBottom: 6 },
  modalText: { color: colors.textPrimary, lineHeight: 20 },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalCloseArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalContent: {
    width: '95%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageModalCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
});
