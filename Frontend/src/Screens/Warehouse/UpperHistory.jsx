import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import axios from "axios";
import {API_URL} from '@env';

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const UpperHistory = () => {
  const [records, setRecords] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/warehouse-admin/receiving-items-data`
      );
      if (res.data.success) {
        setRecords(res.data.data);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading records...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Receiving History</Text>

      {records.length === 0 ? (
        <Text style={styles.noData}>No records found.</Text>
      ) : (
        records.map((record) => (
          <View key={record.outgoingId} style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => toggleExpand(record.outgoingId)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>
                  {record.fromWarehouse} → {record.toServiceCenter}
                </Text>
                <Text style={styles.subText}>
                  Status:{" "}
                  <Text
                    style={{
                      color:
                        record.outgoingStatus === "Fully Received"
                          ? "green"
                          : "orange",
                    }}
                  >
                    {record.outgoingStatus}
                  </Text>
                </Text>
              </View>
              <Text style={styles.expandIcon}>
                {expandedId === record.outgoingId ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>

            {expandedId === record.outgoingId && (
              <View style={styles.cardBody}>
                {/* Farmers & Items */}
                <Text style={styles.sectionTitle}>Farmers & Items</Text>
                {record.farmers.map((farmer, fIdx) => (
                  <View key={fIdx} style={styles.innerBox}>
                    <Text style={styles.boldText}>
                      Farmer Saral ID: {farmer.farmerSaralId}
                    </Text>
                    {farmer.items.map((item, iIdx) => (
                      <Text key={iIdx} style={styles.itemText}>
                        • {item.itemName} — Sent: {item.quantity}, Received:{" "}
                        {item.receivedQuantity}, Pending: {item.pendingQuantity}
                      </Text>
                    ))}
                  </View>
                ))}

                {/* Receiving Batches */}
                <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
                  Receiving Batches
                </Text>
                {record.receivingBatches.map((batch, bIdx) => (
                  <View key={bIdx} style={styles.batchBox}>
                  
                    <Text style={styles.smallText}>
                      <Text style={styles.boldText}>Remarks:</Text>{" "}
                      {batch.remarks}
                    </Text>
                    <Text style={styles.smallText}>
                      <Text style={styles.boldText}>Driver:</Text>{" "}
                      {batch.driverName} ({batch.driverContact})
                    </Text>
                    <Text style={styles.smallText}>
                      <Text style={styles.boldText}>Vehicle:</Text>{" "}
                      {batch.vehicleNumber}
                    </Text>
                    <Text style={styles.smallText}>
                      <Text style={styles.boldText}>Received Date:</Text>{" "}
                      {new Date(batch.receivedDate).toLocaleString()}
                    </Text>

                    {batch.farmersReceived.map((farmer, fi) => (
                      <View key={fi} style={styles.receivedBox}>
                        <Text style={styles.boldText}>
                          Farmer: {farmer.farmerSaralId}
                        </Text>
                        {farmer.receivedItems.map((itm, ii) => (
                          <Text key={ii} style={styles.itemText}>
                            • {itm.itemName} — Received: {itm.quantity}
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>
                ))}

                {/* Summary */}
                <View style={styles.summaryBox}>
                  <Text style={styles.sectionTitle}>Summary</Text>
                  <Text style={styles.smallText}>
                    Farmers: {record.summary.totalFarmers}, Items:{" "}
                    {record.summary.totalItems}
                  </Text>
                  <Text style={styles.smallText}>
                    Sent: {record.summary.totalQuantitySent}, Received:{" "}
                    {record.summary.totalQuantityReceived}, Pending:{" "}
                    {record.summary.totalQuantityPending}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default UpperHistory;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#f5f6fa",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    color: "#777",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  subText: {
    fontSize: 13,
    color: "#555",
  },
  expandIcon: {
    fontSize: 20,
    color: "#007AFF",
  },
  cardBody: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  innerBox: {
    backgroundColor: "#f0f0f5",
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  batchBox: {
    backgroundColor: "#eef9f3",
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  receivedBox: {
    backgroundColor: "#fdfdfd",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 6,
    marginTop: 5,
  },
  itemText: {
    fontSize: 13,
    color: "#333",
  },
  boldText: {
    fontWeight: "600",
    color: "#222",
  },
  smallText: {
    fontSize: 13,
    color: "#333",
  },
  summaryBox: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#e9efff",
    borderRadius: 8,
  },
});
