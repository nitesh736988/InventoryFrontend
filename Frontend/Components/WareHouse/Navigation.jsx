// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import WareHouseDashboard from './Dashboard'; 
// import OrderTrack from './OrderTrack';

// const headerColor = '#186cbf';  

// const Tab = createBottomTabNavigator();

// const TabNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarActiveTintColor: headerColor,
//         tabBarLabelStyle: {
//           fontSize: 15,
//           paddingBottom: 5,
//           fontWeight: '700',
//         },
//         tabBarStyle: {
//           height: 60,
//           paddingTop: 0,
//         },
//         headerStyle: {
//           backgroundColor: headerColor,
//         },
//         headerTintColor: 'white',
//         headerTitleAlign: 'center', 
//         headerTitleStyle: {
//           fontWeight: 'bold',
//         },
//         headerTitle: route.name,  
//         tabBarIcon: ({ color, size }) => {
//           let iconName;

//           if (route.name === 'Dashboard') {
//             iconName = 'home';
//           } else if (route.name === 'OrderTrack') {
//             iconName = 'trending-up';
//           }

//           return (
//             <MaterialCommunityIcons
//               name={iconName}
//               color={color}
//               size={size}
//             />
//           );
//         },
//       })}
//     >
//       <Tab.Screen 
//         name="Dashboard" 
//         component={WareHouseDashboard} 
//         options={{ title: 'Dashboard' }}
//       />
//       <Tab.Screen 
//         name="OrderTrack" 
//         component={OrderTrack} 
//         options={{ title: 'Track Orders' }} 
//       />
//     </Tab.Navigator>
//   );
// };

// const WareHouseNavigation = () => {
//   return <TabNavigator />;
// };

// export default WareHouseNavigation;
