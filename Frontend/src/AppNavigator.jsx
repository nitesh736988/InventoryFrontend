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
import AddItem from './Screens/Warehouse/AddItem';
import RepairReject from './Screens/Admin/RepairReject';
import DefectiveItem from './Screens/Warehouse/DefectiveItem';
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
          name="DefectiveItem"
          component={DefectiveItem}
          options={{title: 'DefectiveItem', headerShown: false}}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
