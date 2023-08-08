import { useState } from "react"
import Dropdown from "../Dropdown"

interface TableFilterProps{
    columns: {key: string, label: string, path: string, sortable: boolean}[]
    handleFilter: (filterQuery: any) => any
    data: any[]
  }

const TableFilter = ({ columns, handleFilter, data }: TableFilterProps) => {
    const [sortField, setSortField] = useState("")
    const [order, setOrder] = useState(0)
    const sortDisplayIcons = ["", "▼", "▲"]

    const getFieldContent = (path: string): {key: any, value: any, label: string}[] => {
        return [{key: "0", value: "none", label: "None"}].concat(
            Array.from(new Set(data.map(d => getNameFromPath(path, d))))
            .sort()
            .map(n => {
                return {
                    key: n,
                    value: n,
                    label: n
                }
            })
        )
    }
  
    const handleFilterChange = (filterQuery: any) => {
      handleFilter(filterQuery)
    }

    return (
        <div>
            {columns.map(({ key, label, path }) => {
                return (
                    <Dropdown
                        options={getFieldContent(path)}
                        onChange={e => handleFilterChange(
                            e == "none" ?
                            {where: {}} :
                            getFilterQuery(path, e))}
                    />
                )
            })}
        </div>
    )
}
  
const getNameFromPath = (path: string, data: any): string => {
    const s = path.split('.')
    for(var i = 0; i < s.length; i++){
        data = data[s[i]]
    }

    return data
}

const getFilterQuery = (path: string, target: string): any => {
    return {where: _getFilterQuery(path, "eq", target)}
}
  
const _getFilterQuery = (path: string, operator: string, target: string): {} => {
    if(!path) return {_eq: target}
    const s = path.split(/\.(.*)/s)
    return {[s[0]]: _getFilterQuery(s[1], operator, target)}
}

export default TableFilter