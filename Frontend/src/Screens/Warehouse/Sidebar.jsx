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

const Sidebar = ({userType}) => {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    w2w: false,
    history: false,
    formFill: false,
    System: false,
  });
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

  const toggleSection = section => {
    setExpandedSections(prevState => {
      const newState = {
        w2w: false,
        history: false,
        formFill: false,
        System: false,
      };
      newState[section] = !prevState[section];
      return newState;
    });
  };

  const navigateAndHighlight = screenName => {
    setActiveSection(screenName);
    closeModal();
    navigation.navigate(screenName);
  };

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
            onPress={() => toggleSection('w2w')}
            style={styles.optionButton}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.optionText}>Warehouse To Warehouse</Text>
              </View>

              <Icon
                name={expandedSections.w2w ? 'chevron-down' : 'chevron-right'}
                size={16}
                color="#333"
              />
            </View>
          </TouchableOpacity>

          {expandedSections.w2w && (
            <>
              <TouchableOpacity
                onPress={() => navigateAndHighlight('W2W')}
                style={styles.optionButton}>
                <Text style={styles.optionText}>W2W</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigateAndHighlight('W2WApproveHistory')}
                style={styles.optionButton}>
                <Text style={styles.optionText}>W2W Approved History</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigateAndHighlight('W2Wapproval')}
                style={styles.optionButton}>
                <Text style={styles.optionText}>W2W Approval</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigateAndHighlight('W2WData')}
                style={styles.optionButton}>
                <Text style={styles.optionText}>W2W Data</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            onPress={() => toggleSection('history')}
            style={styles.optionButton}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.optionText}>History</Text>
              </View>
              <Icon
                name={
                  expandedSections.history ? 'chevron-down' : 'chevron-right'
                }
                size={16}
                color="#333"
              />
            </View>
          </TouchableOpacity>
          {expandedSections.history && (
            <>
              <TouchableOpacity
                onPress={() => navigateAndHighlight('UpperHistory')}
                style={styles.optionButton}>
                <Text style={styles.optionText}>Upper History</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigateAndHighlight('InstallationHistoryData')}
                style={styles.optionButton}>
                <Text style={styles.optionText}>Installation Data</Text>
              </TouchableOpacity>


              <TouchableOpacity onPress={() => navigateAndHighlight('ThirdPartyOutgoingHistory')} style={styles.optionButton}>
                <Text style={styles.optionText}>Third Party Outgoing History</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => navigateAndHighlight('RepairHistory')}
                style={styles.optionButton}>
                <Text style={styles.optionText}>Repair History</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigateAndHighlight('RejectedHistory')}
                style={styles.optionButton}>
                <Text style={styles.optionText}>Reject History</Text>
              </TouchableOpacity> */}
            </>
          )}

          <TouchableOpacity
            onPress={() => toggleSection('formFill')}
            style={styles.optionButton}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.optionText}>Form Fill</Text>
              </View>
              <Icon
                name={
                  expandedSections.formFill ? 'chevron-down' : 'chevron-right'
                }
                size={16}
                color="#333"
              />
            </View>
          </TouchableOpacity>
          {expandedSections.formFill && (
            <>
              <TouchableOpacity
                onPress={() =>
                  navigateAndHighlight('ServicePersonRegistration')
                }
                style={styles.optionButton}>
                <Text style={styles.optionText}>
                  Service Person Registration
                </Text>
              </TouchableOpacity>

               {/* <TouchableOpacity
                onPress={() => navigateAndHighlight('Repaired')}
                style={styles.optionButton}>
                <Text style={styles.optionText}>Repair</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigateAndHighlight('Reject')}
                style={styles.optionButton}>
                <Text style={styles.optionText}>Reject</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => navigateAndHighlight('IncomingStock')}
                style={styles.optionButton}>
                <Text style={styles.optionText}>Incoming Stock</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigateAndHighlight('ThirdPartyOutgoingStock')} style={styles.optionButton}>
                <Text style={styles.optionText}>Third Party Outgoing Stock</Text>
              </TouchableOpacity>



              {/* <TouchableOpacity onPress={() => navigateAndHighlight('NewFormInstallation')} style={styles.optionButton}>
                <Text style={styles.optionText}>NewForm Installation</Text>
              </TouchableOpacity> */}
            </>
          )}

          <TouchableOpacity
            onPress={() => toggleSection('System')}
            style={styles.optionButton}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.optionText}>System</Text>
              </View>
              <Icon
                name={
                  expandedSections.System ? 'chevron-down' : 'chevron-right'
                }
                size={16}
                color="#333"
              />
            </View>
          </TouchableOpacity>
          {expandedSections.System && (
            <>
              <TouchableOpacity
                onPress={() => navigateAndHighlight('NewFarmerInstallation')}
                style={styles.optionButton}>
                <Text style={styles.optionText}>NewFarmer Installation</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbd33b',
  },
  menuIcon: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 300,
    backgroundColor: '#fbd33b',
    padding: 20,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  arrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sidebarText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Sidebar;
