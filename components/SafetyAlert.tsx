import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { TriangleAlert as AlertTriangle, X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export type AlertType = {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  location?: string;
  timestamp: string;
};

type SafetyAlertProps = {
  alert: AlertType;
  onDismiss: (id: string) => void;
  onPress: (alert: AlertType) => void;
};

export default function SafetyAlert({ alert, onDismiss, onPress }: SafetyAlertProps) {
  const getAlertColors = () => {
    switch (alert.severity) {
      case 'danger':
        return {
          background: Colors.danger[50],
          border: Colors.danger[500],
          icon: Colors.danger[500],
        };
      case 'warning':
        return {
          background: Colors.warning[50],
          border: Colors.warning[500],
          icon: Colors.warning[500],
        };
      case 'info':
      default:
        return {
          background: Colors.primary[50],
          border: Colors.primary[500],
          icon: Colors.primary[500],
        };
    }
  };

  const colors = getAlertColors();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(alert)}
    >
      <View style={styles.content}>
        <AlertTriangle size={20} color={colors.icon} style={styles.icon} />
        <View style={styles.textContent}>
          <Text style={styles.message}>{alert.message}</Text>
          {alert.location && (
            <Text style={styles.location}>
              {alert.location} • {alert.timestamp}
            </Text>
          )}
        </View>
      </View>
      <Pressable
        style={styles.dismissButton}
        onPress={() => onDismiss(alert.id)}
        hitSlop={8}
      >
        <X size={16} color={Colors.neutral[500]} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textContent: {
    flex: 1,
  },
  message: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: Colors.neutral[800],
    marginBottom: 4,
  },
  location: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
  },
  dismissButton: {
    padding: 4,
  },
});