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
import { Task, TeamMember } from '../types';
import { apiClient } from '../api/client';
import { mockTasks, mockTeamMembers, getMockOperationsStatus } from '../data/mockData';

export default function OperationsScreen() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [metrics, setMetrics] = useState<any>(getMockOperationsStatus());
  const [loading, setLoading] = useState(false);

  const loadOperations = async () => {
    try {
      const res = await apiClient.get('/operations');
      if (res.data.success) {
        setTasks(res.data.tasks);
        setTeamMembers(res.data.teamMembers);
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      // Fallback already in place
    }
  };

  useEffect(() => {
    loadOperations();
  }, []);

  const handleReassign = async (taskId: string) => {
    const newMember = 'Marcus Vance';
    try {
      const res = await apiClient.patch(`/operations/tasks/${taskId}/reassign`, {
        assignedTo: newMember
      });
      if (res.data.success) {
        setTasks(tasks.map(t => t.id === taskId ? res.data.task : t));
        setMetrics(res.data.updatedMetrics);
        Alert.alert('Reassigned', `Task reassigned to ${newMember} and moved to In Progress!`);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to reassign task');
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
        <Text style={styles.sectionHeader}>Site Operations & Maintenance</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>OVERDUE</Text>
            <Text style={[styles.metricValue, { color: '#DC2626' }]}>{metrics?.metrics[0]?.value || 0}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>COMPLETED</Text>
            <Text style={styles.metricValue}>{metrics?.metrics[1]?.value || 0}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>ACTIVE STAFF</Text>
            <Text style={styles.metricValue}>{metrics?.metrics[2]?.value || 0}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.listTitle}>Site Tasks ({tasks.length})</Text>
      {tasks.map((task) => (
        <View key={task.id} style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <View style={[styles.statusBadge, task.status === 'overdue' ? styles.overdueBadge : task.status === 'completed' ? styles.completedBadge : styles.inProgressBadge]}>
              <Text style={[styles.statusText, task.status === 'overdue' ? styles.overdueText : task.status === 'completed' ? styles.completedText : styles.inProgressText]}>
                {task.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.locationText}>📍 {task.propertyLocation}</Text>
          <Text style={styles.assigneeText}>Assigned: {task.assignedTo}</Text>

          {task.status === 'overdue' && (
            <TouchableOpacity
              style={styles.reassignBtn}
              onPress={() => handleReassign(task.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.reassignBtnText}>Reassign to Operations Manager</Text>
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
  taskCard: {
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  taskTitle: {
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
  overdueBadge: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  inProgressBadge: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  completedBadge: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  statusText: { fontSize: 10, fontWeight: '700' },
  overdueText: { color: '#DC2626' },
  inProgressText: { color: '#2563EB' },
  completedText: { color: '#059669' },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  assigneeText: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
    marginTop: 4
  },
  reassignBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  reassignBtnText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 12
  }
});
