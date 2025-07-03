import {View, Text, ActivityIndicator} from 'react-native';
import React, { useState, useEffect } from 'react';
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
// import RepairRejectData from './Screens/Warehouse/RepairRejectData';
import AddTransaction from './Screens/Warehouse/AddTransaction';
import ServicePersonNavigation from './Screens/ServicePerson/ServicePersonNavigation';
import ApprovalHistoryData from './Screens/Warehouse/ApprovalHistoryData';
import IncomingStock from './Screens/Warehouse/IncomingStock';
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
import SurveyAssign from './Screens/Survey/SurveyAssign';
import Survey from './Screens/Survey/Survey';
import SurvayRegistration from './Screens/Admin/SurvayRegistration';
import NewInstallation from './Screens/ServicePerson/NewInstallation';
import AddSystem from './Screens/Admin/AddSystem';
import AddSystemData from './Screens/Admin/AddSystemData';
import ItemStockUpdate from './Screens/Warehouse/ItemStockUpdate';
import AssignSystem from './Screens/Warehouse/AssignSystem';
import SurvayNavigation from './Screens/Survey/SurvayNavigation';
import SurveyDashboard from './Screens/Survey/SurveyDashboard';
import SurveyAssignData from './Screens/ServicePerson/SurveyAssignData'
import SurvayData from './Screens/ServicePerson/SurveyData'
import AddSystemSubItem from './Screens/Admin/AddSystemSubItem';
import NewFormInstallation from './Screens/Warehouse/NewFormInstallation';
import NewFarmerInstallation from './Screens/Warehouse/NewFarmerInstallation';
// import ApprovalNewInstallation from './Screens/ServicePerson/ApprovalNewInstallation';
import InOrder from './Screens/ServicePerson/InOrder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ServicePersonLocation from './Screens/ServicePerson/ServicePersonLocation'
import SurveyPersonLocation from './Screens/Survey/SurveyPersonLocation';
import InstallationStock from './Screens/ServicePerson/InstallationStock';
import ThirdPartyOutgoingStock from './Screens/Warehouse/ThirdPartyOutgoingStock';
import ThirdPartyOutgoingHistory from './Screens/Warehouse/ThirdPartyOutgoingHistory';
import ShowSystem from './Screens/Warehouse/ShowSystem';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShowSystemItem from './Screens/Warehouse/ShowSystemItem';
import BomData from './Screens/Warehouse/BomData';
import InstallationW2W from './Screens/Warehouse/InstallationW2W'
import W2WmhApproval from './Screens/Warehouse/W2WmhApproval';
import AllStockUpdateHistory from './Screens/Admin/AllStockUpdateHistory';
import ApprovalIncomingInstallation from './Screens/Warehouse/ApprovalIncomingInstallation';
import ApprovalOutgoingInstallation from './Screens/Warehouse/ApprovalOutgoingInstallation';
import InstallationOutgoingHistory from './Screens/Warehouse/InstallationOutgoingHistory';
import InstallationIncomingHistory from './Screens/Warehouse/InstallationIncomingHistory';
import UpperIncomingItems from './Screens/Warehouse/UpperIncomingItems';
import OutgoingInstallation from './Screens/Warehouse/OutgoingInstallation';
import ServiceApprovalDataMh from './Screens/ServicePerson/ServiceApprovalDataMh';
import ApproveDataMh from './Screens/ServicePerson/ApproveDataMh';
import InstallationForm from './Screens/ServicePerson/InstallationForm';
import ShowPath from './Component/Map/ShowPath';
import BarcodeScanner from './Screens/Warehouse/BarcodeScanner';
import NewInstallationTransactionData from './Screens/Warehouse/NewInstallationTransactionData';
import TravelsData from './Screens/ServicePerson/TravelsData';


const Stack = createStackNavigator();

