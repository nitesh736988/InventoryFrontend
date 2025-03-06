import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Sidebarmodal = () => {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const navigation = useNavigation();

  const openModal = () => {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  const openServicePersonDashboard = () => {
    closeModal();
    navigation.navigate('ServicePersonDashboard');
  };

  const openOrderDetails = () => {
    closeModal();
    navigation.navigate('OrderDetails');
  };

 

  const openOutStatus = () => {
    closeModal();
    navigation.navigate('OutStatus');
  };

  const openApprovedData = () => {
    closeModal();
    navigation.navigate('ApprovedData');
  };

  const openShowComplaints = () => {
    closeModal();
    navigation.navigate('ShowComplaints');
  };
  const openShowInstallationData = () => {
    closeModal();
    navigation.navigate('InstallationData');
  };


  const openShowQuaterData = () => {
    closeModal();
    navigation.navigate('QuaterData');
  };


  const openShowSurveyAssignData = () => {
    closeModal();
    navigation.navigate('SurveyAssignData');
  };


  const openApprovalNewInstallation = () => {
    closeModal();
    navigation.navigate('ApprovalNewInstallation');
  };

  // const openLocationTracker = () => {
  //   closeModal();
  //   navigation.navigate('LocationTracker');
  // };



  useEffect(() => {
    if (!visible) {
      slideAnim.setValue(-300);
    }
  }, [visible]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal} style={styles.menuIcon}>
        <Icon name="bars" size={28} color="#000" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={closeModal}>
        <TouchableOpacity
          style={styles.overlay}
          onPress={closeModal}
          activeOpacity={1}
        />

        <Animated.View
          style={[styles.sidebar, {transform: [{translateX: slideAnim}]}]}>
          <Text style={styles.sidebarText}>Galo Inventory System</Text>

          <TouchableOpacity
            onPress={openApprovedData}
            style={styles.optionButton}>
            <Text style={styles.optionText}>Approved Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openShowComplaints}
            style={styles.optionButton}>
            <Text style={styles.optionText}>Show Complaint</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openShowInstallationData}
            style={styles.optionButton}>
            <Text style={styles.optionText}>Service Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openShowQuaterData}
            style={styles.optionButton}>
            <Text style={styles.optionText}>Quaterly Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openShowSurveyAssignData}
            style={styles.optionButton}>
            <Text style={styles.optionText}>Survey Assign Data</Text>
          </TouchableOpacity>

{/* 
          <TouchableOpacity
            onPress={openNewInstallation}
            style={styles.optionButton}>
            <Text style={styles.optionText}>New Installation</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={openApprovalNewInstallation}
            style={styles.optionButton}>
            <Text style={styles.optionText}>Approval NewInstallation</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={openLocationTracker}
            style={styles.optionButton}>
            <Text style={styles.optionText}>Location Tracker</Text>
          </TouchableOpacity> */}




        </Animated.View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbd33b'
  },
  menuIcon: {
    position: 'absolute',
    top: 20, 
    left: 15,
    zIndex: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#FFF',
    padding: 20,
    justifyContent: 'flex-start',
    elevation: 5,
    backgroundColor: '#fbd33b',
  },
  sidebarText: {
    fontSize: 20,
    marginBottom: 25,
    color: 'black',
  },
  optionButton: {
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    color: 'black',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#FF5733',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default Sidebarmodal;
