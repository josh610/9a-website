import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { QUERY_ALL_CLIMBERS } from '../../graphql/gql/climber'
import { AscentProps } from '../../graphql/gql/ascent'

const Climber = () => {
    const { id } = useParams()
    const {loading, error, data, refetch} = useQuery(QUERY_ALL_CLIMBERS, {variables: {where: {id: {_eq: id}}}})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const climber = data.climber[0]
    const ascents = [...climber.ascents]

    return (
        <>
        <div>Name: {climber.name}</div>
        {climber.dob ?
        (<div>Date of birth: {climber.dob} ({getAge(climber.dob)} years old)</div>)
        : <></>}
        <br></br>
        <div>Ascents ({ascents.length}):{ascents.sort((a: AscentProps, b: AscentProps) =>
            a._date ?
                b._date ?
                    a._date.localeCompare(b._date.toString())
                : 1
            : -1)
        .map((ascent: AscentProps) => {
            const date = ascent._date ? ascent._date : "Date unknown"
            return (
                <div>
                    <Link to={`/climbs/${ascent.climb.id}`}>{ascent.climb.name} ({ascent.climb.grade})</Link> 
                    ({date})
                </div>
                
            )
        })}</div>
        </>
    )
}

const getAge = (dob: string) => {
    var ageDifMs = Date.now() - Date.parse(dob)
    var ageDate = new Date(ageDifMs) // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970)
}

export default Climber