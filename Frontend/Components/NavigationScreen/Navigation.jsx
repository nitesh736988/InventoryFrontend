// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// // import Add from './Add';
// // import Distributor from './Distributor';
// import Dashboard from './Dashboard';
// import OrderTrack from './OrderTrack';
// const headerColor = '#186cbf';

// const Tab = createBottomTabNavigator();

// const TabNavigator = ({ navigation }) => {
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
//         headerTitle: route.name,
       
       
//         tabBarIcon: ({ color, size }) => {
//           let iconName;

//           if (route.name === 'Dashboard') {
//             iconName = 'home';
//           } else if (route.name === 'OrderTrack') {
//             iconName = 'trending-up';
//           }

//           //   else if (route.name === 'Add') {
//           //     iconName = 'trending-up';
//           // } else if (route.name === 'Distributor') {
//           //   iconName = 'information-outline';
//           // }

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
//       <Tab.Screen name="Dashboard" component={Dashboard} />
//       <Tab.Screen name="OrderTrack" component={OrderTrack} />
//       {/* <Tab.Screen name="Add" component={Add} />
//       <Tab.Screen name="Distributor" component={Distributor} /> */}
//     </Tab.Navigator>
//   );
// };

// const Navigation = () => {
//   return <TabNavigator />;
// };

// export default Navigation;

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dashboard from './Dashboard';
import OrderTrack from './OrderTrack';

const headerColor = '#186cbf';  

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
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
        headerTitleAlign: 'center', 
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: route.name,  
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'OrderTrack') {
            iconName = 'trending-up';
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
        name="Dashboard" 
        component={Dashboard}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="OrderTrack" 
        component={OrderTrack} 
        options={{ title: 'Track Orders' }} 
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return <TabNavigator />;
};

export default Navigation;
