import React from 'react'
import { DocumentNode, useQuery } from '@apollo/client'
import Select from 'react-select'


interface DropdownProps {
  placeholder?: string
  options: {
      key: any
      value: any
      label: string
  }[]
  onChange: (params: any) => any
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
      onChange={e => onChange(e?.value)}
    />
  )
}


interface DropdownFromQueryProps extends DropdownProps {
  query: DocumentNode
  tableName: string
  keyPath: string
  valuePath: string
  labelPath: string
}

/**
 * Extends Dropdown by taking a query instead of options as input, and creates options from that query
 * @param props
 * @returns 
 */
export const DropdownFromQuery = (props: Omit<DropdownFromQueryProps, "options">) => {
  const {loading, error, data} = useQuery(props.query)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error : {error.message}</p>

  const options = data[props.tableName].map((d: any) => {
    return {
      key: d[props.keyPath],
      value: d[props.valuePath],
      label: d[props.labelPath]
    }
  })

  return <Dropdown placeholder={props.placeholder} options={options} onChange={props.onChange}></Dropdown>
}

export default Dropdown