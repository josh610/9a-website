import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { QUERY_ALL_CLIMBERS } from '../../graphql/gql/climber'
import { AscentProps } from '../../graphql/gql/ascent'
import { MediaProps } from '../../graphql/gql/media'


const Climber = () => {
    const { id } = useParams()
    const {loading, error, data} = useQuery(QUERY_ALL_CLIMBERS, {variables: {where: {id: {_eq: id}}}})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const climber = data.climber[0]
    const ascents = [...climber.ascents]

    return (
        <div>
            <Link
                className="text-right"
                to={`/climbers/${id}/edit`}>
            Edit this page
            </Link>
            <br/><br/>
            
            <div className="flex justify-between">
                <div>
                    <div className="text-6xl">{climber.name}</div>

                    {climber.dob ?
                    (<div className="text-2xl">Date of birth: {new Date(climber.dob).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ({getAge(climber.dob)} years old)</div>)
                    : <></>}

                    <div className="text-2xl">Home country: {climber.home_country.name}</div>
                    <br></br>
                </div>
                
                <div className="flex items-end justify-end w-5/12">
                    <img className="w-full" src={require('../../assets/ROCKCLIMB.jpg')}></img>
                </div>
            </div>

            <div>
            Ascents ({ascents.length}):{ascents.sort((a: AscentProps, b: AscentProps) =>
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
                        {
                            ascent.ascent_media
                            ?
                            <>
                            (Videos: {ascent.ascent_media?.map((ascentMedia: MediaProps) => {
                                return ascentMedia.media.url + ", "
                            })})
                            </>
                            :
                            <></>
                        }
                        
                    </div>
                    
                )
            })}
            </div>
            <br/>
            <div>
                Videos:
                {climber.climber_media.map((climberMedia: MediaProps) => {
                    if(climberMedia.media.type == "youtube") {
                        return (
                            <iframe className="h-52 w-fit" src={climberMedia.media.url.replace('watch?v=', 'embed/')}></iframe>
                        )
                    }
                })}
            </div>
        </div>
    )
}

const getAge = (dob: string) => {
    var ageDifMs = Date.now() - Date.parse(dob)
    var ageDate = new Date(ageDifMs) // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970)
}

export default Climber