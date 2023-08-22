import '../../styles/defaults.css'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { ClimbProps } from '../../graphql/gql/climb'
import { QUERY_ALL_CRAGS } from '../../graphql/gql/crag'

const Crag = () => {
    const { id } = useParams()
    const {loading, error, data, refetch} = useQuery(QUERY_ALL_CRAGS, {variables: {where: {id: {_eq: id}}}})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const crag = data.crag[0]
    const climbs = [...crag.climbs]

    return (
        <>
        <div>Name: {crag.name}</div>
        <div>Country:
            <Link to={`/countries/${crag.country.id}`}>{crag.country.name}</Link>
        </div>
        <br></br>
        {crag.description ?
            (<>
            <div>{crag.description}</div>
            <br></br>
            </>)
            : (<></>)
        }
        <div>Climbs:{climbs.sort((a: ClimbProps, b: ClimbProps) => a.name.localeCompare(b.name.toString()))
            .map((climb: ClimbProps) => {
                return (
                    <div>
                        <Link to={`/climbs/${climb.id}`}>{climb.name}</Link> ({climb.grade})
                    </div>
                )
            })}
        </div>
        </>
    )
}

export default Crag