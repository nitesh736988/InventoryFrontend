import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Dashboard from './Admin/Dashboard';
import AddWarehouse from './Admin/AddWareHouse';
import History from './Admin/History';
import OrderTracker from './Admin/OrderTracker';

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

          if (route.name === 'Dashboard') {
            return (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            );
          } else if (route.name === 'AddWarehouse') {
            return (
              <MaterialCommunityIcons
                name="storefront-outline"
                color={color}
                size={size}
              />
            );
          } else if (route.name === 'History') {
            return (
              <MaterialCommunityIcons name="history" color={color} size={size} />
            );
          } else if (route.name === 'OrderTracker') {
            return (
              <MaterialIcons name="event" color={color} size={size} />
            );
          }
        },
      })}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{title: 'Home'}}
      />
      <Tab.Screen
        name="AddWarehouse"
        component={AddWarehouse}
        options={{title: 'Warehouse'}}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{title: 'History'}}
      />
      <Tab.Screen
        name="OrderTracker"
        component={OrderTracker}
        options={{title: 'Track'}}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return <TabNavigator />;
};

export default Navigation;
