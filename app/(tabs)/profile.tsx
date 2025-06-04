import { StyleSheet, Text, View, Switch, Pressable, ScrollView, Image } from 'react-native';
import { User, Bell, Lock, CircleHelp as HelpCircle, LogOut, ChevronRight, Globe } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={32} color={Colors.white} />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.anonymous}>Anonymous User</Text>
            <Text style={styles.profileSubtitle}>
              Your identity is protected
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.setting}>
            <View style={styles.settingContent}>
              <View style={styles.settingIcon}>
                <Globe size={20} color={Colors.primary[600]} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Language</Text>
                <Text style={styles.settingDescription}>English</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </View>
          
          <View style={styles.setting}>
            <View style={styles.settingContent}>
              <View style={styles.settingIcon}>
                <Bell size={20} color={Colors.primary[600]} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive safety alerts
                </Text>
              </View>
            </View>
            <Switch
              value={true}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary[300] }}
              thumbColor={Colors.primary[600]}
              ios_backgroundColor={Colors.neutral[300]}
            />
          </View>

          <View style={styles.setting}>
            <View style={styles.settingContent}>
              <View style={styles.settingIcon}>
                <Lock size={20} color={Colors.primary[600]} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Privacy Settings</Text>
                <Text style={styles.settingDescription}>
                  Manage your data and privacy
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <Pressable style={styles.setting}>
            <View style={styles.settingContent}>
              <View style={styles.settingIcon}>
                <HelpCircle size={20} color={Colors.primary[600]} />
              </View>
              <Text style={styles.settingTitle}>Help & FAQ</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </Pressable>

          <Pressable style={styles.setting}>
            <View style={styles.settingContent}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.neutral[100] }]}>
                <LogOut size={20} color={Colors.danger[600]} />
              </View>
              <Text style={[styles.settingTitle, { color: Colors.danger[600] }]}>
                Sign Out
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>SafeStreets Bangladesh v1.0.0</Text>
          <Text style={styles.copyright}>
            © 2025 SafeStreets Initiative
          </Text>
          <Text style={styles.privacyLink}>Privacy Policy • Terms of Service</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[100],
  },
  header: {
    backgroundColor: Colors.primary[700],
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  profileSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  anonymous: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: Colors.neutral[800],
    marginBottom: 4,
  },
  profileSubtitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: Colors.neutral[600],
    marginBottom: 12,
    paddingLeft: 8,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: Colors.neutral[800],
  },
  settingDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.neutral[500],
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  version: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  copyright: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginBottom: 8,
  },
  privacyLink: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: Colors.primary[600],
  },
});