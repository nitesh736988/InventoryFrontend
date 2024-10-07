import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginPage from './Components/LoginPage';
import Home from './Components/Home';
import Add from './Components/Add';
import Distributor from './Components/Distributor';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function AdminDashboard() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Add" component={Add} />
      <Tab.Screen name="Distributor" component={Distributor} />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
       
        <Stack.Screen 
          name="LoginPage" 
          component={LoginPage} 
          options={{ title: 'Login', headerShown: false }} 
        />

        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboard} 
          options={{ title: 'Admin Dashboard' }} 
        />

        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: 'Home'}} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
