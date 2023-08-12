import '../../styles/defaults.css'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { QUERY_ALL_COUNTRIES } from '../../graphql/gql/country'

const Country = () => {
    const { id } = useParams()
    const {loading, error, data, refetch} = useQuery(QUERY_ALL_COUNTRIES, {variables: {where: {id: {_eq: id}}}})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const country = data.country[0]
    const crags = [...country.crags]
    const climbers = [...country.climbers]

    return (
        <div>{country.name}</div>
    )
}

export default Country