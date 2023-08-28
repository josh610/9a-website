import React from 'react'
import Select from 'react-select'


interface DropdownProps {
  placeholder?: string
  options: {
      key: any
      value: any
      label: string
  }[]
  onChange?: (params: any) => any
}

/**
 * Searchable dropdown menu which performs an action when an option is selected
 * @param options array of JS Objects with properties {key: any, value: any, label: string} 
 * @returns 
 */
const Dropdown = ({ placeholder, options, onChange }: DropdownProps) => {
    return (
      <Select className="w-fit"
        placeholder={placeholder ? placeholder : "Select..."}
        options={options}
        defaultValue={null}
        onChange={e => {if (onChange) onChange(e?.value)}}
      />
    );
  };

export default Dropdown