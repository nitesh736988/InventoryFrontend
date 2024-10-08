import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OrderDetails from '../../DrawerNavigationContent/OrderDetails';
import Add from './Add';
import Distributor from './Distributor';
import Dashboard from './Dashboard';


const headerColor = '#186cbf';

const refreshDashboard = () => {
  console.log('Refresh icon clicked');
};

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = ({ navigation }) => {
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
        headerTitle: route.name,
        headerLeft: () => (
          <MaterialCommunityIcons
            name="menu"
            size={24}
            color="white"
            style={{ marginLeft: 15 }}
            onPress={() => navigation.openDrawer()}
          />
        ),
        headerRight: route.name === 'Dashboard' ? () => (
          <MaterialCommunityIcons
            name="refresh"
            size={24}
            color="white"
            style={{ marginRight: 15 }}
            onPress={refreshDashboard}
          />
        ) : undefined,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Add') {
            iconName = 'trending-up';
          } else if (route.name === 'Distributor') {
            iconName = 'information-outline';
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
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Add" component={Add} />
      <Tab.Screen name="Distributor" component={Distributor} />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: headerColor,
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        drawerLabelStyle: {
          fontSize: 15,
        },
        drawerIcon: ({ color, size }) => {
          let iconName;

          // Default icon
          iconName = 'circle';

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      }}
    >
      <Drawer.Screen
        name="Tabs"
        component={TabNavigator}
        options={{
          drawerLabel: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home"
              size={size}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{
          drawerLabel: 'Order Details',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="details"
              size={size}
              color={color}
            />
          ),
        }}
      />
      
    </Drawer.Navigator>
  );
};

const Navigation = () => {
  return (
      <DrawerNavigator />
  );
};

export default Navigation;