const AppNavigator = () => {

  const [initialRoute, setInitialRoute] = useState('LoginPage');
  const [loading, setLoading] = useState(true);


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} >
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

        {/* <Stack.Screen
          name="RepairRejectData"
          component={RepairRejectData}
          options={{title: 'RepairRejectData', headerShown: false}}
        /> */}

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
          name="IncomingStock"
          component={IncomingStock}
          options={{title: 'IncomingStock', headerShown: false}}
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

        <Stack.Screen
          name="ItemStockUpdate"
          component={ItemStockUpdate}
          options={{title: 'ItemStockUpdate', headerShown: false}}
        />

        <Stack.Screen
          name="AssignSystem"
          component={AssignSystem}
          options={{title: 'AssignSystem', headerShown: false}}
        />

        <Stack.Screen
          name="SurvayNavigation"
          component={SurvayNavigation}
          options={{title: 'SurvayNavigation', headerShown: false}}
        />

        <Stack.Screen
          name="SurveyDashboard"
          component={SurveyDashboard}
          options={{title: 'SurveyDashboard', headerShown: false}}
        />

        <Stack.Screen
          name="SurveyAssignData"
          component={SurveyAssignData}
          options={{title: 'SurveyAssignData', headerShown: false}}
        />

        <Stack.Screen
          name="SurveyData"
          component={SurvayData}
          options={{title: 'SurveyData', headerShown: false}}
        />

       <Stack.Screen
          name="AddSystemSubItem"
          component={AddSystemSubItem}
          options={{title: 'AddSystemSubItem', headerShown: false}}
        />

        <Stack.Screen
          name="NewFormInstallation"
          component={NewFormInstallation}
          options={{title: 'NewFormInstallation', headerShown: false}}
        />

        <Stack.Screen
          name="NewFarmerInstallation"
          component={NewFarmerInstallation}
          options={{title: 'NewFarmerInstallation', headerShown: false}}
        />

        {/* <Stack.Screen
          name="ApprovalNewInstallation"
          component={ApprovalNewInstallation}
          options={{title: 'ApprovalNewInstallation', headerShown: false}}
        /> */}

        <Stack.Screen
          name="InOrder"
          component={InOrder}
          options={{title: 'InOrder', headerShown: false}}
        />

        <Stack.Screen
          name="ServicePersonLocation"
          component={ServicePersonLocation}
          options={{title: 'InOrder', headerShown: false}}
        />


        <Stack.Screen
          name="SurveyPersonLocation"
          component={SurveyPersonLocation}
          options={{title: 'InOrder', headerShown: false}}
        />

        <Stack.Screen
          name="InstallationStock"
          component={InstallationStock}
          options={{title: 'InstallationStock', headerShown: false}}
        />

        <Stack.Screen
          name="ThirdPartyOutgoingStock"
          component={ThirdPartyOutgoingStock}
          options={{title: 'ThirdPartyOutgoingStock', headerShown: false}}
        />

        <Stack.Screen
          name="ThirdPartyOutgoingHistory"
          component={ThirdPartyOutgoingHistory}
          options={{title: 'ThirdPartyOutgoingHistory', headerShown: false}}
        />

        <Stack.Screen
          name="ShowSystem"
          component={ShowSystem}
          options={{title: 'ShowSystem', headerShown: false}}
        />

        <Stack.Screen
          name="ShowSystemItem"
          component={ShowSystemItem}
          options={{title: 'ShowSystemItem', headerShown: false}}
        />

        <Stack.Screen
          name="BomData"
          component={BomData}
          options={{title: 'BomData', headerShown: false}}
        />

        <Stack.Screen
          name="InstallationW2W"
          component={InstallationW2W}
          options={{title: 'InstallationW2W', headerShown: false}}
        />

        <Stack.Screen
          name="W2WmhApproval"
          component={W2WmhApproval}
          options={{title: 'W2WmhApproval', headerShown: false}}
        />

         <Stack.Screen
          name="AllStockUpdateHistory"
          component={AllStockUpdateHistory}
          options={{title: 'AllStockUpdateHistory', headerShown: false}}
        />

        <Stack.Screen
          name="ApprovalOutgoingInstallation"
          component={ApprovalOutgoingInstallation}
          options={{title: 'ApprovalOutgoingInstallation', headerShown: false}}
        />

        <Stack.Screen
          name="ApprovalIncomingInstallation"
          component={ApprovalIncomingInstallation}
          options={{title: 'ApprovalIncomingInstallation', headerShown: false}}
        />

        <Stack.Screen
          name="InstallationOutgoingHistory"
          component={InstallationOutgoingHistory}
          options={{title: 'InstallationOutgoingHistory', headerShown: false}}
        />

        <Stack.Screen
          name="InstallationIncomingHistory"
          component={InstallationIncomingHistory}
          options={{title: 'InstallationIncomingHistory', headerShown: false}}
          />

          <Stack.Screen
          name="UpperIncomingItems"
          component={UpperIncomingItems}
          options={{title: 'UpperIncomingItems', headerShown: false}}
          />

          <Stack.Screen
          name="OutgoingInstallation"
          component={OutgoingInstallation}
          options={{title: 'OutgoingInstallation', headerShown: false}}
          />

          <Stack.Screen
          name="ServiceApprovalDataMh"
          component={ServiceApprovalDataMh}
          options={{title: 'ServiceApprovalDataMh', headerShown: false}}
          />

          <Stack.Screen
          name="ApproveDataMh"
          component={ApproveDataMh}
          options={{title: 'ApproveDataMh', headerShown: false}}
          />

          <Stack.Screen
          name="InstallationForm"
          component={InstallationForm}
          options={{title: 'InstallationForm', headerShown: false}}
          />

          <Stack.Screen
          name="ShowPath"
          component={ShowPath}
          options={{title: 'ShowPath', headerShown: false}}
          />

          <Stack.Screen
          name="BarcodeScanner"
          component={BarcodeScanner}
          options={{title: 'BarcodeScanner', headerShown: false}}
          />

          <Stack.Screen
          name="NewInstallationTransactionData"
          component={NewInstallationTransactionData}
          options={{title: 'NewInstallationTransactionData', headerShown: false}}
          />

          <Stack.Screen
          name="TravelsData"
          component={TravelsData}
          options={{title: 'TravelsData', headerShown: false}}
          />


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
