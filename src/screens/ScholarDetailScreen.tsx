import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Animated, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';

export default function ScholarDetailScreen({ route }: any) {
  const { t, language } = useLanguage();
  const { scholar } = route.params as { scholar: any };
  const fade = new Animated.Value(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  React.useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const onImagePress = (image: any) => {
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  const getTimelineData = (scholarId: string) => {
    switch (scholarId) {
      case 'sukayrij':
        return [
          {
            year: '1878',
            title: 'Birth',
            description: 'Born in Fes, Morocco',
            icon: 'person'
          },
          {
            year: '1914',
            title: 'Government Service',
            description: 'Appointed Supervisor of waqf property in Fes',
            icon: 'business'
          },
          {
            year: '1937',
            title: 'Meeting with Shaykh Ibrahim',
            description: 'Met Shaykh Ibrahim Niasse in Morocco and gave him ijaza',
            icon: 'people'
          },
          {
            year: '1944',
            title: 'Passing',
            description: 'Passed away in Marrakech, buried in Qadi `Iyad\'s mausoleum',
            icon: 'heart'
          }
        ];
      case 'maikano':
        return [
          {
            year: '1926',
            title: 'Birth',
            description: 'Born on July 16th in Aborso-Ghana',
            icon: 'person'
          },
          {
            year: '1946',
            title: 'Spreading Tijaniyya',
            description: 'Started spreading the wings of Tariqatu Tijaniyya in Ghana',
            icon: 'business'
          },
          {
            year: '1948',
            title: 'First Visit to Kaolack',
            description: 'Visited Maulana Sheikh Ibrahim Niasse (RA) in Kaolack with the "Big Nine"',
            icon: 'airplane'
          },
          {
            year: '2005',
            title: 'Passing',
            description: 'Passed away on September 12th in Aborso-Ghana (Aged 77)',
            icon: 'heart'
          }
        ];
      default:
        return [];
    }
  };

  const getKeyInformation = (scholarId: string) => {
    switch (scholarId) {
      case 'sukayrij':
        return {
          born: '1878',
          passed: '1944 (Aged 66)',
          location: 'Fes, Morocco',
          works: '160+ works',
          ijazas: '600+ diplomas'
        };
      case 'maikano':
        return {
          born: 'July 16, 1926',
          passed: 'September 12, 2005 (Aged 77)',
          location: 'Aborso-Ghana',
          works: 'Multiple contributions',
          ijazas: 'Various teachings'
        };
      default:
        return {
          born: 'Unknown',
          passed: 'Unknown',
          location: 'Unknown',
          works: 'Various',
          ijazas: 'Multiple'
        };
    }
  };

  const getFamilyInfo = (scholarId: string) => {
    switch (scholarId) {
      case 'sukayrij':
        return {
          showFamily: false,
          title: 'Academic Legacy',
          content: 'Shaykh Sukayrij was known for his scholarly contributions and had numerous students including Sultan Mawlay `Abdul Hafiz of Morocco.'
        };
      case 'maikano':
        return {
          showFamily: true,
          title: 'Family',
          content: 'A sincere family man with four wives and many children, including notable scholars and leaders in the Tijaniyya tradition.'
        };
      default:
        return {
          showFamily: false,
          title: 'Legacy',
          content: 'This scholar made significant contributions to Islamic knowledge and the Tijaniyya tradition.'
        };
    }
  };

  const timelineData = getTimelineData(scholar?.id);

  // Heuristically extract key information from provided details/bio
  const extractKeyInformation = (s: any) => {
    const info: any = {};
    const details: Array<{ heading: string; text: string }> = Array.isArray(s?.details) ? s.details : [];
    const allText = [s?.bio, ...details.map(d => `${d.heading}: ${d.text}`)].filter(Boolean).join('\n');

    const toPlain = (val?: string) => (val || '').trim();

    // Born
    const birthHeading = details.find(d => /birth|born/i.test(d.heading || ''));
    if (birthHeading) {
      info.born = toPlain(birthHeading.text)
        .replace(/^\s*[-–—]\s*/, '')
        .split('\n')[0];
    } else {
      const m = allText.match(/born (?:in|at)\s+([^.,\n]+)[,\s]*(?:on|in)?\s*([^\n\.]*)/i);
      if (m) info.born = `${m[2] ? m[2].trim() + ' — ' : ''}${m[1].trim()}`;
    }

    // Passed Away / Death
    const deathHeading = details.find(d => /(passing|passed|death|died)/i.test(d.heading || ''));
    if (deathHeading) {
      info.passed = toPlain(deathHeading.text).split('\n')[0];
    } else {
      const dm = allText.match(/(passed away|died)\s*(?:in|on)?\s*([^\n\.]*)/i);
      if (dm) info.passed = dm[2].trim();
    }

    // Main Location / Burial
    const locationHeading = details.find(d => /location|burial|buried|residence|fes|fez|medina|mecca|makkah|tunis|algiers|kaolack/i.test((d.heading||'') + ' ' + (d.text||'')));
    if (locationHeading) {
      const lm = locationHeading.text.match(/in\s+([^.,\n]+)/i);
      info.location = toPlain(lm ? lm[1] : locationHeading.text.split('\n')[0]);
    } else {
      const lm2 = allText.match(/buried in\s+([^.,\n]+)/i) || allText.match(/resided in\s+([^.,\n]+)/i);
      if (lm2) info.location = lm2[1].trim();
    }

    // Works
    const worksHeading = details.find(d => /works|author|authored|jawahir|books|wrote/i.test((d.heading||'') + ' ' + (d.text||'')));
    if (worksHeading) {
      info.works = toPlain(worksHeading.text).split('\n')[0];
    }

    // Roles / Titles
    const rolesHeading = details.find(d => /khalifa|imam|qutb|shaykh al-islam|renewer/i.test((d.heading||'') + ' ' + (d.text||'')));
    if (rolesHeading) {
      info.roles = toPlain(rolesHeading.text).split('\n')[0];
    } else if (s?.title) {
      info.roles = toPlain(s.title);
    }

    return info;
  };

  const keyInfo = extractKeyInformation(scholar);
  const familyInfo = getFamilyInfo(scholar?.id);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
        <Text style={styles.headerTitle}>{scholar?.name}</Text>
        <Text style={styles.headerSubtitle}>{scholar?.title}</Text>
      </LinearGradient>

      <Animated.View style={{ flex: 1, opacity: fade }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {!!scholar?.image && (
            <TouchableOpacity onPress={() => onImagePress(scholar.image)}>
              <Image source={scholar.image} style={styles.hero} resizeMode="cover" />
            </TouchableOpacity>
          )}

          {scholar?.bio ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t('scholar_detail.biography')}</Text>
              <Text style={styles.cardText}>
                {language === 'fr' && scholar.frenchBio ? scholar.frenchBio :
                 language === 'ar' && scholar.arabicBio ? scholar.arabicBio :
                 language === 'ha' && scholar.hausaBio ? scholar.hausaBio :
                 scholar.bio}
              </Text>
            </View>
          ) : null}

          {Array.isArray(scholar?.details) && scholar.details.map((d: any, idx: number) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.cardTitle}>{d.heading}</Text>
              <Text style={styles.cardText}>{d.text}</Text>
            </View>
          ))}

          {/* Timeline Card */}
          {timelineData.length > 0 && (
            <View style={styles.cardAlt}>
              <Text style={styles.cardTitle}>{t('scholar_detail.details')}</Text>
              <View style={styles.timeline}>
                {timelineData.map((item, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineIcon}>
                      <Ionicons name={item.icon as any} size={16} color={colors.textPrimary} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineYear}>{item.year}</Text>
                      <Text style={styles.timelineTitle}>{item.title}</Text>
                      <Text style={styles.timelineDescription}>{item.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Key Information Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Key Information</Text>
            <View style={styles.infoGrid}>
              {keyInfo.born && (
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons name="calendar" size={16} color={colors.accentTeal} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Born</Text>
                    <Text style={styles.infoValue}>{keyInfo.born}</Text>
                  </View>
                </View>
              )}
              {keyInfo.passed && (
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons name="heart" size={16} color={colors.accentTeal} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Passed Away</Text>
                    <Text style={styles.infoValue}>{keyInfo.passed}</Text>
                  </View>
                </View>
              )}
              {keyInfo.location && (
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons name="location" size={16} color={colors.accentTeal} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>{keyInfo.location}</Text>
                  </View>
                </View>
              )}
              {keyInfo.works && (
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons name="book" size={16} color={colors.accentTeal} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Works</Text>
                    <Text style={styles.infoValue}>{keyInfo.works}</Text>
                  </View>
                </View>
              )}
              {keyInfo.roles && (
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons name="ribbon" size={16} color={colors.accentTeal} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Role</Text>
                    <Text style={styles.infoValue}>{keyInfo.roles}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Family/Legacy Card */}
          <View style={styles.familyCard}>
            <View style={styles.familyHeader}>
              <Ionicons name={familyInfo.showFamily ? "people" : "star"} size={20} color={colors.accentTeal} />
              <Text style={styles.familyTitle}>{familyInfo.title}</Text>
            </View>
            {familyInfo.showFamily ? (
              <>
                <View style={styles.familyContent}>
                  <View style={styles.familySection}>
                    <Text style={styles.familySectionTitle}>Wives</Text>
                    <Text style={styles.familySectionValue}>4</Text>
                  </View>
                  <View style={styles.familyDivider} />
                  <View style={styles.familySection}>
                    <Text style={styles.familySectionTitle}>Children</Text>
                    <Text style={styles.familySectionValue}>14+</Text>
                  </View>
                </View>
                <View style={styles.familyDetails}>
                  <Text style={styles.familyDetailsTitle}>Notable Children:</Text>
                  <View style={styles.childrenList}>
                    <Text style={styles.childName}>• Sheikh Ahmad Abdul Faide (Khalifa)</Text>
                    <Text style={styles.childName}>• Sheikh Muhammad Nasurullah</Text>
                    <Text style={styles.childName}>• Sheikh Aliu Kalaamullah</Text>
                    <Text style={styles.childName}>• Sheikh Ibrahim Niasse</Text>
                    <Text style={styles.childName}>• Sheikh Ahmad Tijani</Text>
                    <Text style={styles.childName}>• Sheikh Ridwaanullah</Text>
                    <Text style={styles.childName}>• Sayyada Naamau</Text>
                    <Text style={styles.childName}>• Sayyada Ayaa</Text>
                    <Text style={styles.childName}>• Sayyada Maryam</Text>
                    <Text style={styles.childName}>• And others...</Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.familyDetails}>
                <Text style={styles.familyDetailsTitle}>{familyInfo.content}</Text>
              </View>
            )}
          </View>

          {Array.isArray(scholar?.specialties) && (
            <View style={styles.cardAlt}>
              <Text style={styles.cardTitle}>Specialties</Text>
              <View style={styles.chips}>
                {scholar.specialties.map((s: string) => (
                  <View key={s} style={styles.chip}><Text style={styles.chipText}>{s}</Text></View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </Animated.View>

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
  headerTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: colors.textSecondary, marginTop: 4 },
  hero: { width: '100%', height: 220, borderRadius: 16, marginBottom: 14 },
  card: { backgroundColor: colors.mintSurface, borderRadius: 14, padding: 14, marginBottom: 12 },
  cardAlt: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 12 },
  cardTitle: { color: colors.textDark, fontWeight: '800', marginBottom: 8, fontSize: 16 },
  cardText: { color: colors.textDark, lineHeight: 22 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  chip: { backgroundColor: colors.accentTeal, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginRight: 6, marginBottom: 6 },
  chipText: { color: colors.textPrimary, fontWeight: '700', fontSize: 12 },
  
  // Timeline styles
  timeline: { marginTop: 8 },
  timelineItem: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start' },
  timelineIcon: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: colors.accentTeal, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2
  },
  timelineContent: { flex: 1 },
  timelineYear: { color: colors.accentTeal, fontWeight: '700', fontSize: 14, marginBottom: 2 },
  timelineTitle: { color: colors.textPrimary, fontWeight: '600', fontSize: 15, marginBottom: 4 },
  timelineDescription: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  
  // Key Information styles
  infoGrid: { marginTop: 8 },
  infoItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.mintSurfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  infoContent: { flex: 1 },
  infoLabel: { color: colors.textDark, fontWeight: '600', fontSize: 14, marginBottom: 2 },
  infoValue: { color: colors.textDark, fontWeight: '500', fontSize: 14 },
  
  // Family Card styles
  familyCard: { 
    backgroundColor: colors.surface, 
    borderRadius: 14, 
    padding: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.accentTeal + '20'
  },
  familyHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  familyTitle: { 
    color: colors.textPrimary, 
    fontWeight: '800', 
    fontSize: 18, 
    marginLeft: 8 
  },
  familyContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 16,
    backgroundColor: colors.mintSurface,
    borderRadius: 12,
    padding: 16
  },
  familySection: { 
    alignItems: 'center' 
  },
  familySectionTitle: { 
    color: colors.textDark, 
    fontWeight: '600', 
    fontSize: 14, 
    marginBottom: 4 
  },
  familySectionValue: { 
    color: colors.accentTeal, 
    fontWeight: '800', 
    fontSize: 24 
  },
  familyDivider: { 
    width: 1, 
    backgroundColor: colors.divider, 
    marginHorizontal: 16 
  },
  familyDetails: { 
    marginTop: 8 
  },
  familyDetailsTitle: { 
    color: colors.textPrimary, 
    fontWeight: '700', 
    fontSize: 15, 
    marginBottom: 8 
  },
  childrenList: { 
    paddingLeft: 8 
  },
  childName: { 
    color: colors.textSecondary, 
    fontSize: 13, 
    lineHeight: 20, 
    marginBottom: 2 
  },
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


