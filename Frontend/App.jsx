import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navigation from './Components/NavigationScreen/Navigation';
import LoginPage from './Components/LoginPage';
import ServicePersonRegistration from './Components/ServicePerson/ServicePersonRegistration';


const Stack = createStackNavigator();

const App = () => {
  return (

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
          options={{ title: 'Navigation', headerShown: false }} 
        /> 

        <Stack.Screen 
          name="ServicePersonRegistration" 
          component={ServicePersonRegistration} 
          options={{ title: 'ServicePersonRegistration', headerShown: false }} 
        /> 
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

export default App;
