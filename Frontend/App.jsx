import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navigation from './Components/NavigationScreen/Navigation';


const Stack = createStackNavigator();

const App = () => {
  return (
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Navigation">

        <Stack.Screen 
          name="Navigation" 
          component={Navigation} 
          options={{ title: 'Navigation', headerShown: false }} 
        /> 
  
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
