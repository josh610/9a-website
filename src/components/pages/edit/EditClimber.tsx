import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ApolloQueryResult, gql, useQuery } from '@apollo/client'
import { graphqlClient } from '../../../graphql/Client'
import { MediaProps } from '../../../graphql/gql/media'
import EditAscentDate from '../../EditAscentDate'
import { AscentProps } from '../../../graphql/gql/ascent'
import Dropdown from '../../ui/Dropdown'
import { QUERY_ALL_CLIMBERS } from '../../../graphql/gql/climber'
import { ClimbProps, QUERY_ALL_CLIMBS } from '../../../graphql/gql/climb'
import NewMediaInput from '../../NewMediaInput'


interface EditProps {
    name: string
    dob: string
    ascents: AscentPropProps[]
    media: MediaProps[]
    handleChange: () => any
}

export interface AscentPropProps {
    id: number
    climb: string
    grade: string
    date: string
}

const EditClimber = () => {
    const { id } = useParams()

    const {loading, error, data, refetch} = useQuery(QUERY_ALL_CLIMBERS, {variables: {where: {id: {_eq: id}}}})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const climber = data.climber[0]

    return (
        <Edit
            name={climber.name}
            dob={climber.dob}
            ascents={climber.ascents.map((ascent: AscentProps) => {
                return {id: ascent.id, climb: ascent.climb.name, grade: ascent.climb.grade, date: ascent._date}
            })}
            media={climber.climber_media}
            handleChange={refetch}
        />
    )
}

