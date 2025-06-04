import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Pressable, Switch, ActivityIndicator } from 'react-native';
import { Camera, Image, TriangleAlert as AlertTriangle, MapPin, User, Lock, Send, ArrowLeft } from 'lucide-react-native';
import { Platform } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function ReportScreen() {
  const [incidentType, setIncidentType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [location, setLocation] = useState<string>('');
  
  const descriptionRef = useRef<TextInput>(null);

  const incidentTypes = [
    'Cash Extortion',
    'Threat & Intimidation',
    'Business Targeting',
    'Transport Extortion',
    'Other',
  ];

  const handleSubmit = () => {
    if (!incidentType || !description) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIncidentType('');
      setDescription('');
      setLocation('');
      alert('Your report has been submitted anonymously. Thank you for helping keep the community safe.');
    }, 1500);
  };

  useEffect(() => {
    // Simulate getting location
    setTimeout(() => {
      setLocation('Dhaka, Bangladesh');
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Report Incident</Text>
        <Text style={styles.subtitle}>
          Help keep your community safe by reporting extortion incidents
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Type of Incident</Text>
          <View style={styles.incidentTypes}>
            {incidentTypes.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.typeButton,
                  incidentType === type && styles.selectedType,
                ]}
                onPress={() => setIncidentType(type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    incidentType === type && styles.selectedTypeText,
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionSubtitle}>
            Provide details about what happened
          </Text>
          <TextInput
            ref={descriptionRef}
            style={styles.textInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the incident..."
            placeholderTextColor={Colors.neutral[400]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationContainer}>
            <MapPin size={20} color={Colors.primary[600]} style={styles.locationIcon} />
            <Text style={styles.locationText}>
              {location || 'Fetching your location...'}
            </Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Evidence (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Add photos or videos of the incident if available
          </Text>
          <View style={styles.evidenceButtons}>
            <Pressable style={styles.evidenceButton}>
              <Camera size={24} color={Colors.primary[600]} />
              <Text style={styles.evidenceButtonText}>Take Photo</Text>
            </Pressable>
            <Pressable style={styles.evidenceButton}>
              <Image size={24} color={Colors.primary[600]} />
              <Text style={styles.evidenceButtonText}>Upload Photo</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.anonymousContainer}>
            <View>
              <Text style={styles.anonymousTitle}>Report Anonymously</Text>
              <Text style={styles.anonymousDescription}>
                Your identity will be protected
              </Text>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary[300] }}
              thumbColor={isAnonymous ? Colors.primary[600] : Colors.neutral[100]}
              ios_backgroundColor={Colors.neutral[300]}
            />
          </View>

          {isAnonymous ? (
            <View style={styles.anonymousIndicator}>
              <Lock size={16} color={Colors.primary[600]} />
              <Text style={styles.anonymousIndicatorText}>
                Your report will be anonymous
              </Text>
            </View>
          ) : (
            <View style={styles.anonymousIndicator}>
              <User size={16} color={Colors.neutral[600]} />
              <Text style={styles.anonymousIndicatorText}>
                Your identity will be shared with authorities
              </Text>
            </View>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitButtonPressed,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <>
              <Send size={18} color={Colors.white} style={styles.submitIcon} />
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </>
          )}
        </Pressable>

        <Text style={styles.disclaimer}>
          All reports are reviewed by our team. False reporting is a criminal offense.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.primary[700],
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    color: Colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.primary[100],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: Colors.neutral[800],
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 12,
  },
  incidentTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  typeButton: {
    backgroundColor: Colors.neutral[100],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedType: {
    backgroundColor: Colors.primary[600],
  },
  typeText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
  },
  selectedTypeText: {
    color: Colors.white,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: Colors.neutral[800],
    backgroundColor: Colors.white,
    minHeight: 100,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    marginTop: 8,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.neutral[800],
  },
  evidenceButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  evidenceButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[50],
    borderRadius: 8,
    padding: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.primary[100],
    borderStyle: 'dashed',
  },
  evidenceButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: Colors.primary[700],
    marginTop: 8,
  },
  anonymousContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  anonymousTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: Colors.neutral[800],
    marginBottom: 4,
  },
  anonymousDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  anonymousIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  anonymousIndicatorText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonPressed: {
    backgroundColor: Colors.primary[700],
  },
  submitButtonDisabled: {
    backgroundColor: Colors.neutral[400],
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  disclaimer: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    textAlign: 'center',
    marginBottom: 40,
  },
});