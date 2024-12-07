import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Outgoing from './Outgoing';
import WarehouseDashboard from './WarehouseDashboard';
import ApprovalData from './ApprovalData';
import AddTransaction from './AddTransaction';


const headerColor = '#186cbf';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: headerColor,
        tabBarLabelStyle: {
          fontSize: 16,
          paddingBottom: 5,
          fontWeight: '700',
        },
        tabBarStyle: {
          height: 60,
          paddingTop: 0,
        },
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'WarehouseDashboard') {
            iconName = 'home';
          } else if (route.name === 'Outgoing') {
            iconName = 'arrow-right-bold-circle-outline';
          } else if (route.name === 'ApprovalData') {
            iconName = 'cube-outline';
          }
           else if (route.name === 'AddTransaction') {
            iconName = 'cube-outline';
          }

          return (
            <MaterialCommunityIcons name={iconName} color={color} size={size} />
          );
        },
      })}>
      <Tab.Screen
        name="WarehouseDashboard"
        component={WarehouseDashboard}
        options={{title: 'Home'}}
      />
      <Tab.Screen
        name="Outgoing"
        component={Outgoing}
        options={{title: 'OutData'}}
      />

      <Tab.Screen
        name="ApprovalData"
        component={ApprovalData}
        options={{title: 'InData'}}
      />
      <Tab.Screen
        name="AddTransaction"
        component={AddTransaction}
        options={{title: 'Outgoing'}}
      />
    </Tab.Navigator>
  );
};

const WarehouseNavigation = () => {
  return <TabNavigator />;
};

export default WarehouseNavigation;
