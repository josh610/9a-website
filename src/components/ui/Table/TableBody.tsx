import React from 'react'
import { Link } from "react-router-dom"
import { valueFromPath } from '../../../common/ParserFunctions'
const Pluralize = require('pluralize')

interface TBodyProps {
    columns: {key: string, label: string, path: string, links?: boolean}[]
    data: any[]
    limit: number
}

const TableBody = ({ columns, data, limit }: TBodyProps) => {
    var colorRow = false

    return (
        <tbody>
            {data.map(d => {
                const cName = colorRow ? "bg-slate-200" : ""
                colorRow = !colorRow
                return (
                    <tr className={cName}
                        key={d.id}>
                        {columns.map(col => {
                            const name = valueFromPath(col.path, d)
                            const page = Pluralize(col.key)

                            // get path to ID
                            const idPathStrings = col.path.split('.')
                            idPathStrings[idPathStrings.length - 1] = "id"
                            const id = valueFromPath(idPathStrings.join('.'), d)
                            
                            return (
                                <td className="border-2 border-black" key={col.key}>
                                    {
                                        col.links ?
                                        <Link className=" font-medium" to={`/${page}/${id}`}>{name}</Link> :
                                        name
                                    }
                                </td>
                            )
                        })}
                    </tr>
                )
            })
            .slice(0, limit)}
        </tbody>
    )
}
export default TableBody