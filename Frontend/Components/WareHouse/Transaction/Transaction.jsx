import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import AddTransaction from './AddTransaction'; 


const Transaction = () => {
  const [selectedOption, setSelectedOption] = useState(''); 
  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  return (
    <View style={styles.container}>
      <Text>Select Transaction Type:</Text>
      <Picker
        selectedValue={selectedOption}
        onValueChange={handleOptionChange}
        style={styles.picker}
      >
        <Picker.Item label="Select" value="" />
        <Picker.Item label="Add Transaction" value="add" />
        {/* <Picker.Item label="One Transaction" value="one" /> */}
      </Picker>

      {selectedOption === 'add' && <AddTransaction />} 
      {selectedOption === 'all' && <AllTransaction />}
      {/* {selectedOption === 'one' && <OneTransaction />}  */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default Transaction;
