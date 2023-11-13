/**
 * Generic edit component which can be used to edit Climbs and Climbers
 * 
 * @todo finish this. Also extend it to work for editing Ascents, Crags, etc.
 */

import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DocumentNode, gql, useQuery } from '@apollo/client'
import { graphqlClient } from '../../../graphql/Client'
import { MediaProps } from '../../../graphql/gql/media'
import ClimberMediaInput from '../../edit/climber/ClimberMediaInput'
import { valueFromPath } from '../../../common/ParserFunctions'

interface BasicInfoProps {
    fieldName: string
    label: string
    value: any
}

interface ArrayProps {
    tableName: string
    label: string
    data: {
        label: string
        path: string
    }[]
    query: DocumentNode
    values: any[]
    sortFunction: (a: any, b: any) => number
}

interface EditProps {
    query: DocumentNode
    tableName: string
    basicInfo: BasicInfoProps[]
    arrays: ArrayProps[]
    media: MediaProps[]
    reload: () => any
}

const Edit = ({ query, tableName, basicInfo, arrays, media, reload }: EditProps) => {
    const { id } = useParams()

    const {loading, error, data, refetch} = useQuery(query, {variables: {where: {id: {_eq: id}}}})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const target = data[tableName][0]


    const _Edit = () => {
        const [basicInfoChanged, setBasicInfoChanged] = useState<boolean>(false)
        const [addMedia, setAddMedia] = useState<boolean>(false)
        const navigate = useNavigate()
        const { id } = useParams()
    
        var colorRow = false

        return (
            <div>
                <button className="border-black border-2 p-1" onClick={() => navigate(`/climbs/${id}`)}>Back</button>
                <br/><br/>
    
                {/**
                 * --Basic Info--
                 * 
                 * Elements of an object which the object has a 1-1 or many-1 relationship with.
                 * Ie. name, age
                 */}
                <div className="border-black border-2">
                    {basicInfo.map((info: BasicInfoProps) => {
                        return (
                            <BasicInfoInput label={info.label} value={info.value} updateInputState={setBasicInfoChanged}/>
                        )
                    })}
                    <br/><br/>

                    {/* Save button */}
                    <button
                        className={basicInfoChanged ? "bg-red-500 hover:bg-red-600 font-bold" : "bg-gray-400 font-bold pointer-events-none"}
                        id="submit"
                        onClick={() => {
                            const mutation = gql`
                                mutation Update${tableName}($id: Int, $name: String, $dob: date) {
                                    update_${tableName}(
                                        where: {id: {_eq: $id}},
                                        _set: {
                                            ${basicInfo.map((b: BasicInfoProps) => b.label)}
                                        }) {
                                        affected_rows
                                    }
                                }
                            `
    
                            const variables = 
                                {
                                }
                            
                            graphqlClient.mutate({mutation: mutation, variables: variables})
                            .then(rs => {
                                alert(rs.data?.update_climber.affected_rows + " row(s) updated")
                            })
                            .then(reload)
                            .then(() => {

                            })
                        }}
                    >
                    Save
                    </button>
                </div>
                <br/>
                
                {/**
                 * --Arrays--
                 * 
                 * Elements of an object which the object has a 1-many or many-many relationship with.
                 * Ie. a Climb's ascents
                 */}
                <div className="border-black border-2">
                    {arrays.map((arr: ArrayProps) => {
                        return (
                            <div>
                                <div className="font-bold">{arr.label}({arr.values.length}):</div>
                                <div>
                                    {[...arr.values].sort(arr.sortFunction)
                                    .map(a => {
                                        const color = colorRow ? "" : "bg-slate-200"
                                        colorRow = !colorRow
                    
                                        return (
                                            <TargetInfo rowColor={color} target={a} data={arr.data}/>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <br/>
    
                {/**
                 * --Media--
                 * 
                 * An object's media
                 */}
                <div className=" border-black border-2">
                    <div className="font-bold">Media:</div>
                    <div className="">
                        {media.map((climberMedia: MediaProps) => {
                            var cName = ""
                            return (
                                <div className="flex">

                                    {/* Delete button */}
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
                                            .then(reload)
                                        }}
                                        >
                                        X
                                    </button>

                                    {/* Display media label and URL */}
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
                                    return reload
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
                <br/>

                <button
                    className="bg-red-500 hover:bg-red-600 font-bold"
                    onClick={() => {

                    }}>
                    Delete {}
                </button>
            </div>
        )
    }

    return (
        <_Edit/>
    )
}


interface BasicInfoInputProps {
    label: string
    value: string
    updateInputState: (inputChanged: boolean) => any
}

const BasicInfoInput = ({ label, value, updateInputState }: BasicInfoInputProps) => {
    const [info, setInfo] = useState<string>(value)

    return (
        <>
        {label}
        <input
            type="text"
            id={label}
            placeholder={info}
            onChange={e => {
                setInfo(e.target.value)
                if(e.target.value == "") updateInputState(false)
                else updateInputState(true)
            }}
        />
        </>
    )
}


interface Target {
    [key: string]: any
}

interface TargetInfoProps {
    rowColor: string
    target: Target
    data: {
        path: string
        label: string
    }[]
}

const TargetInfo = ({ rowColor, target, data }: TargetInfoProps) => {
    return (
        <div className={rowColor}>
            {
                data.map(d => {
                    return <ArrayInput label={d.label} value={valueFromPath(d.path, target)} color={rowColor}/>
                })
            }
        </div>
    )
}


interface ArrayInputProps {
    label: string
    value: string
    color: string
}

const ArrayInput = ({ color, label, value }: ArrayInputProps) => {
    const [info, setInfo] = useState<string>(value)
    const [infoChanged, setInfoChanged] = useState<boolean>(false)

    return (
        <div>
            {label}
            <input
                type="text"
                id={label}
                placeholder={info}
                onChange={e => {
                    setInfo(e.target.value)
                    if(e.target.value == "") updateInputState(false)
                    else updateInputState(true)
                }}
            />

            {/* Save button */}
            <button
                className={infoChanged ? "bg-red-500 hover:bg-red-600 font-bold" : "bg-gray-400 font-bold pointer-events-none"}
                id="submit"
                onClick={() => {
                    const mutation = gql`
                        mutation Update${tableName}($id: Int, $name: String, $dob: date) {
                            update_${tableName}(
                                where: {id: {_eq: $id}},
                                _set: {
                                    ${basicInfo.map((a: ArrayInputProps) => a.label)}
                                }) {
                                affected_rows
                            }
                        }
                    `

                    const variables = 
                        {
                        }
                    
                    graphqlClient.mutate({mutation: mutation, variables: variables})
                    .then(rs => {
                        alert(rs.data?.update_climber.affected_rows + " row(s) updated")
                    })
                    .then(reload)
                    .then(() => {

                    })
                }}
            >
            Save
            </button>
        </div>
    )
}

export default Edit