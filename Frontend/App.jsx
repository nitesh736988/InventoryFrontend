import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './Components/LoginPage';
// import AdminDashboard from './Components/AdminDashboard';
import Home from './Components/Home';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen 
          name="LoginPage" 
          component={LoginPage} 
          options={{ title: 'Login', headerShown: false }} 
        />
        {/* <Stack.Screen 
          name="Inventory_Stocks" 
          component={AdminDashboard} 
          options={{ title: 'Inventory Stocks'}} 
        /> */}

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
