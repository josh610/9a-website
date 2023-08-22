import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import { QUERY_ALL_COUNTRIES } from '../../graphql/gql/country'
import { ClimberProps } from '../../graphql/gql/climber'
import { CragProps } from '../../graphql/gql/crag'

const Country = () => {
    const { id } = useParams()
    const CLIMBS_COUNT_QUERY = gql(
        `query Climbs_Count {
            climb_aggregate(where: {crag: {country: {id: {_eq: ${id}}}}}) {
                aggregate {
                    count
                }
            }
        }`
    )
    const {loading: countryLoading, error: countryError, data: countryData} = useQuery(QUERY_ALL_COUNTRIES, {variables: {where: {id: {_eq: id}}}})
    const {loading: climbsLoading, error: climbsError, data: climbsData} = useQuery(CLIMBS_COUNT_QUERY)

    if (countryLoading) return <p>Loading...</p>
    if (countryError) return <p>Error : {countryError.message}</p>

    const country = countryData.country[0]
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
        <div>
            {climbsLoading ? climbsError ? (<p>Error : {climbsError.message}</p>) : (<p>Loading...</p>) : `${climbsData.climb_aggregate.aggregate.count} Climbs`}
        </div>
        <br/>
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