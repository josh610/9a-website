import { useState } from "react"
import TableBody from "./TableBody"
import TableHead from "./TableHead"
import { DocumentNode } from "graphql"
import { useQuery } from "@apollo/client"
import TableFilter from "./TableFilter"


interface TableProps {
    columns: {key: string, label: string, path: string, sortable: boolean, filterable: boolean}[]
    query: DocumentNode
    queryVariables: {}
    queryName: any
    queryFilterMap: {}
    queryLimits: number[]
}


/**
 * Sortable table from database query
 * @param columns
 * @returns 
 */
const Table = ({ columns, query, queryVariables, queryName, queryFilterMap, queryLimits }: TableProps) => {
    const [queryLimit, setQueryLimit] = useState<Number>(queryLimits[0])
    const [filter, setFilter] = useState(queryFilterMap)

    const {loading, error, data, refetch} = useQuery(query, {variables: queryVariables})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const handleSorting = (sorterQueries: any[], sortOrder: number) => {
        refetch(sorterQueries[sortOrder])
    }

    const handleFilter = (filterQuery: any) => {
        refetch(filterQuery)
    }

    return (
        <>
            <TableFilter columns={columns} handleFilter={handleFilter} data={data[queryName]}/>
            <table className="table">
                <TableHead columns={columns} handleSorting={handleSorting} />
                <TableBody columns={columns} data={data[queryName]} />
            </table>
        </>
    )
}
export default Table