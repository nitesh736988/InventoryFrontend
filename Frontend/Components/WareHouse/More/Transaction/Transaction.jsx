import React from 'react';
import Dropdown from '../../../Common/Dropdown';


const TransactionDropDown = () => {

  const optionsList = [ 'Add', 'Update', 'Delete', 'All Transaction', "One Transaction"];
  return(
    <Dropdown 
      dropdownTitle='Transaction'
      optionList={optionsList}
    />
  )
}

export default TransactionDropDown;