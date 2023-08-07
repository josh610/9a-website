import React from 'react'
import { useState } from 'react'
import '../../styles/defaults.css'

interface DropdownProps {
    options: {
        value: any
        label: string
    }[]
    onChange?: (params: any) => any
}

const Dropdown = ({options, onChange}: DropdownProps) => {
    const [selectedOption, setSelectedOption] = useState(options[0].value);

    return (
        <select
          className='Dropdown'
          value={selectedOption}
          onChange={e => {
            if (onChange) onChange(options[e.target.selectedIndex].value)
            return setSelectedOption(options[e.target.selectedIndex].value)}}>
          {options.map(o => {
            return (
            <option key={o.value} value={o.value}>{o.label}</option>
          )})}
        </select>
    );
  };

export default Dropdown