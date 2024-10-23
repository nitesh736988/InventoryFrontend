import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ServicePersonDashboard from './ServicePersonDashboard';
import OrderDetails from './OrderDetails';
import RequestItem from './RequestItem';

const headerColor = '#186cbf'; 


const Tab = createBottomTabNavigator();

const ServicePersonTabNavigator = () => {
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
        headerShown: false, 
        tabBarIcon: ({ color, size }) => {
          let iconName;

        
          if (route.name === 'ServicePersonDashboard') {
            iconName = 'home';
          } else if (route.name === 'OrderDetails') {
            iconName = 'layers-triple';
          } else if (route.name === 'RequestItem') {
            iconName = 'plus';
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
        name="ServicePersonDashboard" 
        component={ServicePersonDashboard} 
        options={{ title: 'ServicePersonDashboard' }} 
      />
     
      <Tab.Screen 
        name="OrderDetails" 
        component={OrderDetails} 
        options={{ title: 'Order Details' }} 
      />

    
      <Tab.Screen 
        name="RequestItem" 
        component={RequestItem} 
        options={{ title: 'Request Item' }} 
      />
    </Tab.Navigator>
  );
};

const ServicePersonNavigation = () => {
  return <ServicePersonTabNavigator />;
};

export default ServicePersonNavigation;
