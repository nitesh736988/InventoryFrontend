import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ServicePersonDashboard from './ServicePersonDashboard';
import OrderDetails from './OrderDetails';
import InOrder from './InOrder';
import OutStatus from './OutStatus';
import ApprovedData from './ApprovedData';

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

          if (route.name === 'ServicePersonDashboard') {
            iconName = 'home';
          } else if (route.name === 'OrderDetails') {
            iconName = 'truck-delivery';
          } else if (route.name === 'InOrder') {
            iconName = 'sort-ascending';
          } else if (route.name === 'OutStatus') {
            iconName = 'skip-next-circle-outline';
          } else if (route.name === 'ApprovedData') {
            iconName = 'cube-outline';
          }

          return (
            <MaterialCommunityIcons name={iconName} color={color} size={size} />
          );
        },
      })}>
      <Tab.Screen
        name="ServicePersonDashboard"
        component={ServicePersonDashboard}
        options={{title: 'Home'}}
      />
      <Tab.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{title: 'OrderDetails'}}
      />

      <Tab.Screen
        name="InOrder"
        component={InOrder}
        options={{title: 'InOrder'}}
      />

      <Tab.Screen
        name="OutStatus"
        component={OutStatus}
        options={{title: 'OutStatus'}}
      />

      <Tab.Screen
        name="ApprovedData"
        component={ApprovedData}
        options={{title: 'Approved'}}
      />
    </Tab.Navigator>
  );
};

const ServicePersonNavigation = () => {
  return <TabNavigator />;
};

export default ServicePersonNavigation;