import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AdminDashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Pump</Text>
        <Text style={styles.subheader}>Total Pump</Text>
        <Text style={styles.count}>120</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.header}>Motor</Text>
        <Text style={styles.subheader}>Total Motor</Text>
        <Text style={styles.count}>96</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.header}>Controller</Text>
        <Text style={styles.subheader}>Total Controller</Text>
        <Text style={styles.count}>121</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'maroon', // Background color as seen in the image
    padding: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right', // Aligning right as shown in the image
  },
  subheader: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  count: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AdminDashboard;
