import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';

interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  purpose: 'general' | 'education' | 'mosque' | 'charity' | 'events';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'mobile_money' | 'crypto';
  transactionId: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
  donorLocation?: string;
}

const AdminDonationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPurpose, setFilterPurpose] = useState<string>('all');
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalDonations: 0,
    pendingAmount: 0,
    completedAmount: 0,
  });

  const purposes = [
    { value: 'general', label: 'General Fund', color: '#2196F3' },
    { value: 'education', label: 'Education', color: '#4CAF50' },
    { value: 'mosque', label: 'Mosque Building', color: '#FF9800' },
    { value: 'charity', label: 'Charity', color: '#E91E63' },
    { value: 'events', label: 'Events', color: '#9C27B0' },
  ];

  const statuses = [
    { value: 'pending', label: 'Pending', color: '#FF9800' },
    { value: 'completed', label: 'Completed', color: '#4CAF50' },
    { value: 'failed', label: 'Failed', color: '#F44336' },
    { value: 'refunded', label: 'Refunded', color: '#9E9E9E' },
  ];

  const paymentMethods = [
    { value: 'card', label: 'Credit/Debit Card', icon: 'card' },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: 'business' },
    { value: 'mobile_money', label: 'Mobile Money', icon: 'phone-portrait' },
    { value: 'crypto', label: 'Cryptocurrency', icon: 'logo-bitcoin' },
  ];

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      // TODO: Replace with actual API call
      const mockDonations: Donation[] = [
        {
          id: '1',
          donorName: 'Ahmad Ibrahim',
          donorEmail: 'ahmad@example.com',
          amount: 50000,
          currency: 'NGN',
          purpose: 'education',
          status: 'completed',
          paymentMethod: 'card',
          transactionId: 'TXN_001_2024',
          createdAt: '2024-01-15T10:00:00Z',
          completedAt: '2024-01-15T10:05:00Z',
          notes: 'Donation for school building project',
          donorLocation: 'Kano, Nigeria',
        },
        {
          id: '2',
          donorName: 'Fatima Aliyu',
          donorEmail: 'fatima@example.com',
          amount: 25000,
          currency: 'NGN',
          purpose: 'mosque',
          status: 'pending',
          paymentMethod: 'bank_transfer',
          transactionId: 'TXN_002_2024',
          createdAt: '2024-01-20T14:30:00Z',
          notes: 'Monthly contribution for mosque maintenance',
          donorLocation: 'Lagos, Nigeria',
        },
        {
          id: '3',
          donorName: 'Sheikh Muhammad',
          donorEmail: 'sheikh@example.com',
          amount: 100000,
          currency: 'USD',
          purpose: 'charity',
          status: 'completed',
          paymentMethod: 'mobile_money',
          transactionId: 'TXN_003_2024',
          createdAt: '2024-01-18T09:15:00Z',
          completedAt: '2024-01-18T09:20:00Z',
          notes: 'Emergency relief fund',
          donorLocation: 'Kaolack, Senegal',
        },
      ];
      setDonations(mockDonations);
      calculateStats(mockDonations);
    } catch (error) {
      console.error('Error loading donations:', error);
    }
  };

  const calculateStats = (donationList: Donation[]) => {
    const totalAmount = donationList.reduce((sum, donation) => sum + donation.amount, 0);
    const pendingAmount = donationList
      .filter(d => d.status === 'pending')
      .reduce((sum, donation) => sum + donation.amount, 0);
    const completedAmount = donationList
      .filter(d => d.status === 'completed')
      .reduce((sum, donation) => sum + donation.amount, 0);

    setStats({
      totalAmount,
      totalDonations: donationList.length,
      pendingAmount,
      completedAmount,
    });
  };

  const handleStatusUpdate = (id: string, newStatus: Donation['status']) => {
    Alert.alert(
      'Update Status',
      `Are you sure you want to change the status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async () => {
            try {
              setDonations(prev => {
                const updated = prev.map(donation => 
                  donation.id === id 
                    ? { 
                        ...donation, 
                        status: newStatus,
                        completedAt: newStatus === 'completed' ? new Date().toISOString() : donation.completedAt
                      }
                    : donation
                );
                calculateStats(updated);
                return updated;
              });
              Alert.alert('Success', 'Donation status updated successfully');
            } catch (error) {
              console.error('Error updating donation status:', error);
              Alert.alert('Error', 'Failed to update donation status');
            }
          },
        },
      ]
    );
  };

  const handleRefund = (id: string) => {
    Alert.alert(
      'Process Refund',
      'Are you sure you want to process a refund for this donation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Refund',
          style: 'destructive',
          onPress: async () => {
            try {
              setDonations(prev => {
                const updated = prev.map(donation => 
                  donation.id === id 
                    ? { ...donation, status: 'refunded' as Donation['status'] }
                    : donation
                );
                calculateStats(updated);
                return updated;
              });
              Alert.alert('Success', 'Refund processed successfully');
            } catch (error) {
              console.error('Error processing refund:', error);
              Alert.alert('Error', 'Failed to process refund');
            }
          },
        },
      ]
    );
  };

  const getPurposeInfo = (purpose: string) => {
    return purposes.find(p => p.value === purpose) || purposes[0];
  };

  const getStatusInfo = (status: string) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const getPaymentMethodInfo = (method: string) => {
    return paymentMethods.find(m => m.value === method) || paymentMethods[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         donation.donorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         donation.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || donation.status === filterStatus;
    const matchesPurpose = filterPurpose === 'all' || donation.purpose === filterPurpose;
    
    return matchesSearch && matchesStatus && matchesPurpose;
  });

  const renderStatsCard = (title: string, value: string, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <Ionicons name={icon as any} size={24} color={color} />
        <View style={styles.statText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{title}</Text>
        </View>
      </View>
    </View>
  );

  const renderDonation = (donation: Donation) => {
    const purposeInfo = getPurposeInfo(donation.purpose);
    const statusInfo = getStatusInfo(donation.status);
    const paymentInfo = getPaymentMethodInfo(donation.paymentMethod);

    return (
      <TouchableOpacity
        key={donation.id}
        style={styles.donationItem}
        onPress={() => {
          setSelectedDonation(donation);
          setShowDetailsModal(true);
        }}
      >
        <View style={styles.donationHeader}>
          <View style={styles.donorInfo}>
            <View style={styles.donorAvatar}>
              <Text style={styles.donorAvatarText}>
                {donation.donorName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.donorDetails}>
              <Text style={styles.donorName}>{donation.donorName}</Text>
              <Text style={styles.donorEmail}>{donation.donorEmail}</Text>
              {donation.donorLocation && (
                <Text style={styles.donorLocation}>
                  <Ionicons name="location" size={12} color={colors.textSecondary} />
                  {' '}{donation.donorLocation}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.donationAmount}>
            <Text style={styles.amountText}>
              {formatAmount(donation.amount, donation.currency)}
            </Text>
            <Text style={styles.transactionId}>{donation.transactionId}</Text>
          </View>
        </View>

        <View style={styles.donationMeta}>
          <View style={[styles.purposeBadge, { backgroundColor: purposeInfo.color }]}>
            <Text style={styles.purposeText}>{purposeInfo.label}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Text style={styles.statusText}>{statusInfo.label}</Text>
          </View>
          <View style={styles.paymentMethod}>
            <Ionicons name={paymentInfo.icon as any} size={16} color={colors.textSecondary} />
            <Text style={styles.paymentText}>{paymentInfo.label}</Text>
          </View>
        </View>

        <View style={styles.donationFooter}>
          <Text style={styles.dateText}>
            {formatDate(donation.createdAt)}
            {donation.completedAt && (
              <Text style={styles.completedText}>
                {' • Completed: '}{formatDate(donation.completedAt)}
              </Text>
            )}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.accentTeal, colors.accentGreen]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Donation Management</Text>
            <Text style={styles.headerSubtitle}>Track and manage donations</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {renderStatsCard('Total Amount', formatAmount(stats.totalAmount, 'NGN'), 'cash', '#4CAF50')}
          {renderStatsCard('Total Donations', stats.totalDonations.toString(), 'people', '#2196F3')}
          {renderStatsCard('Pending', formatAmount(stats.pendingAmount, 'NGN'), 'time', '#FF9800')}
          {renderStatsCard('Completed', formatAmount(stats.completedAmount, 'NGN'), 'checkmark-circle', '#4CAF50')}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search donations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setFilterStatus('all')}
            >
              <Text style={[
                styles.filterButtonText,
                filterStatus === 'all' && styles.filterButtonTextActive
              ]}>
                All Status
              </Text>
            </TouchableOpacity>
            {statuses.map((status) => (
              <TouchableOpacity
                key={status.value}
                style={[
                  styles.filterButton,
                  filterStatus === status.value && styles.filterButtonActive
                ]}
                onPress={() => setFilterStatus(status.value)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterStatus === status.value && styles.filterButtonTextActive
                ]}>
                  {status.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterPurpose === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setFilterPurpose('all')}
            >
              <Text style={[
                styles.filterButtonText,
                filterPurpose === 'all' && styles.filterButtonTextActive
              ]}>
                All Purposes
              </Text>
            </TouchableOpacity>
            {purposes.map((purpose) => (
              <TouchableOpacity
                key={purpose.value}
                style={[
                  styles.filterButton,
                  filterPurpose === purpose.value && styles.filterButtonActive
                ]}
                onPress={() => setFilterPurpose(purpose.value)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterPurpose === purpose.value && styles.filterButtonTextActive
                ]}>
                  {purpose.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Donations List */}
      <ScrollView style={styles.content}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsText}>
            {filteredDonations.length} donation{filteredDonations.length !== 1 ? 's' : ''} found
          </Text>
        </View>
        
        {filteredDonations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No donations found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery || filterStatus !== 'all' || filterPurpose !== 'all' 
                ? 'Try adjusting your filters' 
                : 'No donations have been received yet'
              }
            </Text>
          </View>
        ) : (
          filteredDonations.map(renderDonation)
        )}
      </ScrollView>

      {/* Donation Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        {selectedDonation && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Donation Details</Text>
              <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>Donor Information</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>{selectedDonation.donorName}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{selectedDonation.donorEmail}</Text>
                </View>
                {selectedDonation.donorLocation && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>{selectedDonation.donorLocation}</Text>
                  </View>
                )}
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>Donation Information</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Amount:</Text>
                  <Text style={styles.detailValue}>
                    {formatAmount(selectedDonation.amount, selectedDonation.currency)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Purpose:</Text>
                  <Text style={styles.detailValue}>
                    {getPurposeInfo(selectedDonation.purpose).label}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Payment Method:</Text>
                  <Text style={styles.detailValue}>
                    {getPaymentMethodInfo(selectedDonation.paymentMethod).label}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Transaction ID:</Text>
                  <Text style={styles.detailValue}>{selectedDonation.transactionId}</Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>Timeline</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Created:</Text>
                  <Text style={styles.detailValue}>{formatDate(selectedDonation.createdAt)}</Text>
                </View>
                {selectedDonation.completedAt && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Completed:</Text>
                    <Text style={styles.detailValue}>{formatDate(selectedDonation.completedAt)}</Text>
                  </View>
                )}
              </View>

              {selectedDonation.notes && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailTitle}>Notes</Text>
                  <Text style={styles.detailValue}>{selectedDonation.notes}</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDetailsModal(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
              
              {selectedDonation.status === 'pending' && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => handleStatusUpdate(selectedDonation.id, 'completed')}
                >
                  <Text style={styles.completeButtonText}>Mark Complete</Text>
                </TouchableOpacity>
              )}
              
              {selectedDonation.status === 'completed' && (
                <TouchableOpacity
                  style={styles.refundButton}
                  onPress={() => handleRefund(selectedDonation.id)}
                >
                  <Text style={styles.refundButtonText}>Process Refund</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
  },
  statsSection: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filtersContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: colors.textPrimary,
  },
  filterRow: {
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.divider,
    marginRight: 8,
    backgroundColor: colors.background,
  },
  filterButtonActive: {
    backgroundColor: colors.accentTeal,
    borderColor: colors.accentTeal,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsHeader: {
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  donationItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  donationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  donorInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  donorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  donorAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  donorDetails: {
    flex: 1,
  },
  donorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  donorEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  donorLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  donationAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  transactionId: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  donationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  purposeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  purposeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  donationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  completedText: {
    color: colors.accentTeal,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  completeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    marginLeft: 8,
  },
  completeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  refundButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F44336',
    alignItems: 'center',
    marginLeft: 8,
  },
  refundButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default AdminDonationsScreen;
