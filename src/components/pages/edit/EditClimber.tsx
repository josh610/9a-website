import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import { graphqlClient } from '../../../graphql/Client'
import { MediaProps } from '../../../graphql/gql/media'
import EditAscentDate from '../../edit/climber/EditAscentDateFa'
import { AscentProps, QUERY_ALL_ASCENTS } from '../../../graphql/gql/ascent'
import { QUERY_ALL_CLIMBERS } from '../../../graphql/gql/climber'
import ClimberMediaInput from '../../edit/climber/ClimberMediaInput'
import AscentMediaInput from '../../edit/ascent/AscentMediaInput'
import Edit from './Edit'


interface EditProps {
    name: string
    dob: string
    ascents: AscentProps[]
    media: MediaProps[]
    handleChange: () => any
}

const EditClimber = () => {
    const { id } = useParams()

    const {loading, error, data, refetch} = useQuery(QUERY_ALL_CLIMBERS, {variables: {where: {id: {_eq: id}}}})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const climber = data.climber[0]

    return (
        <Edit
            query={QUERY_ALL_CLIMBERS}
            tableName="climber"
            basicInfo={[
                {fieldName: "name", label: "Name", value: climber.name},
                {fieldName: "dob", label: "Date of birth", value: climber.dob}
            ]}
            arrays={[
                {
                    tableName: "ascent",
                    label: "Ascents",
                    query: QUERY_ALL_ASCENTS,
                    values: [...climber.ascents],
                    data: [
                        {path: "climb.name", label: "Climb"},
                        {path: "_date", label: "Date"}
                    ],
                    sortFunction: (a: AscentProps, b: AscentProps) => 
                        a._date ?
                            b._date ?
                                a._date.localeCompare(b._date.toString())
                            : 1
                        : -1
                }
            ]}
            media={[

            ]}
            reload={refetch}
        />
    )

    /*
    return (
        <_Edit
            name={climber.name}
            dob={climber.dob}
            ascents={climber.ascents}
            media={climber.climber_media}
            handleChange={refetch}
        />
    )
    */
}

const _Edit = (props: EditProps) => {
    const [name, setName] = useState<string>(props.name)
    const [dob, setDob] = useState<string>(props.dob)

    const [nameChanged, setNameChanged] = useState<boolean>(false)
    const [dobChanged, setDobChanged] = useState<boolean>(false)

    const [addMedia, setAddMedia] = useState<boolean>(false)

    const navigate = useNavigate()

    const { id } = useParams()

    var colorRow = false

    return (
        <div>
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
                        <ClimberMediaInput
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

export default EditClimber