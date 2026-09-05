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
import { Invoice } from '../types';
import { apiClient } from '../api/client';
import { mockInvoices, getMockFinanceStatus } from '../data/mockData';

export default function FinanceScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [metrics, setMetrics] = useState<any>(getMockFinanceStatus());
  const [loading, setLoading] = useState(false);

  const loadFinance = async () => {
    try {
      const res = await apiClient.get('/finance');
      if (res.data.success) {
        setInvoices(res.data.invoices);
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      // Fallback already in place
    }
  };

  useEffect(() => {
    loadFinance();
  }, []);

  const handleApprove = async (invoiceId: string) => {
    try {
      const res = await apiClient.patch(`/finance/invoices/${invoiceId}/approve`);
      if (res.data.success) {
        setInvoices(invoices.map(i => i.id === invoiceId ? res.data.invoice : i));
        setMetrics(res.data.updatedMetrics);
        Alert.alert('Approved', `Invoice ${res.data.invoice.invoiceNumber} authorized for payment!`);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to approve invoice');
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
        <Text style={styles.sectionHeader}>Finance & Invoicing Health</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>REVENUE QUOTA</Text>
            <Text style={styles.metricValue}>{metrics?.metrics[0]?.value || '0%'}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>PENDING COUNT</Text>
            <Text style={[styles.metricValue, { color: '#D97706' }]}>{metrics?.metrics[1]?.value || 0}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>PENDING VALUE</Text>
            <Text style={styles.metricValue}>{metrics?.metrics[2]?.value || '$0'}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.listTitle}>Corporate Invoices ({invoices.length})</Text>
      {invoices.map((inv) => (
        <View key={inv.id} style={styles.invoiceCard}>
          <View style={styles.invoiceHeader}>
            <Text style={styles.invoiceNumber}>{inv.invoiceNumber}</Text>
            <View style={[styles.statusBadge, inv.status === 'approved' ? styles.approvedBadge : styles.pendingBadge]}>
              <Text style={[styles.statusText, inv.status === 'approved' ? styles.approvedText : styles.pendingText]}>
                {inv.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.clientText}>Client: {inv.clientName} ({inv.category})</Text>
          <Text style={styles.amountText}>Amount: ${(inv.amount).toLocaleString()}</Text>

          {inv.status === 'pending' && (
            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => handleApprove(inv.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.approveBtnText}>Authorize & Approve Payout</Text>
            </TouchableOpacity>
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
    color: '#0F172A',
    marginTop: 2
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10
  },
  invoiceCard: {
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
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1
  },
  pendingBadge: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  approvedBadge: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  statusText: { fontSize: 10, fontWeight: '700' },
  pendingText: { color: '#D97706' },
  approvedText: { color: '#059669' },
  clientText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  amountText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '800',
    marginTop: 4
  },
  approveBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  approveBtnText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 12
  }
});
