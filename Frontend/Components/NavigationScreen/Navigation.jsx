import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dashboard from './Dashboard';
import OrderDetails from './Order';
import AddItem from '../WareHouse/AddItem';
import returnItem from '../WareHouse/Transaction/ReturnItem'

const headerColor = '#186cbf';  

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } 
          else if (route.name === 'OrderDetails') {
            iconName = 'cube-outline';
          }
          else if (route.name === 'AddItem') {
            iconName = 'plus';
          }
          
          else if (route.name === 'returnItem') {
            iconName = 'truck-delivery'; 
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              color={color}
              size={size}
            />
          );
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="OrderDetails" 
        component={OrderDetails} 
        options={{ title: 'Orders' }} 
      />
      <Tab.Screen 
        name="AddItem" 
        component={AddItem} 
        options={{ title: 'AddItem' }} 
      />


      <Tab.Screen 
        name="returnItem" 
        component={returnItem} 
        options={{ title: 'return' }} 
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <TabNavigator />
  );
};

export default Navigation;
