import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { QUERY_ALL_CLIMBS } from '../../../graphql/gql/climb'
import { AscentProps } from '../../../graphql/gql/ascent'
//import pic from '../../assets/dreamcatcher.jpeg'

interface EditClimbProps {
    id: number
}

const EditClimb = () => {
    const { id } = useParams()
    const { loading, error, data } = useQuery(QUERY_ALL_CLIMBS, {variables: {where: {id: {_eq: id}}}})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const climb = data.climb[0]
    const ascents = [...climb.ascents]

    return (
        <div className="flex flex-col space-y-5">
            <div className="self-center text-5xl">{climb.name} ({climb.grade})</div>
            <div className="flex items-end justify-end">
                <img className="" src={require('../../assets/dreamcatcher.jpeg')}></img>
            </div>
            <div className="flex">
                <div className="font-bold">Location:</div>
                <Link to={`/crags/${climb.crag.id}`}> {climb.crag.name}</Link>,
                <Link to={`/countries/${climb.crag.country.id}`}> {climb.crag.country.name}</Link>
            </div>
            {climb.description ?
                (<>
                <div>{climb.description}</div>
                </>)
                : (<></>)
            }
            <div>
                Ascents:{ascents.sort((a: AscentProps, b: AscentProps) =>
                    a._date ?
                        b._date ?
                            a._date.localeCompare(b._date.toString())
                        : 1
                    : -1)
                .map((ascent: AscentProps) => {
                    const date = ascent._date ? ascent._date : "Date unknown"
                    return (
                        <div>
                            <Link to={`/climbers/${ascent.climber.id}`}>{ascent.climber.name} </Link> 
                            ({date})
                            {ascent.fa ? " (FA)" : ""}
                        </div>
                        
                    )
                })}
            </div>
            <div>
                {climb.climb_media ? "Videos:" : ""}
                {climb.climb_media?.map((videoLink: string) => {
                    return (
                        <iframe className="h-52 w-fit" src={videoLink}></iframe>
                    )
                })}
            </div>
        </div>
    )
}

export default EditClimb