import React from 'react'
import Dropdown from "../Dropdown"
import { getValueFromPath } from "./common"

interface TableFilterProps{
    columns: {key: string, label: string, path: string, filterable?: boolean}[]
    handleFilter: (filterQuery: any) => any
    data: any[]
  }

const TableFilter = ({ columns, handleFilter, data }: TableFilterProps) => {
    const getFieldContent = (path: string): {key: any, value: any, label: string}[] => {
        return [{key: "0", value: "none", label: "None"}].concat(
            Array.from(new Set(data.map(d => getValueFromPath(path, d))))
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

    return (
        <div className="flex">
            {columns.map(({ key, label, path, filterable }) => {
                if(filterable) return (
                    <div
                        className="w-fit text-center"
                        key={key}
                    >
                        {label}
                        <Dropdown
                            options={getFieldContent(path)}
                            onChange={e => handleFilter(
                                e == "none" ?
                                {where: {}} :
                                getFilterQuery(path, e))}
                        />
                    </div>
                )
            })}
        </div>
    )
}

/**
 * Given a string path and a target, creates a JS object
 * @returns JS object, ie. {path: {to: {_eq: target}}}
 */
const getFilterQuery = (path: string, target: string): any => {
    return {where: _getFilterQuery(path, "eq", target)}
}
  
const _getFilterQuery = (path: string, operator: string, target: string): {} => {
    if(!path) return {_eq: target}
    const s = path.split(/\.(.*)/s)
    return {[s[0]]: _getFilterQuery(s[1], operator, target)}
}

export default TableFilter