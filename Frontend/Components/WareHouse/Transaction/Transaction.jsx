import React from 'react';
import Dropdown from './Dropdown';
import { useNavigation } from '@react-navigation/native';

const TransactionDropDown = () => {
  const navigation = useNavigation();

  const optionsList = ['Add Transaction', 'One Transaction'];

  const handleSelect = (selectedOption) => {
    if (selectedOption === 'Add Transaction') {
      navigation.navigate('AddTransaction');
    } 
    else if (selectedOption === 'One Transaction') {
      navigation.navigate('OneTransaction');
    }
  };

  return (
    <Dropdown 
      dropdownTitle='Transaction'
      optionList={optionsList}
      onSelect={handleSelect} 
    />
  );
};

export default TransactionDropDown;
