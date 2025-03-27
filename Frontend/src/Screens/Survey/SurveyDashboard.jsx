import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SurveyPersonLocation from "./SurveyPersonLocation";

const SurveyPersonDashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Survey Person Dashboard</Text>

      <View style={styles.headerContainer}>
          <SurveyPersonLocation />
        </View>
      
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