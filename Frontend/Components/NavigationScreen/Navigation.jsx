import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dashboard from './Dashboard';
import OrderDetails from './OrderDetails';
import More from '../WareHouse/More/More';
import NewItem from '../WareHouse/More/Item/NewItem';
import { createStackNavigator } from '@react-navigation/stack';

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
          else if (route.name === 'More') {
            iconName = 'dots-horizontal'; 
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
        name="More" 
        component={More} 
        options={{ title: 'More' }} 
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
