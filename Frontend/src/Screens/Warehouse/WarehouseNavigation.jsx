import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Outgoing from './Outgoing';
import Sidebar from './Sidebar';
import WarehouseDashboard from './WarehouseDashboard';
import ApprovalData from './ApprovalData';


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
           else if (route.name === 'Sidebar') {
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
        options={{title: 'Outgoing'}}
      />

      <Tab.Screen
        name="ApprovalData"
        component={ApprovalData}
        options={{title: 'Incoming'}}
      />
      <Tab.Screen
        name="Sidebar"
        component={Sidebar}
        options={{title: 'More'}}
      />
    </Tab.Navigator>
  );
};

const WarehouseNavigation = () => {
  return <TabNavigator />;
};

export default WarehouseNavigation;
