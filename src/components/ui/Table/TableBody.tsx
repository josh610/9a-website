import { AscentProps } from "../../../graphql/gql/ascent"


interface TBodyProps {
    columns: {key: any, label: string, path: string, sortable: boolean}[]
    data: any[]
}

const TableBody = ({ columns, data }: TBodyProps) => {
    return (
        <tbody>
            {data.map(({id, climber, climb, proposedGrade, _date, fa}: AscentProps) => {
                return (
                    <tr className='row' key={id}>
                        <td className='column'>{climber.name}</td>
                        <td className='column'>{climb.name}</td>
                        <td className='column'>{climb.grade}</td>
                        <td className='column'>{proposedGrade}</td>
                        <td className='column'>{climb.crag.name}</td>
                        <td className='column'>{_date}</td>
                    </tr>
                )
            })}
        </tbody>
    )
}
export default TableBody