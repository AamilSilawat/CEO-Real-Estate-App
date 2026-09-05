import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, DepartmentSummary } from '../types';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';
import { getMockDashboardDepartments } from '../data/mockData';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

const AnimatedDepartmentCard = ({
  dept,
  onPress
}: {
  dept: DepartmentSummary;
  onPress: () => void;
}) => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: false
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 1400,
          useNativeDriver: false
        })
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim]);

  const getStatusConfig = (status: 'green' | 'amber' | 'red') => {
    if (status === 'green') {
      return {
        text: 'On Track',
        color: COLORS.green,
        bg: COLORS.greenBg,
        borderColor: COLORS.green,
        borderTint: 'rgba(5, 150, 105, 0.4)',
        glowColor: 'rgba(5, 150, 105, 0.15)'
      };
    }
    if (status === 'amber') {
      return {
        text: 'Needs Attention',
        color: COLORS.amber,
        bg: COLORS.amberBg,
        borderColor: COLORS.amber,
        borderTint: 'rgba(217, 119, 6, 0.4)',
        glowColor: 'rgba(217, 119, 6, 0.15)'
      };
    }
    return {
      text: 'Critical Action',
      color: COLORS.red,
      bg: COLORS.redBg,
      borderColor: COLORS.red,
      borderTint: 'rgba(220, 38, 38, 0.45)',
      glowColor: 'rgba(220, 38, 38, 0.18)'
    };
  };

  const config = getStatusConfig(dept.status);

  const animatedBorderColor = pulseAnim.interpolate({
    inputRange: [0.35, 1],
    outputRange: [config.borderTint, config.borderColor]
  });

  return (
    <Animated.View
      style={[
        styles.cardOuter,
        {
          borderColor: animatedBorderColor,
          shadowColor: config.borderColor
        }
      ]}
    >
      <TouchableOpacity
        style={styles.cardInner}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Animated.View
          style={[
            styles.runningTopLine,
            {
              backgroundColor: config.borderColor,
              opacity: pulseAnim
            }
          ]}
        />

        <View style={styles.cardHeader}>
          <View style={styles.titleWithDot}>
            <Animated.View
              style={[
                styles.livePulseDot,
                {
                  backgroundColor: config.borderColor,
                  opacity: pulseAnim
                }
              ]}
            />
            <Text style={styles.deptName}>{dept.name}</Text>
          </View>

          <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.borderTint }]}>
            <Text style={[styles.badgeText, { color: config.color }]}>
              {dept.status === 'green' ? '🟢 ' : dept.status === 'amber' ? '🟡 ' : '🔴 '}
              {config.text}
            </Text>
          </View>
        </View>

        <Text style={styles.summaryText}>{dept.summary}</Text>

        <View style={styles.metricsRow}>
          {dept.metrics.map((m, idx) => (
            <View key={idx} style={styles.metricBox}>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={[styles.metricValue, idx === 0 && { color: config.color }]}>
                {m.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footerRow}>
          <Text style={[styles.actionTag, { color: config.color, backgroundColor: config.bg }]}>
            {dept.id === 'sales' && 'Action: Mark Deal Won/Lost'}
            {dept.id === 'operations' && 'Action: Reassign Overdue Task'}
            {dept.id === 'finance' && 'Action: Approve Invoice'}
            {dept.id === 'marketing' && 'Action: Toggle Campaign'}
            {dept.id === 'hr' && 'Action: Approve Leave Request'}
          </Text>
          <Text style={[styles.tapPrompt, { color: config.color }]}>Open Dept →</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function DashboardScreen() {
  const navigation = useNavigation<NavProp>();
  const { logout, user } = useAuth();
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchDashboard = async () => {
    try {
      const response = await apiClient.get('/dashboard');
      if (response.data.success) {
        setDepartments(response.data.data.departments);
      } else {
        setDepartments(getMockDashboardDepartments());
      }
    } catch (error) {
      setDepartments(getMockDashboardDepartments());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [])
  );

  const openDepartment = (id: string) => {
    if (id === 'sales') navigation.navigate('Sales');
    if (id === 'operations') navigation.navigate('Operations');
    if (id === 'finance') navigation.navigate('Finance');
    if (id === 'marketing') navigation.navigate('Marketing');
    if (id === 'hr') navigation.navigate('HR');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchDashboard(); }} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome, {user?.name || 'Aamil Silawat'}</Text>
            <Text style={styles.subText}>CEO Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {departments.map((dept) => (
          <AnimatedDepartmentCard
            key={dept.id}
            dept={dept}
            onPress={() => openDepartment(dept.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  container: {
    flex: 1,
    paddingHorizontal: 16
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 6
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4
  },
  subText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  logoutBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 12
  },
  cardOuter: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1.8,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3
  },
  cardInner: {
    padding: 16,
    backgroundColor: '#FFFFFF'
  },
  runningTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 2
  },
  titleWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  deptName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A'
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  summaryText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
  },
  metricBox: {
    flex: 1,
    alignItems: 'center'
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.3
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  actionTag: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  tapPrompt: {
    fontSize: 12,
    fontWeight: '700'
  }
});
