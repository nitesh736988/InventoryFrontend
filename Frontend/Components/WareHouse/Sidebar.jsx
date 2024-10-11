import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';


function Dashboard() {
  return (
    <View>
      <Text>Dashboard</Text>
    </View>
  );
}

function AddItem() {
  return (
    <View>
      <Text>Add Item</Text>
    </View>
  );
}

function UpdateItem() {
  return (
    <View>
      <Text>Update Item</Text>
    </View>
  );
}

function DeleteItem() {
  return (
    <View>
      <Text>Delete Item</Text>
    </View>
  );
}

function NewTransaction() {
  return (
    <View>
      <Text>New Transaction</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function Sidebar() {
  return (
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="AddItem" component={AddItem} />
        <Drawer.Screen name="UpdateItem" component={UpdateItem} />
        <Drawer.Screen name="DeleteItem" component={DeleteItem} />
        <Drawer.Screen name="NewTransaction" component={NewTransaction} />
      </Drawer.Navigator>
  );
}

function CustomDrawerContent({ navigation }) {
  const [isItemDropdownOpen, setItemDropdownOpen] = useState(false);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        <Text style={{ fontSize: 18, marginVertical: 10 }}>Dashboard</Text>
      </TouchableOpacity>

      {/* Dropdown for Item */}
      <TouchableOpacity onPress={() => setItemDropdownOpen(!isItemDropdownOpen)}>
        <Text style={{ fontSize: 18, marginVertical: 10 }}>Item</Text>
      </TouchableOpacity>

      {isItemDropdownOpen && (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate('AddItem')}>
            <Text style={{ fontSize: 16, marginVertical: 5 }}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('UpdateItem')}>
            <Text style={{ fontSize: 16, marginVertical: 5 }}>Update Item</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DeleteItem')}>
            <Text style={{ fontSize: 16, marginVertical: 5 }}>Delete Item</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('NewTransaction')}>
        <Text style={{ fontSize: 18, marginVertical: 10 }}>New Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}
