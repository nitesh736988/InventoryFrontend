import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginPage from './Screens/Login&Register/LoginPage';
import Navigation from './Screens/Navigation';
import SidebarModal from './Screens/Admin/SidebarModal';
import AddWareHouse from './Screens/Admin/AddWareHouse';
import WarehouseRegistration from './Screens/Admin/WarehouseRegistration';
import Warehousepersons from './Screens/Admin/Warehousepersons';
import Servicepersons from './Screens/Admin/Servicepersons';
import WarehouseNavigation from './Screens/Warehouse/WarehouseNavigation';
import ServicePersonRegistration from './Screens/Warehouse/ServicePersonRegistration';
import RepairReject from './Screens/Admin/RepairReject';
import RepairRejectData from './Screens/Warehouse/RepairRejectData';
import AddTransaction from './Screens/Warehouse/AddTransaction';
import ServicePersonNavigation from './Screens/ServicePerson/ServicePersonNavigation';
import ApprovalHistoryData from './Screens/Warehouse/ApprovalHistoryData';
import Stockdata from './Screens/Warehouse/Stockdata';
import UpperHistory from './Screens/Warehouse/UpperHistory';
import W2W from './Screens/Warehouse/W2W';
import OrderTracker from './Screens/Admin/OrderTracker';
import W2WApproveHistory from './Screens/Warehouse/W2WApproveHistory';
import W2Wapproval from './Screens/Warehouse/W2Wapproval';
import W2WData from './Screens/Warehouse/W2WData';
import ServicePersonData from './Screens/Admin/ServicePersonData';
import ServicePersonOutgoing from './Screens/Admin/ServicePersonOutgoing';
import W2WApproveData from './Screens/Admin/W2WApproveData';
import Sidebarmodal from './Screens/ServicePerson/Sidebarmodal';
import ApprovedData from './Screens/ServicePerson/ApprovedData';
import ShowComplaints from './Screens/ServicePerson/ShowComplaints';
import InstallationPart from './Screens/ServicePerson/InstallationPart';
import InstallationData from './Screens/ServicePerson/InstallationData';
import InstallationHistoryData from './Screens/Warehouse/InstallationHistoryData';
import InstallationHistory from './Screens/Admin/InstallationHistory';
import ShowComplaintData from './Screens/ServicePerson/ShowComplaintData';
import AddItem from './Screens/Admin/AddItem';
import AddData from './Screens/Warehouse/AddData';
import Repaired from './Screens/Warehouse/Repaired';
import Reject from './Screens/Warehouse/Reject'
import RepairHistory from './Screens/Warehouse/RepairHistory'
import RejectedHistory from './Screens/Warehouse/RejectedHistory';
import EditServicePerson from './Screens/Admin/EditServicePerson';
import QuaterData from './Screens/ServicePerson/QuaterData';
import QuarterlyVisit from './Screens/ServicePerson/QuaterlyVisit';
import SurveyAssign from './Screens/ServicePerson/SurveyAssign';
import Survey from './Screens/ServicePerson/Survey';
import SurvayRegistration from './Screens/Admin/SurvayRegistration';
import NewInstallation from './Screens/Warehouse/NewInstallation';
import AddSystem from './Screens/Warehouse/AddSystem';
import AddSystemData from './Screens/Warehouse/AddSystemData';


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{title: 'LoginPage', headerShown: false}}
        />

        <Stack.Screen
          name="Navigation"
          component={Navigation}
          options={{title: 'Navigation', headerShown: false}}
        />

        <Stack.Screen
          name="SidebarModal"
          component={SidebarModal}
          options={{title: 'SidebarModal', headerShown: false}}
        />

        <Stack.Screen
          name="AddWareHouse"
          component={AddWareHouse}
          options={{title: 'AddWareHouse', headerShown: false}}
        />

        <Stack.Screen
          name="WarehouseRegistration"
          component={WarehouseRegistration}
          options={{title: 'WarehouseRegistration', headerShown: false}}
        />

        <Stack.Screen
          name="Warehousepersons"
          component={Warehousepersons}
          options={{title: 'Warehousepersons', headerShown: false}}
        />

        <Stack.Screen
          name="Servicepersons"
          component={Servicepersons}
          options={{title: 'Servicepersons', headerShown: false}}
        />

        <Stack.Screen
          name="WarehouseNavigation"
          component={WarehouseNavigation}
          options={{title: 'WarehouseNavigation', headerShown: false}}
        />

        <Stack.Screen
          name="ServicePersonRegistration"
          component={ServicePersonRegistration}
          options={{title: 'ServicePersonRegistration', headerShown: false}}
        />

        <Stack.Screen
          name="AddItem"
          component={AddItem}
          options={{title: 'AddItem', headerShown: false}}
        />

        <Stack.Screen
          name="RepairReject"
          component={RepairReject}
          options={{title: 'RepairReject', headerShown: false}}
        />

        <Stack.Screen
          name="RepairRejectData"
          component={RepairRejectData}
          options={{title: 'RepairRejectData', headerShown: false}}
        />

        <Stack.Screen
          name="AddTransaction"
          component={AddTransaction}
          options={{title: 'AddTransaction', headerShown: false}}
        />

        <Stack.Screen
          name="ServicePersonNavigation"
          component={ServicePersonNavigation}
          options={{title: 'ServicePersonNavigation', headerShown: false}}
        />

        <Stack.Screen
          name="ApprovalHistoryData"
          component={ApprovalHistoryData}
          options={{title: 'ApprovalHistoryData', headerShown: false}}
        />

        <Stack.Screen
          name="Stockdata"
          component={Stockdata}
          options={{title: 'Stockdata', headerShown: false}}
        />

        <Stack.Screen
          name="UpperHistory"
          component={UpperHistory}
          options={{title: 'UpperHistory', headerShown: false}}
        />

        <Stack.Screen
          name="W2W"
          component={W2W}
          options={{title: 'W2W', headerShown: false}}
        />

        <Stack.Screen
          name="OrderTracker"
          component={OrderTracker}
          options={{title: 'OrderTracker', headerShown: false}}
        />

        <Stack.Screen
          name="W2WApproveHistory"
          component={W2WApproveHistory}
          options={{title: 'W2WApproveHistory', headerShown: false}}
        />

        <Stack.Screen
          name="W2Wapproval"
          component={W2Wapproval}
          options={{title: 'W2Wapproval', headerShown: false}}
        />

        <Stack.Screen
          name="W2WData"
          component={W2WData}
          options={{title: 'W2WData', headerShown: false}}
        />

        <Stack.Screen
          name="ServicePersonData"
          component={ServicePersonData}
          options={{title: 'ServicePersonData', headerShown: false}}
        />

        <Stack.Screen
          name="ServicePersonOutgoing"
          component={ServicePersonOutgoing}
          options={{title: 'ServicePersonOutgoing', headerShown: false}}
        />

        <Stack.Screen
          name="W2WApproveData"
          component={W2WApproveData}
          options={{title: 'W2WApproveData', headerShown: false}}
        />

        <Stack.Screen
          name="Sidebarmodal"
          component={Sidebarmodal}
          options={{title: 'Sidebarmodal', headerShown: false}}
        />

       <Stack.Screen
          name="InstallationPart"
          component={InstallationPart}
          options={{title: 'InstallationPart', headerShown: false}}
        />

        <Stack.Screen
          name="ApprovedData"
          component={ApprovedData}
          options={{title: 'ApprovedData', headerShown: false}}
        />

       <Stack.Screen
          name="ShowComplaints"
          component={ShowComplaints}
          options={{title: 'ShowComplaints', headerShown: false}}
        />

        <Stack.Screen
          name="InstallationData"
          component={InstallationData}
          options={{title: 'InstallationData', headerShown: false}}
        />

       <Stack.Screen
          name="InstallationHistoryData"
          component={InstallationHistoryData}
          options={{title: 'InstallationHistoryData', headerShown: false}}
        />

       <Stack.Screen
          name="InstallationHistory"
          component={InstallationHistory}
          options={{title: 'InstallationHistory', headerShown: false}}
        />

        <Stack.Screen
          name="ShowComplaintData"
          component={ShowComplaintData}
          options={{title: 'ShowComplaintData', headerShown: false}}
        />

        <Stack.Screen
          name="AddData"
          component={AddData}
          options={{title: 'AddData', headerShown: false}}
        />

        <Stack.Screen
          name="Repaired"
          component={Repaired}
          options={{title: 'Repaired', headerShown: false}}
        />

        <Stack.Screen
          name="Reject"
          component={Reject}
          options={{title: 'Reject', headerShown: false}}
        />

       <Stack.Screen
          name="RepairHistory"
          component={RepairHistory}
          options={{title: 'RepairHistory', headerShown: false}}
        />

        <Stack.Screen
          name="RejectedHistory"
          component={RejectedHistory}
          options={{title: 'RejectedHistory', headerShown: false}}
        />

        <Stack.Screen
          name="EditServicePerson"
          component={EditServicePerson}
          options={{title: 'EditServicePerson', headerShown: false}}
        />

        <Stack.Screen
          name="QuaterData"
          component={QuaterData}
          options={{title: 'QuaterData', headerShown: false}}
        />

        <Stack.Screen
          name="QuarterlyVisit"
          component={QuarterlyVisit}
          options={{title: 'QuarterlyVisit', headerShown: false}}
        />

        <Stack.Screen
          name="SurveyAssign"
          component={SurveyAssign}
          options={{title: 'SurveyAssign', headerShown: false}}
        />

        <Stack.Screen
          name="Survey"
          component={Survey}
          options={{title: 'Survey', headerShown: false}}
        />

        <Stack.Screen
          name="SurvayRegistration"
          component={SurvayRegistration}
          options={{title: 'SurvayRegistration', headerShown: false}}
        />

        <Stack.Screen
          name="NewInstallation"
          component={NewInstallation}
          options={{title: 'NewInstallation', headerShown: false}}
        />

        <Stack.Screen
          name="AddSystem"
          component={AddSystem}
          options={{title: 'AddSystem', headerShown: false}}
        />


        <Stack.Screen
          name="AddSystemData"
          component={AddSystemData}
          options={{title: 'AddSystemData', headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
