import React from 'react'
import Select from 'react-select'


interface DropdownProps {
    options: {
        key: any
        value: any
        label: string
    }[]
    onChange?: (params: any) => any
}

/**
 * Dropdown menu which performs an action when an option is selected
 * @param options array of JS Objects with properties {key: any, value: any, label: string} 
 * @returns 
 */
const Dropdown = ({ options, onChange }: DropdownProps) => {
    return (
      <Select className="border-2 w-fit"
        options={options}
        defaultValue={options[0]}
        onChange={e => {if (onChange) onChange(e?.value)}}
      />
    );
  };

export default Dropdown