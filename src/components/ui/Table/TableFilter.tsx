import React, { useState } from 'react'
import Dropdown from "../Dropdown"
import { Obj, valueFromPath, objectFromPath } from '../../../common/ParserFunctions'

interface TableFilterProps{
    columns: {key: string, label: string, path: string, filterable?: boolean}[]
    handleFilter: (filterQuery: any) => any
    data: any[]
}

const TableFilter = ({ columns, handleFilter, data }: TableFilterProps) => {
    var f: Obj = {}
    columns.forEach(col => {
        if(col.filterable) objectFromPath(f, col.path, {})
    })
    const [filter, setFilter] = useState<Obj>(f)

    const changeFilter = (newFilter: Obj) => {
        setFilter(newFilter)
        handleFilter({where: filter})
    }

    const getFieldContent = (path: string): {key: any, value: any, label: string}[] => {
        return [{key: "0", value: "none", label: "None"}].concat(
            Array.from(new Set(data.map(d => valueFromPath(path, d))))
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
                                    objectFromPath(
                                        newFilter,
                                        path,
                                        e == "none" ? {} : {_eq: e}
                                    )
                                    changeFilter(newFilter)
                                }
                            }
                        />
                    </div>
                )
            })}
            {/*<button className="bg-slate-500" onClick={() => changeFilter(f)}>Clear Filters</button>*/}
        </div>
    )
}

export default TableFilter