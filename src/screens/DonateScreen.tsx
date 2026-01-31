import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Linking,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useFadeIn } from '../hooks/useAnimations';

export default function DonateScreen() {
  const { t } = useLanguage();
  const opacity = useFadeIn({ duration: 400 });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    amount: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitReceipt = () => {
    if (!formData.fullName || !formData.email || !formData.amount) {
      Alert.alert(t('common.error'), 'Please fill in all required fields.');
      return;
    }
    Alert.alert(t('common.success'), t('donate.thank_you'));
  };

  const openWhatsApp = () => {
    const phoneNumber = '+233558415813';
    const message = 'Hello! I need help with my donation receipt.';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert(t('common.error'), 'WhatsApp is not installed on this device.');
    });
  };

  const copyToClipboard = (text: string) => {
    // In a real app, you'd use Clipboard.setString(text)
    Alert.alert('Copied', `${text} copied to clipboard`);
  };

  return (
    <Animated.View style={[styles.container, { opacity }]}>
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
        <Text style={styles.headerTitle}>{t('donate.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('donate.subtitle')}</Text>
      </LinearGradient>

      {/* Mobile Money Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Donate via Mobile Money (Ghana)</Text>
        <Text style={styles.sectionSubtitle}>{t('donate.subtitle')}</Text>
        
        {/* MTN */}
        <View style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <View style={[styles.paymentIcon, { backgroundColor: '#FFC107' }]}>
              <Text style={styles.paymentIconText}>MTN</Text>
            </View>
            <Text style={styles.paymentTitle}>{t('donate.mtn_mobile')}</Text>
          </View>
          <View style={styles.paymentDetails}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Number:</Text>
              <TouchableOpacity onPress={() => copyToClipboard('0542872101')}>
                <Text style={styles.paymentValue}>0542872101</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Name:</Text>
              <Text style={styles.paymentValue}>IYISHATU AWUDU</Text>
            </View>
          </View>
        </View>

        {/* Airtel/Tigo */}
        <View style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <View style={[styles.paymentIcon, { backgroundColor: '#E30613' }]}>
              <Text style={styles.paymentIconText}>AT</Text>
            </View>
            <Text style={styles.paymentTitle}>{t('donate.airtel_tigo')}</Text>
          </View>
          <View style={styles.paymentDetails}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Number:</Text>
              <TouchableOpacity onPress={() => copyToClipboard('0268856620')}>
                <Text style={styles.paymentValue}>0268856620</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Name:</Text>
              <Text style={styles.paymentValue}>IYISHATU AWUDU</Text>
            </View>
          </View>
        </View>

        <View style={styles.referenceCard}>
          <Text style={styles.referenceLabel}>{t('donate.reference')}:</Text>
          <TouchableOpacity onPress={() => copyToClipboard('Tijaniya App Support')}>
            <Text style={styles.referenceValue}>Tijaniya App Support</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SHEIKH ABDULLAHI MAIKANO EDUCATIONAL COMPLEX Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SHEIKH ABDULLAHI MAIKANO EDUCATIONAL COMPLEX</Text>
        <Text style={styles.sectionSubtitle}>Supporting educational development and Islamic learning</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/SHEIKH ABDULLAHI MAIKANO EDUCATIONAL COMPLEX1.jpg')} 
            style={styles.educationalImage}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/SHEIKH ABDULLAHI MAIKANO EDUCATIONAL COMPLEX2.jpg')} 
            style={styles.educationalImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Procedure to Donate Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Procedure to Donate</Text>
        <Text style={styles.sectionSubtitle}>Follow these simple steps to make your donation</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/proceedure.jpg')} 
            style={styles.procedureImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Bank Account Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Account Details</Text>
        <Text style={styles.sectionSubtitle}>Alternative banking options for your donations</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/bankaccount.jpg')} 
            style={styles.bankImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Help Section */}
      <View style={styles.section}>
        <View style={styles.helpCard}>
          <Ionicons name="help-circle" size={24} color={colors.accentTeal} />
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpSubtitle}>WhatsApp us:</Text>
            <TouchableOpacity onPress={openWhatsApp}>
              <Text style={styles.helpNumber}>+233 558415813</Text>
            </TouchableOpacity>
            <Text style={styles.helpNote}>After payment, upload your receipt (PDF/JPG) or contact us via WhatsApp</Text>
          </View>
        </View>
      </View>

      {/* Receipt Submission Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Submit Payment Receipt</Text>
        <Text style={styles.sectionSubtitle}>Upload your payment receipt to help us track your donation</Text>
        
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
              value={formData.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount Donated (GHS) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={formData.amount}
              onChangeText={(text) => handleInputChange('amount', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Payment Receipt *</Text>
            <TouchableOpacity style={styles.fileUpload}>
              <Ionicons name="cloud-upload" size={20} color={colors.accentTeal} />
              <Text style={styles.fileUploadText}>No file chosen</Text>
            </TouchableOpacity>
            <Text style={styles.fileUploadNote}>Accepted formats: PDF, JPG, PNG (Max 10MB)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Message (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any message for us..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              value={formData.message}
              onChangeText={(text) => handleInputChange('message', text)}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReceipt}>
            <LinearGradient colors={[colors.accentTeal, colors.accentGreen]} style={styles.submitGradient}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.submitButtonText}>Submit Receipt</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark" size={16} color={colors.accentGreen} />
            <Text style={styles.securityText}>Secure & Private - Your payment information is secure and will only be used to verify your donation. We never store sensitive financial data.</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 8 },
  headerSubtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  
  section: { padding: 20 },
  sectionTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  sectionSubtitle: { color: colors.textSecondary, fontSize: 14, marginBottom: 16, lineHeight: 20 },
  
  paymentCard: { 
    backgroundColor: colors.surface, 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.divider
  },
  paymentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  paymentIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  paymentIconText: { color: 'white', fontWeight: '700', fontSize: 12 },
  paymentTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  paymentDetails: { paddingLeft: 52 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  paymentLabel: { color: colors.textSecondary, fontSize: 14 },
  paymentValue: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  
  referenceCard: { 
    backgroundColor: colors.mintSurface, 
    borderRadius: 12, 
    padding: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  referenceLabel: { color: colors.textDark, fontSize: 14, fontWeight: '600' },
  referenceValue: { color: colors.textDark, fontSize: 14, fontWeight: '700' },
  
  helpCard: { 
    backgroundColor: colors.surface, 
    borderRadius: 12, 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'flex-start' 
  },
  helpContent: { flex: 1, marginLeft: 12 },
  helpTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  helpSubtitle: { color: colors.textSecondary, fontSize: 14, marginBottom: 4 },
  helpNumber: { color: colors.accentTeal, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  helpNote: { color: colors.textSecondary, fontSize: 12, lineHeight: 16 },
  
  formCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 16 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { color: colors.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { 
    backgroundColor: colors.background, 
    borderRadius: 8, 
    padding: 12, 
    color: colors.textPrimary, 
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.divider
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  
  fileUpload: { 
    backgroundColor: colors.background, 
    borderRadius: 8, 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1,
    borderColor: colors.divider,
    borderStyle: 'dashed'
  },
  fileUploadText: { color: colors.textSecondary, marginLeft: 8, fontSize: 14 },
  fileUploadNote: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  
  submitButton: { marginTop: 8, marginBottom: 16 },
  submitGradient: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 16, 
    borderRadius: 8 
  },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  
  securityNote: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    backgroundColor: colors.mintSurface, 
    padding: 12, 
    borderRadius: 8 
  },
  securityText: { 
    color: colors.textDark, 
    fontSize: 12, 
    lineHeight: 16, 
    marginLeft: 8, 
    flex: 1 
  },
  
  // Image section styles
  imageContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  educationalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  procedureImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  bankImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
});