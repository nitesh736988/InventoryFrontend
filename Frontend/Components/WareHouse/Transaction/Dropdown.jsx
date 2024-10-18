import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

const Dropdown = ({ dropdownTitle, optionList, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionSelect = (option) => {
    setIsOpen(false);  
    onSelect(option);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <Text>{dropdownTitle}</Text>
      </TouchableOpacity>

      {isOpen && (
        <FlatList
          data={optionList}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleOptionSelect(item)}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default Dropdown;
