import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

const Dropdown = ({dropdownTitle, optionList, optionHandlerList}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleAction = (action) => {
    alert(`${action} Item`);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
        <Text style={styles.buttonText}>{dropdownTitle}</Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>
      
      {isDropdownVisible && (
      <View style={{position: 'absolute', width: '100%',  top: 100, paddingHorizontal: 12,  }}>
        <View style={styles.dropdown}>
            {optionList.map((item, index) => (
                <Button key={index} title= {item} onPress={() => {
                  setDropdownVisible(false)
                  optionHandlerList[index];
                  
                }} />
            ))}
        </View>
        
        </View>
      )}

      
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbd33b',
    paddingTop: 50,
    paddingHorizontal: 12,
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#070604',
    padding: 15,
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },

  arrow: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },

  dropdown: {
    width: '100%',
    borderColor: '#070604',
    margin: 'auto',  
  },
});

export default Dropdown;
