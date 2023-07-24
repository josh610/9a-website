import React from 'react'
import '../../styles/defaults.css'

interface DropdownProps {
    defaultValue: string
    values: string[]
}

const Dropdown = ({defaultValue, values}: DropdownProps) => {
    return (
        <div>
            <select className="Dropdown">
                <option value="none" selected>{defaultValue}</option>
                {values.map(value => {
                    return (
                        <option value={value.toLowerCase()}>{value}</option>
                    )
                })}
            </select>
        </div>
    )
}

export default Dropdown