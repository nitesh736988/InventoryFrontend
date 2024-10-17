import React from 'react';
import Dropdown from '../../../Common/Dropdown';
import { Alert } from 'react-native';

const ItemDropDown = () => {

  const addItemFunc = () =>{
    navigation.navigate('add');
  }
  
  const updateItemFunc = () => {
    Alert.alert('Update Item Page Opened');
  }

  const deleteItemFunc = () => {
    Alert.alert('Delete Item Page Opened');
  }

  const optionsList = [ 'New Item', 'Update Item', 'Delete Item'];
  const optionHandlerList = [ addItemFunc, updateItemFunc, deleteItemFunc];
  return(
    <Dropdown 
      dropdownTitle='Item'
      optionList={optionsList}
      optionHandlerList={optionHandlerList}
    />
  )
}

export default ItemDropDown;