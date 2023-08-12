import '../../styles/defaults.css'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { QUERY_ALL_COUNTRIES } from '../../graphql/gql/country'
import { ClimberProps } from '../../graphql/gql/climber'
import { CragProps } from '../../graphql/gql/crag'

const Country = () => {
    const { id } = useParams()
    const {loading, error, data, refetch} = useQuery(QUERY_ALL_COUNTRIES, {variables: {where: {id: {_eq: id}}}})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const country = data.country[0]
    const crags = [...country.crags]
    const climbers = [...country.climbers]

    return (
        <>
        <div>{country.name}</div>
        <br></br>
        {country.description ?
            (<>
            <div>{country.description}</div>
            <br></br>
            </>)
            : (<></>)
        }
        <div>Crags:{crags.sort((a: CragProps, b: CragProps) => a.name.localeCompare(b.name.toString()))
            .map((crag: CragProps) => {
                return (
                    <div>
                        <Link to={`/crags/${crag.id}`}>{crag.name}</Link> 
                    </div>
                )
            })}
        </div>
        <br></br>
        <div>Climbers:{climbers.sort((a: ClimberProps, b: ClimberProps) => a.name.localeCompare(b.name.toString()))
            .map((climber: ClimberProps) => {
                return (
                    <div>
                        <Link to={`/climbers/${climber.id}`}>{climber.name}</Link> 
                    </div>
                )
            })}
        </div>
        </>
    )
}

export default Country