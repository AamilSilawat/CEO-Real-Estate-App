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
import { LeaveRequest } from '../types';
import { apiClient } from '../api/client';

export default function HRScreen() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadHR = async () => {
    try {
      const res = await apiClient.get('/hr');
      if (res.data.success) {
        setLeaveRequests(res.data.leaveRequests);
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      console.log('Error loading HR', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHR();
  }, []);

  const handleApproveLeave = async (requestId: string) => {
    try {
      const res = await apiClient.patch(`/hr/leave-requests/${requestId}/approve`);
      if (res.data.success) {
        setLeaveRequests(leaveRequests.map(r => r.id === requestId ? res.data.leaveRequest : r));
        setMetrics(res.data.updatedMetrics);
        Alert.alert('Approved', `Leave request for ${res.data.leaveRequest.employeeName} approved!`);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to approve leave request');
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
        <Text style={styles.sectionHeader}>People & Organization Health</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>HEADCOUNT</Text>
            <Text style={styles.metricValue}>{metrics?.metrics[0]?.value || 0}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>OPEN ROLES</Text>
            <Text style={styles.metricValue}>{metrics?.metrics[1]?.value || 0}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>ATTENDANCE</Text>
            <Text style={[styles.metricValue, { color: '#059669' }]}>{metrics?.metrics[2]?.value || '0%'}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.listTitle}>Employee Leave Requests ({leaveRequests.length})</Text>
      {leaveRequests.map((req) => (
        <View key={req.id} style={styles.reqCard}>
          <View style={styles.reqHeader}>
            <Text style={styles.empName}>{req.employeeName}</Text>
            <View style={[styles.statusBadge, req.status === 'approved' ? styles.approvedBadge : styles.pendingBadge]}>
              <Text style={[styles.statusText, req.status === 'approved' ? styles.approvedText : styles.pendingText]}>
                {req.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.roleText}>{req.role} • {req.leaveType} Leave</Text>
          <Text style={styles.daysText}>Requested Duration: {req.days} Day(s)</Text>

          {req.status === 'pending' && (
            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => handleApproveLeave(req.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.approveBtnText}>Authorize & Approve Leave</Text>
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
  reqCard: {
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
  reqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  empName: {
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
  roleText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  daysText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
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
