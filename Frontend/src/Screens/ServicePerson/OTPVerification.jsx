import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import api from '../../auth/api';;
import { API_URL } from '@env';

const OTPVerification = ({ route, navigation }) => {
  const { pickupItemId } = route.params;
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const sendOtp = async () => {
    try {
      const response = await api.post(`${API_URL}/send-otp`, {
        pickupItemId,
      });

      if (response.data.success) {
        Alert.alert('Success', 'OTP sent successfully.');
        startResendTimer();
      } else {
        Alert.alert('Error', 'Failed to send OTP.');
      }
    } catch (error) {
      console.log('Error sending OTP:', error.message);
      Alert.alert('Error', 'Failed to send OTP.');
    }
  };

  const resendOtp = async () => {
    if (resendTimer > 0) {
      Alert.alert('Wait', `Please wait ${resendTimer} seconds to resend OTP.`);
      return;
    }

    try {
      const response = await api.post(`${API_URL}/resend-otp`, {
        pickupItemId,
      });

      if (response.data.success) {
        Alert.alert('Success', 'OTP resent successfully.');
        startResendTimer();
      } else {
        Alert.alert('Error', 'Failed to resend OTP.');
      }
    } catch (error) {
      console.log('Error resending OTP:', error.message);
      Alert.alert('Error', 'Failed to resend OTP.');
    }
  };

  const startResendTimer = () => {
    setResendTimer(300); 
    const timerInterval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = async () => {
    try {
      const response = await api.post(`${API_URL}/verify-otp`, {
        pickupItemId,
        otp,
      });

      if (response.data.success) {
        Alert.alert('Success', 'Installation data submitted successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Invalid OTP.');
      }
    } catch (error) {
      console.log('Error verifying OTP:', error.message);
      Alert.alert('Error', 'Failed to verify OTP.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter OTP:</Text>
      <TextInput
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
      />
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.resendButton, resendTimer > 0 && styles.disabledButton]}
        onPress={resendOtp}
        disabled={resendTimer > 0}
      >
        <Text style={styles.buttonText}>
          {resendTimer > 0
            ? `Resend OTP in ${resendTimer}s`
            : 'Resend OTP'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sendButton} onPress={sendOtp}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  verifyButton: {
    backgroundColor: '#070604',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resendButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default OTPVerification;
