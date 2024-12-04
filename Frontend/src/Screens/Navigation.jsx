import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dashboard from './Admin/Dashboard';
import AddWarehouse from './Admin/AddWareHouse';
import History from './Admin/History';
import SidebarModal from './Admin/SidebarModal';


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
            iconName = 'home';
          } else if (route.name === 'AddWarehouse') {
            iconName = 'warehouse';
          } 

           else if (route.name === 'History') {
            iconName = 'history';
          }

          else if (route.name === 'SidebarModal') {
            iconName = 'history';
          }

          return (
            <MaterialCommunityIcons name={iconName} color={color} size={size} />
          );
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
        name="SidebarModal"
        component={SidebarModal}
        options={{title: 'More'}}
      />

    </Tab.Navigator>
  );
};

const Navigation = () => {
  return <TabNavigator />;
};

export default Navigation;
