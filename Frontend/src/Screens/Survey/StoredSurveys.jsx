import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StoredSurveys = () => {
  const [storedSurveys, setStoredSurveys] = useState([]);

  useEffect(() => {
    const fetchStoredData = async () => {
      try {
        const data = await AsyncStorage.getItem('offlineSurveys');
        setStoredSurveys(data ? JSON.parse(data) : []);
      } catch (error) {
        Alert.alert('Error', 'Failed to load stored surveys.');
      }
    };
    fetchStoredData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Stored Surveys</Text>
      {storedSurveys.length > 0 ? (
        storedSurveys.map((survey, index) => (
          <View key={index} style={styles.card}>
            <Text>Source Type: {survey.sourceType}</Text>
            <Text>Depth: {survey.depth}</Text>
            <Text>Water Level: {survey.waterLevel}</Text>
            <Text>Category: {survey.category}</Text>
            <Text>Pump Head: {survey.pumpHead}</Text>
            <Text>LT Distance: {survey.LTDistance}</Text>
            <Text>Remark: {survey.remark}</Text>
          </View>
        ))
      ) : (
        <Text>No stored surveys.</Text>
      )}
    </ScrollView>
  );
};

export default StoredSurveys;

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: { padding: 15, borderWidth: 1, marginBottom: 10, borderRadius: 5 },
});
