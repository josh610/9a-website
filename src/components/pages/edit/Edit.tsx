/** CURRENTLY NOT IN USE */

import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DocumentNode, gql, useQuery } from '@apollo/client'
import { graphqlClient } from '../../../graphql/Client'
import { MediaProps } from '../../../graphql/gql/media'
import EditAscentDate from '../../edit/climber/EditAscentDateFa'
import { AscentProps, QUERY_ALL_ASCENTS } from '../../../graphql/gql/ascent'
import { QUERY_ALL_CLIMBERS } from '../../../graphql/gql/climber'
import ClimberMediaInput from '../../edit/climber/ClimberMediaInput'
import AscentMediaInput from '../../edit/ascent/AscentMediaInput'

interface BasicInfoProps {
    type: string
    label: string
    data: any
}

interface ArrayProps {
    type: string
    query: DocumentNode
    label: string
    data: any[]
    sortFunction: (a: any, b: any) => number
}

interface EditProps {
    query: DocumentNode
    type: string
    basicInfo: BasicInfoProps[]
    arrays: ArrayProps[]
    media: MediaProps[]
    reload: () => any
}

const Edit = ({ query, type, basicInfo, arrays, media, reload }: EditProps) => {
    const { id } = useParams()

    const {loading, error, data, refetch} = useQuery(query, {variables: {where: {id: {_eq: id}}}})

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const target = data[type][0]


    const _Edit = () => {
        //const [name, setName] = useState<string>(props.name)
        //const [dob, setDob] = useState<string>(props.dob)
    
        const [nameChanged, setNameChanged] = useState<boolean>(false)
        const [dobChanged, setDobChanged] = useState<boolean>(false)

        const [basicInfoChanged, setBasicInfoChanged] = useState<boolean>(false)
    
    
        const [addMedia, setAddMedia] = useState<boolean>(false)
    
        const navigate = useNavigate()
    
        const { id } = useParams()
    
        var colorRow = false
    
        return (
            <div>
                <button className="border-black border-2 p-1" onClick={() => navigate(`/climbers/${id}`)}>Back</button>
                <br/><br/>
    
                {/** Basic Info **/}
                <div className="border-black border-2">
                    {basicInfo.map((info: BasicInfoProps) => {
                        return (
                            <BasicInfoInput label={info.label} value={info.type} updateInputState={setBasicInfoChanged}/>
                        )
                    })}
                    <br/><br/>
                    <button
                        className={basicInfoChanged ? "bg-red-500 hover:bg-red-600 font-bold" : "bg-gray-400 font-bold pointer-events-none"}
                        id="submit"
                        onClick={() => {
                            const mutation = gql`
                                mutation Update${type}($id: Int, $name: String, $dob: date) {
                                    update_${type}(
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
                                setNameChanged(false)
                                setDobChanged(false)
                            })
                        }}
                    >
                    Save
                    </button>
                </div>
                <br/>
                
                {/** Arrays **/}
                <div className="border-black border-2">
                    {arrays.map((arr: ArrayProps) => {
                        return (
                            <>
                            <div className="font-bold">{arr.label}({arr.data.length}):</div>
                            <div>{[...arr.data].sort(arr.sortFunction)
                            .map(a => {
                                const color = colorRow ? "" : "bg-slate-200"
                                colorRow = !colorRow
            
                                return (
                                    <TargetInfo rowColor={color}/>
                                )
                            })}
                            </div>
                            </>
                        )
                    })}
                </div>
                <br/>
    
                {/** Media **/}
                <div className=" border-black border-2">
                    <div className="font-bold">Media:</div>
                    <div className="">
                        {media.map((climberMedia: MediaProps) => {
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
                                            .then(reload)
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
            </div>
        )
    }


    const TargetInfo = ({ rowColor }: {rowColor: string}) => {
        const {loading, error, data} = useQuery(query, {variables: {where: {id: {_eq: id}}}})
    
        if (loading) return <p>Loading...</p>
        if (error) return <p>Error : {error.message}</p>
    
        const target = data.ascent[0]
    
        return (
            <div className={rowColor}>
                <EditAscentDate ascent={target} handleChange={reload}/>
                <>
                    {target.ascent_media?.map((ascentMedia: MediaProps) => {
                        return <div>*{ascentMedia.media.url}</div>
                    })}
                </>
                <AscentMediaInput ascent={target} handleChange={reload}/>
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
            placeholder={value}
            onChange={e => {
                setInfo(e.target.value)
                if(e.target.value == "") updateInputState(false)
                else updateInputState(true)
            }}
        />
        </>
    )
}



export default Edit