const Edit = (props: EditProps) => {
    const [name, setName] = useState<string>(props.name)
    const [dob, setDob] = useState<string>(props.dob)

    const [nameChanged, setNameChanged] = useState<boolean>(false)
    const [dobChanged, setDobChanged] = useState<boolean>(false)

    const [addMedia, setAddMedia] = useState<boolean>(false)

    const navigate = useNavigate()

    const { id } = useParams()
    
    /*
    const [climbsList, setClimbsList] = useState<{key: any, value: any, label: string}[]>([{key: null, value: null, label: ""}])
    
    graphqlClient.query({query: QUERY_ALL_CLIMBS})
        .then(rs => {
            console.log(rs.data)
            setClimbsList(
                rs.data?.climb.map((climb: ClimbProps) => {
                    return {
                        key: climb.id,
                        value: climb.id,
                        label: climb.name
                    }
                })
            )
        })
    */

    return (
        <div className="w-screen">
            <button className="border-black border-2 p-1" onClick={() => navigate(`/climbers/${id}`)}>Back</button>
            <br/><br/>

            {/** Name and Dob **/}
            <div className="border-black border-2">
                Name: <input
                    type="text"
                    id={"name"}
                    placeholder={props.name}
                    onChange={e => {
                        setName(e.target.value)
                        if(e.target.value == "") setNameChanged(false)
                        else setNameChanged(true)
                    }}
                />
                <br/>
                Date of birth (yyyy-mm-dd): <input
                    type="text"
                    id={"dob"}
                    placeholder={props.dob ? props.dob : "Unknown"}
                    onChange={e => {
                        setDob(e.target.value)
                        if(e.target.value == "") setDobChanged(false)
                        else setDobChanged(true)
                    }}
                />
                <br/><br/>
                <button
                    className={nameChanged || dobChanged ? "bg-red-500 hover:bg-red-600 font-bold" : "bg-gray-400 font-bold pointer-events-none"}
                    id="submit"
                    onClick={() => {
                        const mutation = gql`
                            mutation UpdateClimber($id: Int, $name: String, $dob: date) {
                                update_climber(
                                    where: {id: {_eq: $id}},
                                    _set: {
                                        name: $name,
                                        dob: $dob
                                    }) {
                                    affected_rows
                                }
                            }
                        `

                        const variables = 
                            {
                                id: id,
                                name: name,
                                dob: dob == "" ? dob : '"' + dob + '"',
                            }
                        
                        graphqlClient.mutate({mutation: mutation, variables: variables})
                        .then(rs => {
                            alert(rs.data?.update_climber.affected_rows + " row(s) updated")
                        })
                        .then(props.handleChange)
                        .then(() => {
                            setNameChanged(false)
                            setDobChanged(false)
                        })
                    }}
                >
                Save
                </button>
            </div>
            <br/>
            
            {/** Ascents **/}
            <div className="border-black border-2">
                <div className="font-bold">Ascents ({props.ascents.length}):</div>
                <div>{props.ascents.sort((a: AscentPropProps, b: AscentPropProps) =>
                    a.date ?
                        b.date ?
                            a.date.localeCompare(b.date.toString())
                        : 1
                    : -1)
                .map((ascent: AscentPropProps) => {
                    return (
                        <EditAscentDate ascent={ascent} handleChange={props.handleChange}/>
                    )
                })}
                </div>
            </div>
            <br/>

            {/** Media **/}
            <div className=" border-black border-2">
                <div className="font-bold">Media:</div>
                <div className="">
                    {props.media.map((climberMedia: MediaProps) => {
                        var cName = ""
                        return (
                            <div className="flex">
                                <button
                                    className="bg-red-600 border-red-800 border-2 p-1"
                                    onClick={() => {
                                        const mutation = gql`
                                            mutation DeleteClimberMedia($id: Int) {
                                                delete_climber_media(where: {id: {_eq: $id}}) {
                                                    affected_rows
                                                }
                                            }
                                        `

                                        const variables = {
                                            id: climberMedia.id
                                        }
                                        
                                        graphqlClient.mutate({mutation: mutation, variables: variables})
                                        .then(rs => {
                                            alert(rs.data?.delete_climber_media.affected_rows + " row(s) updated")
                                        })
                                        .then(props.handleChange)
                                    }}
                                    >
                                    X
                                </button> 
                                <div className={cName}>{climberMedia.media.label} ({climberMedia.media.url})</div>
                            </div>
                        )
                    })}

                    {
                        addMedia
                        ?
                        <NewMediaInput
                            climberId={Number(id)}
                            handleChange={() => {
                                setAddMedia(false)
                                return props.handleChange
                            }}
                        />
                        :
                        <button
                            className="bg-slate-300"
                            onClick={() => {setAddMedia(true)}}>
                            Add media
                        </button>
                    }

                    

                    {/*
                    <input
                        className="border-gray-400 border-2"
                        type="text"
                        id={"media"}
                        placeholder="Title"
                        onChange={e => {
                            setMediaLabelInput(e.target.value)
                        }}
                    />
                    <input
                        className="border-gray-400 border-2"
                        type="text"
                        id={"media"}
                        placeholder="Url"
                        onChange={e => {
                            setMediaUrlInput(e.target.value)
                        }}
                    />
                    <Dropdown
                        options={climbsList}
                        placeholder="Climb?"
                        onChange={() => {}}/>
                    <button
                        className={mediaLabelInput == "" || mediaUrlInput == "" ? "border-gray-500 border-2 text-gray-400 p-1 pointer-events-none" : "border-black border-2 p-1"}
                        onClick={() => {

                            const mutation = gql`
                                mutation UpsertClimberMedia($media: [climber_media_insert_input!]!) {
                                    insert_climber_media(objects: $media, on_conflict: {constraint: climber_media_climber_id_media_id_key}) {
                                        affected_rows
                                    }
                                }
                            `

                            const variables = {
                                media: {
                                    media: {
                                        data: {
                                            label: mediaLabelInput,
                                            type: "youtube",
                                            url: mediaUrlInput
                                        },
                                        on_conflict: {
                                            constraint: "media_url_key",
                                            update_columns: "url"
                                        }
                                    },
                                    climber_id: id
                                }
                            }
                            
                            graphqlClient.mutate({mutation: mutation, variables: variables})
                            .then(rs => {
                                alert(rs.data?.insert_climber_media.affected_rows + " row(s) updated")
                            })
                            .then(props.handleChange)

                            setMediaLabelInput("")
                            setMediaUrlInput("")
                        }}
                        >Add
                    </button>
                    */}
                </div>
            </div>
        </div>
    )
}

export default EditClimber