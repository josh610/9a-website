import React from 'react'
import { useState } from "react"
import TableBody from "./TableBody"
import TableHead from "./TableHead"
import { DocumentNode } from "graphql"
import { useQuery } from "@apollo/client"
import TableFilter from "./TableFilter"
import Dropdown from "../Dropdown"


interface TableProps {
    columns: {key: string, label: string, path: string, sortable?: boolean, filterable?: boolean, links?: boolean}[]
    query: DocumentNode
    queryVariables: {}
    queryName: any
    queryFilterMap: {}
    queryLimits: number[]
}


/**
 * Table from database query with options to sort, filter and limit query results
 */
const Table = ({ columns, query, queryVariables, queryName, queryFilterMap, queryLimits }: TableProps) => {
    const [limit, setLimit] = useState<number>(queryLimits[0])

    const {loading, error, data, refetch} = useQuery(query, {variables: queryVariables})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const changeFilter = (filter: {}) => {
        refetch({where: filter})
    }

    return (
        <div>
            Limit:
            <Dropdown
                options={queryLimits.map(l => {
                    return {
                        key: l,
                        value: l,
                        label: l.toString()
                    }
                })}
                onChange={e => {
                    setLimit(e)
                }}
            />
            <TableFilter columns={columns} handleFilter={changeFilter} data={data[queryName]}/>
            <table className="">
                <TableHead columns={columns} handleSorting={refetch}/>
                <TableBody columns={columns} data={data[queryName]} limit={limit}/>
            </table>
        </div>
    )
}
export default Table