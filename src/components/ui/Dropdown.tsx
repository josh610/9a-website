import React from 'react'
import { useState } from 'react'
import '../../styles/defaults.css'

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
    const [selectedOption, setSelectedOption] = useState(options[0].key)

    return (
      <select className="border-2"
        value={selectedOption}
        onChange={e => {
          if (onChange) onChange(options[e.target.selectedIndex].value)
          return setSelectedOption(options[e.target.selectedIndex].key)}}>
        {options.map(o => {
          return (
              <option key={o.key} value={o.key}>{o.label}</option>
        )})}
      </select>
    );
  };

export default Dropdown