import React, { useState } from 'react'
import Dropdown from "../Dropdown"
import { getValueFromPath } from "./common"

interface TableFilterProps{
    columns: {key: string, label: string, path: string, filterable?: boolean}[]
    handleFilter: (filterQuery: any) => any
    data: any[]
}

const TableFilter = ({ columns, handleFilter, data }: TableFilterProps) => {
    var f: FilterMap = {}
    columns.forEach(col => {
        if(col.filterable) setQueryFilters(f, col.path, {})
    })
    const [filter, setFilter] = useState<FilterMap>(f)

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
                            onChange={
                                e => {
                                    var newFilter = filter
                                    setQueryFilters(
                                        newFilter,
                                        path,
                                        e == "none" ? {} : {_eq: e}
                                    )
                                    setFilter(newFilter)
                                    handleFilter(newFilter)
                                }
                            }
                        />
                    </div>
                )
            })}
        </div>
    )
}


interface FilterMap {
    [key: string]: FilterMap | {}
}

/**
 * Given a JS object, creates key value pairs based on args, nesting when needed
 * ie. given o = {}, path = "path.to", target = {_eq: "target"}, sets o equal to {path: {to: {_eq: "target"}}}
 * @param o 
 * @param path 
 * @param target 
 */
const setQueryFilters = (o: FilterMap, path: string, target: {}) => {
    const s = path.split(/\.(.*)/s)
    if(!s[1]) {
        o[s[0]] = target
    }
    else{
        o[s[0]] = {}
        setQueryFilters(o[s[0]], s[1], target)
    }
}

export default TableFilter