import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import { graphqlClient } from '../../../graphql/Client'
import { MediaProps } from '../../../graphql/gql/media'
import EditAscentDate from '../../edit/climber/EditAscentDateFa'
import { AscentProps, QUERY_ALL_ASCENTS } from '../../../graphql/gql/ascent'
import ClimberMediaInput from '../../edit/climber/ClimberMediaInput'
import AscentMediaInput from '../../edit/ascent/AscentMediaInput'
import { QUERY_ALL_CLIMBS } from '../../../graphql/gql/climb'
import ClimbMediaInput from '../../edit/climb/ClimbMediaInput'


interface EditProps {
    name: string
    grade: string
    ascents: AscentProps[]
    media: MediaProps[]
    handleChange: () => any
}

const EditClimb = () => {
    const { id } = useParams()

    const {loading, error, data, refetch} = useQuery(QUERY_ALL_CLIMBS, {variables: {where: {id: {_eq: id}}}})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const climb = data.climb[0]

    return (
        <Edit
            name={climb.name}
            grade={climb.grade}
            ascents={climb.ascents}
            media={climb.climb_media}
            handleChange={refetch}
        />
    )
}

const Edit = (props: EditProps) => {
    const [name, setName] = useState<string>(props.name)
    const [grade, setGrade] = useState<string>(props.grade)

    const [nameChanged, setNameChanged] = useState<boolean>(false)
    const [gradeChanged, setGradeChanged] = useState<boolean>(false)

    const [addMedia, setAddMedia] = useState<boolean>(false)

    const navigate = useNavigate()

    const { id } = useParams()

    var colorRow = false

    return (
        <div>
            <button className="border-black border-2 p-1" onClick={() => navigate(`/climbs/${id}`)}>Back</button>
            <br/><br/>

            {/** Name and Grade **/}
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
                Grade: <input
                    type="text"
                    id={"grade"}
                    placeholder={props.grade}
                    onChange={e => {
                        setGrade(e.target.value)
                        if(e.target.value == "") setGradeChanged(false)
                        else setGradeChanged(true)
                    }}
                />
                <br/><br/>
                <button
                    className={nameChanged || gradeChanged ? "bg-red-500 hover:bg-red-600 font-bold" : "bg-gray-400 font-bold pointer-events-none"}
                    id="submit"
                    onClick={() => {
                        const mutation = gql`
                            mutation UpdateClimb($id: Int, $name: String, $dob: date) {
                                update_climb(
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
                                name: name
                            }
                        
                        graphqlClient.mutate({mutation: mutation, variables: variables})
                        .then(rs => {
                            alert(rs.data?.update_climb.affected_rows + " row(s) updated")
                        })
                        .then(props.handleChange)
                        .then(() => {
                            setNameChanged(false)
                            setGradeChanged(false)
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
                <div>{[...props.ascents].sort((a: AscentProps, b: AscentProps) =>
                    a._date ?
                        b._date ?
                            a._date.localeCompare(b._date.toString())
                        : 1
                    : -1)
                .map((ascent: AscentProps) => {
                    const color = colorRow ? "" : "bg-slate-200"
                    colorRow = !colorRow

                    return (
                        <AscentInfo id={ascent.id} handleChange={props.handleChange} rowColor={color}/>
                    )
                })}
                </div>
            </div>
            <br/>

            {/** Media **/}
            <div className=" border-black border-2">
                <div className="font-bold">Media:</div>
                <div className="">
                    {props.media.map((climbMedia: MediaProps) => {
                        var cName = ""
                        return (
                            <div className="flex">
                                <button
                                    className="bg-red-600 border-red-800 border-2 p-1"
                                    onClick={() => {
                                        const mutation = gql`
                                            mutation DeleteClimbMedia($id: Int) {
                                                delete_climb_media(where: {id: {_eq: $id}}) {
                                                    affected_rows
                                                }
                                            }
                                        `

                                        const variables = {
                                            id: climbMedia.id
                                        }
                                        
                                        graphqlClient.mutate({mutation: mutation, variables: variables})
                                        .then(rs => {
                                            alert(rs.data?.delete_climb_media.affected_rows + " row(s) updated")
                                        })
                                        .then(props.handleChange)
                                    }}
                                    >
                                    X
                                </button> 
                                <div className={cName}>{climbMedia.media.label} ({climbMedia.media.url})</div>
                            </div>
                        )
                    })}

                    {
                        addMedia
                        ?
                        <ClimbMediaInput
                            climbId={Number(id)}
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
                </div>
            </div>
        </div>
    )
}

interface AscentInfoProps {
    id: number
    handleChange: () => any
    rowColor: string
}

const AscentInfo = ({ id, handleChange, rowColor }: AscentInfoProps) => {
    const {loading, error, data} = useQuery(QUERY_ALL_ASCENTS, {variables: {where: {id: {_eq: id}}}})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const ascent = data.ascent[0]

    return (
        <div className={rowColor}>
            <EditAscentDate ascent={ascent} handleChange={handleChange}/>
            <>
                {ascent.ascent_media?.map((ascentMedia: MediaProps) => {
                    return <div>*{ascentMedia.media.url}</div>
                })}
            </>
            <AscentMediaInput ascent={ascent} handleChange={handleChange}/>
        </div>
    )
}

export default EditClimb