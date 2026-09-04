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
import { Deal } from '../types';
import { apiClient } from '../api/client';

export default function SalesScreen() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadSales = async () => {
    try {
      const res = await apiClient.get('/sales');
      if (res.data.success) {
        setDeals(res.data.deals);
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      console.log('Error loading sales', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const updateDealStatus = async (dealId: string, status: 'won' | 'lost') => {
    try {
      const res = await apiClient.patch(`/sales/deals/${dealId}/status`, { status });
      if (res.data.success) {
        setDeals(deals.map(d => d.id === dealId ? res.data.deal : d));
        setMetrics(res.data.updatedMetrics);
        Alert.alert('Success', `Deal marked as ${status.toUpperCase()}!`);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update deal');
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
        <Text style={styles.sectionHeader}>Sales & Pipeline Performance</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>ACTIVE DEALS</Text>
            <Text style={styles.metricValue}>{metrics?.metrics[0]?.value || 0}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>PIPELINE VALUE</Text>
            <Text style={styles.metricValue}>{metrics?.metrics[1]?.value || '$0'}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>CLOSED WON</Text>
            <Text style={styles.metricValue}>{metrics?.metrics[2]?.value || 0}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.listTitle}>All Real Estate Deals ({deals.length})</Text>
      {deals.map((deal) => (
        <View key={deal.id} style={styles.dealCard}>
          <View style={styles.dealHeader}>
            <Text style={styles.propertyTitle}>{deal.propertyTitle}</Text>
            <View style={[styles.stageBadge, deal.stage === 'won' ? styles.wonBadge : deal.stage === 'lost' ? styles.lostBadge : styles.pipelineBadge]}>
              <Text style={[styles.stageText, deal.stage === 'won' ? styles.wonText : deal.stage === 'lost' ? styles.lostText : styles.pipelineText]}>
                {deal.stage.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.clientText}>Client: {deal.clientName}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.valueText}>Value: ${(deal.dealValue / 1000000).toFixed(2)}M</Text>
            <Text style={styles.agentText}>Broker: {deal.agentName}</Text>
          </View>

          {deal.stage === 'pipeline' && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.wonBtn]}
                onPress={() => updateDealStatus(deal.id, 'won')}
                activeOpacity={0.8}
              >
                <Text style={styles.wonBtnText}>✓ Mark Won</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.lostBtn]}
                onPress={() => updateDealStatus(deal.id, 'lost')}
                activeOpacity={0.8}
              >
                <Text style={styles.lostBtnText}>✗ Mark Lost</Text>
              </TouchableOpacity>
            </View>
          )}
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
    color: '#2563EB',
    marginTop: 2
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10
  },
  dealCard: {
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
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8
  },
  stageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1
  },
  pipelineBadge: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  wonBadge: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  lostBadge: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  stageText: { fontSize: 10, fontWeight: '700' },
  pipelineText: { color: '#2563EB' },
  wonText: { color: '#059669' },
  lostText: { color: '#DC2626' },
  clientText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6
  },
  valueText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700'
  },
  agentText: {
    fontSize: 11,
    color: '#64748B'
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1
  },
  wonBtn: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0'
  },
  wonBtnText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 12
  },
  lostBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA'
  },
  lostBtnText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 12
  }
});
