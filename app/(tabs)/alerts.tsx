import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl } from 'react-native';
import { MapPin, Filter } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import SafetyAlert, { AlertType } from '@/components/SafetyAlert';

// Mock data with more alerts
const MOCK_ALERTS: AlertType[] = [
  {
    id: '1',
    message: 'Reports of extortion attempts near Gulshan Avenue',
    severity: 'danger',
    location: 'Gulshan, Dhaka',
    timestamp: '10 mins ago',
  },
  {
    id: '2',
    message: 'Be cautious of suspicious individuals near Mirpur Road bus stops',
    severity: 'warning',
    location: 'Mirpur, Dhaka',
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    message: 'Police increased patrols in Uttara Sector 13',
    severity: 'info',
    location: 'Uttara, Dhaka',
    timestamp: '2 hours ago',
  },
  {
    id: '4',
    message: 'Recent extortion incidents reported at Farmgate market',
    severity: 'danger',
    location: 'Farmgate, Dhaka',
    timestamp: '3 hours ago',
  },
  {
    id: '5',
    message: 'Stay vigilant around Motijheel commercial area',
    severity: 'warning',
    location: 'Motijheel, Dhaka',
    timestamp: '5 hours ago',
  },
  {
    id: '6',
    message: 'Community watch program starting in Dhanmondi',
    severity: 'info',
    location: 'Dhanmondi, Dhaka',
    timestamp: '6 hours ago',
  },
  {
    id: '7',
    message: 'Multiple reports of extortion at CNG stations',
    severity: 'danger',
    location: 'Mohammadpur, Dhaka',
    timestamp: 'Yesterday',
  },
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertType[]>(MOCK_ALERTS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate fetch delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const viewAlertDetails = (alert: AlertType) => {
    // In a real app, navigate to alert details
    router.push(`/alerts/${alert.id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Safety Alerts</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={Colors.primary[600]} />
            <Text style={styles.location}>Dhaka, Bangladesh</Text>
          </View>
        </View>
        <View style={styles.filterButton}>
          <Filter size={20} color={Colors.primary[600]} />
        </View>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SafetyAlert
            alert={item}
            onDismiss={dismissAlert}
            onPress={viewAlertDetails}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[100],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    color: Colors.primary[800],
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
    marginLeft: 4,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
  },
});