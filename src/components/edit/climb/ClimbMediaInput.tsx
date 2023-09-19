import React, { useState } from 'react'
import Dropdown from '../../ui/Dropdown'
import { gql, useQuery } from '@apollo/client'
import { graphqlClient } from '../../../graphql/Client'
import { ClimbProps, QUERY_ALL_CLIMBS } from '../../../graphql/gql/climb'
import { ClimberProps, QUERY_ALL_CLIMBERS } from '../../../graphql/gql/climber'

interface MediaInputProps {
    climbId: number
    handleChange: () => any
}

const ClimbMediaInput = ({ climbId, handleChange }: MediaInputProps) => {
    const [mediaLabelInput, setMediaLabelInput] = useState<string>("")
    const [mediaUrlInput, setMediaUrlInput] = useState<string>("")

    const [mediaClimberIds, setMediaClimberIds] = useState<Number[]>([])

    const {loading, error, data} = useQuery(QUERY_ALL_CLIMBERS)

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>

    const climbersList = data.climber.map((climber: ClimberProps) => {
        return {
            key: climber.id,
            value: climber.id,
            label: climber.name
        }
    })

    return (
        <div className="bg-gray-200">
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
            options={climbersList}
            placeholder="Climber?"
            onChange={value => {
                setMediaClimberIds([...mediaClimberIds, Number(value)])
            }}/>

        <button
            className={mediaLabelInput == "" || mediaUrlInput == "" ? "border-gray-500 border-2 text-gray-400 p-1 pointer-events-none" : "border-black border-2 p-1"}
            onClick={() => {

                const mutation = gql`
                    mutation UpsertClimberMediaAndClimbMedia($climberMedia: [climber_media_insert_input!]!, $climbMedia: [climb_media_insert_input!]!) {
                        insert_climber_media(objects: $climberMedia, on_conflict: {constraint: climber_media_climber_id_media_id_key}) {
                            affected_rows
                        }
                        insert_climb_media(objects: $climbMedia, on_conflict: {constraint: climb_media_climb_id_media_id_key}) {
                            affected_rows
                        }
                    }
                `

                const variables = {
                    climberMedia: {
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
                        climb_id: climbId
                    },
                    climbMedia: mediaClimberIds.map(id => {
                        return {
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
                    })
                }
                
                graphqlClient.mutate({mutation: mutation, variables: variables})
                .then(rs => {
                    const affectedRows = rs.data?.insert_climb_media.affected_rows + rs.data?.insert_climb_media.affected_rows
                    alert(`${affectedRows} row(s) updated`)
                })
                .then(handleChange)

                setMediaLabelInput("")
                setMediaUrlInput("")
            }}
            >Add
        </button>
        </div>
    )
}

export default ClimbMediaInput