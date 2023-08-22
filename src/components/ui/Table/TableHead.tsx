import { useState } from "react";

interface THeadProps {
    columns: {key: string, label: string, path: string, sortable?: boolean}[]
    handleSorting: (sorterQueries: any[]) => any
}


const TableHead = ({ columns, handleSorting }: THeadProps) => {
    const [sortField, setSortField] = useState("")
    const [order, setOrder] = useState(0)
    const sortDisplayIcons = ["", "▼", "▲"]
  
    const handleSortingChange = (key: string, sorterQueries: any[]) => {
      const sortOrder =
        key == sortField ? (order + 1) % 3 : 1
      setSortField(key)
      setOrder(sortOrder)
      handleSorting(sorterQueries[sortOrder])
    }
  
    return (
      <thead>
        <tr>
          {columns.map(({ key, label, sortable, path }) => {
            const lbl = label + (sortField == key ? sortDisplayIcons[order] : "")
            return (
              <th key={key} onClick={() => sortable ? handleSortingChange(key, getSorterQueries(path)) : {}}>
                {lbl}
              </th>
            );
          })}
        </tr>
      </thead>
    )
}

const getSorterQueries = (path: string): any[] => {
  return [
    {order_by: {}},
    {order_by: _getSorterQueries(path, "asc")},
    {order_by: _getSorterQueries(path, "desc")}
  ]
}

const _getSorterQueries = (path: string, order: string): {} | string => {
  if(!path) return order
  const ss = path.split(/\.(.*)/s)
  return {[ss[0]]: _getSorterQueries(ss[1], order)}
}

export default TableHead