import { Link } from "react-router-dom"
import { getValueFromPath } from "./common"
const Pluralize = require('pluralize')

interface TBodyProps {
    columns: {key: string, label: string, path: string, links?: boolean}[]
    data: any[]
}

const TableBody = ({ columns, data }: TBodyProps) => {
    return (
        <tbody>
            {data.map(d => {
                return (
                    <tr className='row' key={d.id}>
                        {columns.map(col => {
                            const name = getValueFromPath(col.path, d)
                            const page = Pluralize(col.key)

                            // get path to ID
                            const idPathStrings = col.path.split('.')
                            idPathStrings[idPathStrings.length - 1] = "id"
                            console.log(idPathStrings.join('.'))
                            const id = getValueFromPath(idPathStrings.join('.'), d)
                            
                            return (
                                <td className='column' key={col.key}>
                                    {
                                        col.links ?
                                        <Link to={`/${page}/${id}`}>{name}</Link> :
                                        name
                                    }
                                </td>
                            )
                        })}
                    </tr>
                )
            })}
        </tbody>
    )
}
export default TableBody