import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SurveyDashboard from './SurveyDashboard';
import SurveyAssign from './SurveyAssign';


const headerColor = '#186cbf';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: headerColor,
        tabBarLabelStyle: {
          fontSize: 16,
          paddingBottom: 5,
          fontWeight: '700',
        },
        tabBarStyle: {
          height: 60,
          paddingTop: 0,
        },
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'SurveyDashboard') {
            iconName = 'home';
          } else if (route.name === 'SurveyAssign') {
            iconName = 'truck-delivery';
          }

          return (
            <MaterialCommunityIcons name={iconName} color={color} size={size} />
          );
        },
      })}>
      <Tab.Screen
        name="SurveyDashboard"
        component={SurveyDashboard}
        options={{title: 'Home'}}
      />
      <Tab.Screen
        name="SurveyAssign"
        component={SurveyAssign}
        options={{title: 'SurveyAssign'}}
      />
    </Tab.Navigator>
  );
};

const SurvayNavigation = () => {
  return <TabNavigator />;
};

export default SurvayNavigation;

