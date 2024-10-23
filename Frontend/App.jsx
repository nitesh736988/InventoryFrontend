import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navigation from './Components/NavigationScreen/Navigation';
import ServicePersonNavigation from './Components/ServicePerson/ServicePersonNavigation';
import LoginPage from './Components/LoginPage';
import { StatusBar } from 'react-native';
import ServicePersonRegistration from './Components/ServicePerson/ServicePersonRegistration';
import LogoutPage from './Components/Logout';

const Stack = createStackNavigator();

const App = () => {
  return (
    <>
      <StatusBar backgroundColor='#fbd33b' barStyle='dark-content' />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginPage">
          <Stack.Screen 
            name="LoginPage" 
            component={LoginPage} 
            options={{ title: 'LoginPage', headerShown: false }}  
          />
          <Stack.Screen 
            name="Navigation" 
            component={Navigation} 
            options={{ title: 'Navigation',headerShown: false }} 
          /> 
          <Stack.Screen 
            name="ServicePersonNavigation" 
            component={ServicePersonNavigation} 
            options={{ title: 'ServicePersonNavigation',headerShown: false }} 
          />

          <Stack.Screen 
            name="ServicePersonRegistration" 
            component={ServicePersonRegistration} 
            options={{ title: 'ServicePersonRegistration'}} 
          />

          <Stack.Screen 
            name="LogoutPage" 
            component={LogoutPage} 
            options={{ title: 'LogoutPage'}} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
