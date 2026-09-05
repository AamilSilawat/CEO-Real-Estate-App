import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Campaign } from '../types';
import { apiClient } from '../api/client';
import { mockCampaigns, getMockMarketingStatus } from '../data/mockData';

export default function MarketingScreen() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [metrics, setMetrics] = useState<any>(getMockMarketingStatus());
  const [loading, setLoading] = useState(false);

  const loadMarketing = async () => {
    try {
      const res = await apiClient.get('/marketing');
      if (res.data.success) {
        setCampaigns(res.data.campaigns);
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      // Fallback already in place
    }
  };

  useEffect(() => {
    loadMarketing();
  }, []);

  const toggleCampaign = async (campaignId: string) => {
    try {
      const res = await apiClient.patch(`/marketing/campaigns/${campaignId}/status`);
      if (res.data.success) {
        setCampaigns(campaigns.map(c => c.id === campaignId ? res.data.campaign : c));
        setMetrics(res.data.updatedMetrics);
        Alert.alert('Updated', `Campaign status changed to ${res.data.campaign.status.toUpperCase()}!`);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to toggle campaign');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 28 }}>
      <View style={styles.metricsCard}>
        <Text style={styles.sectionHeader}>Growth & Ad Campaign Performance</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>ACTIVE ADS</Text>
            <Text style={styles.metricValue}>{metrics?.metrics[0]?.value || 0}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>LEADS (7D)</Text>
            <Text style={styles.metricValue}>{metrics?.metrics[1]?.value || 0}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>TOP CHANNEL</Text>
            <Text style={[styles.metricValue, { fontSize: 13 }]}>{metrics?.metrics[2]?.value || 'N/A'}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.listTitle}>Ad Campaigns ({campaigns.length})</Text>
      {campaigns.map((camp) => (
        <View key={camp.id} style={styles.campaignCard}>
          <View style={styles.campaignHeader}>
            <Text style={styles.campaignTitle}>{camp.title}</Text>
            <View style={[styles.statusBadge, camp.status === 'active' ? styles.activeBadge : styles.pausedBadge]}>
              <Text style={[styles.statusText, camp.status === 'active' ? styles.activeText : styles.pausedText]}>
                {camp.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.channelText}>Channel: {camp.channel}</Text>
          <Text style={styles.leadsText}>Leads Generated: +{camp.leadsThisWeek} this week</Text>

          <TouchableOpacity
            style={[styles.toggleBtn, camp.status === 'active' ? styles.pauseBtn : styles.activateBtn]}
            onPress={() => toggleCampaign(camp.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleBtnText, camp.status === 'active' ? styles.pauseBtnText : styles.activateBtnText]}>
              {camp.status === 'active' ? 'Pause Ad Campaign' : 'Activate Ad Campaign'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC'
  },
  metricsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  metricBox: {
    flex: 1,
    alignItems: 'center'
  },
  metricLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 0.3
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10
  },
  campaignCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  campaignTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1
  },
  activeBadge: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  pausedBadge: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  statusText: { fontSize: 10, fontWeight: '700' },
  activeText: { color: '#059669' },
  pausedText: { color: '#D97706' },
  channelText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  leadsText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '700',
    marginTop: 4
  },
  toggleBtn: {
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1
  },
  pauseBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA'
  },
  activateBtn: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE'
  },
  toggleBtnText: {
    fontWeight: '700',
    fontSize: 12
  },
  pauseBtnText: { color: '#DC2626' },
  activateBtnText: { color: '#2563EB' }
});
