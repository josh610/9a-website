import '../../styles/defaults.css'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { QUERY_ALL_CLIMBS } from '../../graphql/gql/climb'
import { AscentProps } from '../../graphql/gql/ascent'

const Climb = () => {
    const { id } = useParams()
    const {loading, error, data, refetch} = useQuery(QUERY_ALL_CLIMBS, {variables: {where: {id: {_eq: id}}}})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const climb = data.climb[0]
    const ascents = [...climb.ascents]

    return (
        <>
        <div>Name: {climb.name}</div>
        <div>Grade: {climb.grade}</div>
        <div>Location:
            <Link to={`/crags/${climb.crag.id}`}>{climb.crag.name}</Link>, 
            <Link to={`/countries/${climb.crag.country.id}`}>{climb.crag.country.name}</Link>
        </div>
        <br></br>
        {climb.description ?
            (<>
            <div>{climb.description}</div>
            <br></br>
            </>)
            : (<></>)
        }
        <div>Ascents:{ascents.sort((a: AscentProps, b: AscentProps) =>
            a._date ?
                b._date ?
                    a._date.localeCompare(b._date.toString())
                : 1
            : -1)
        .map((ascent: AscentProps) => {
            const date = ascent._date ? ascent._date : "Date unknown"
            return (
                <div>
                    <Link to={`/climbers/${ascent.climber.id}`}>{ascent.climber.name}</Link> 
                    ({date})
                </div>
                
            )
        })}</div>
        </>
    )
}

export default Climb