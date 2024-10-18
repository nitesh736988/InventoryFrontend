import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dashboard from './Dashboard';
import OrderDetails from './OrderDetails';
import { createStackNavigator } from '@react-navigation/stack';
import AddItem from '../WareHouse/AddItem';
import Order from '../WareHouse/Transaction/Order';


const headerColor = '#186cbf';  

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
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
        headerStyle: {
          backgroundColor: headerColor,
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center', 
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: route.name,  
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } 
          else if (route.name === 'OrderDetails') {
            iconName = 'layers-triple';
          }
          else if (route.name === 'AddItem') {
            iconName = 'add';
          }

          else if (route.name === 'Order') {
            iconName = 'reorder'; 
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
        options={{ title: 'Order' }} 
      >
        {/* <Stack.Navigator> */}
            {/* <Stack.Screen name='add' component={NewItem} /> */}
        {/* </Stack.Navigator> */}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
      <TabNavigator />
  );
};

export default Navigation;  
