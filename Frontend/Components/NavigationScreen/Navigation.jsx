import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dashboard from './Dashboard';
import OrderDetails from './OrderDetails';
import AddItem from '../WareHouse/AddItem';
import Order from '../WareHouse/Transaction/Order';

const headerColor = '#186cbf';  

const Tab = createBottomTabNavigator();

const TabNavigator = ( { route }) => {
  // const { isClicked } = route.params;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: headerColor,
        tabBarLabelStyle: {
          fontSize: 15,
          paddingBottom: 5,
          fontWeight: '700',
        },
        tabBarStyle: {
          height: 60,
          paddingTop: 0,
        },
        headerShown: false, // This will hide the header for all screens
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } 
          else if (route.name === 'OrderDetails') {
            iconName = 'layers-triple';
          }
          else if (route.name === 'AddItem') {
            iconName = 'plus';
          }
          else if (route.name === 'Order') {
            iconName = 'cart'; 
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
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="OrderDetails" 
        component={OrderDetails} 
        options={{ title: 'OrderDetails' }} 
      />
      <Tab.Screen 
        name="AddItem" 
        component={AddItem} 
        options={{ title: 'AddItem' }} 
      />
      <Tab.Screen 
        name="Order" 
        component={Order} 
        // initialParams={ { isClicked }}
        options={{ title: 'Order' }} 
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
