import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Calendar, MapPin, TriangleAlert as AlertTriangle, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export type ReportType = {
  id: string;
  location: string;
  date: string;
  time: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
};

type ReportCardProps = {
  report: ReportType;
  onPress: (report: ReportType) => void;
};

export default function ReportCard({ report, onPress }: ReportCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return Colors.danger[500];
      case 'medium':
        return Colors.warning[500];
      case 'low':
        return Colors.success[500];
      default:
        return Colors.neutral[500];
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'High Risk';
      case 'medium':
        return 'Medium Risk';
      case 'low':
        return 'Low Risk';
      default:
        return 'Unknown';
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(report)}
    >
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <AlertTriangle
            size={16}
            color={getSeverityColor(report.severity)}
            style={styles.icon}
          />
          <Text style={styles.type}>{report.type}</Text>
        </View>
        <View
          style={[
            styles.severityBadge,
            { backgroundColor: getSeverityColor(report.severity) },
          ]}
        >
          <Text style={styles.severityText}>
            {getSeverityText(report.severity)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.description} numberOfLines={2}>
        {report.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <MapPin size={14} color={Colors.neutral[600]} style={styles.icon} />
          <Text style={styles.infoText} numberOfLines={1}>
            {report.location}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Calendar size={14} color={Colors.neutral[600]} style={styles.icon} />
            <Text style={styles.infoText}>{report.date}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={14} color={Colors.neutral[600]} style={styles.icon} />
            <Text style={styles.infoText}>{report.time}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: Colors.neutral[800],
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  severityText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    color: Colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[200],
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.neutral[700],
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  infoText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
  },
});