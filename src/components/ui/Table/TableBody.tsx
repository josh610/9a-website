import { getNameFromPath } from "./common"

interface TBodyProps {
    columns: {key: string, label: string, path: string, sortable: boolean}[]
    data: any[]
}

const TableBody = ({ columns, data }: TBodyProps) => {
    return (
        <tbody>
            {data.map(d => {
                return (
                    <tr className='row' key={d.id}>
                        {columns.map(col => {
                            return (
                                <td className='column' key={col.key}>{getNameFromPath(col.path, d)}</td>
                            )
                        })}
                    </tr>
                )
            })}
        </tbody>
    )
}
export default TableBody