import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navigation from './Components/NavigationScreen/Navigation';
import LoginPage from './Components/LoginPage';
import Dashboard from './Components/NavigationScreen/Dashboard';
import ServicePersonRegistration from './Components/ServicePerson/ServicePersonRegistration';
import AddTransactionScreen from './Components/WareHouse/Transaction/Dropdown'


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
    
  <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
 


      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

export default App;
