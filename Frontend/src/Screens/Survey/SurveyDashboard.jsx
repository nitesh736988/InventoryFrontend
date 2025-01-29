import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SurveyPersonDashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Survey Person Dashboard</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fbd33b",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default SurveyPersonDashboard;