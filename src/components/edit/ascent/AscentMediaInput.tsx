import React, { useState } from 'react'
import { gql } from '@apollo/client'
import { graphqlClient } from '../../../graphql/Client'
import { AscentProps } from '../../../graphql/gql/ascent'

interface MediaInputProps {
    ascent: AscentProps
    handleChange: () => any
}

interface InputProps {
    ascent: AscentProps
    handleChange: () => any
    setAddMedia: (params: any) => any
}

const AscentMediaInput = ({ ascent, handleChange }: MediaInputProps) => {
    const [addMedia, setAddMedia] = useState<boolean>(false)

    return addMedia ?
        <div className='flex'>
            <button
                className="bg-red-600 border-red-800 border-2 p-1"
                onClick={
                    () => {
                        handleChange()
                        setAddMedia(false)
                    }
                }
            >X</button>
            <Input ascent={ascent} handleChange={handleChange} setAddMedia={setAddMedia}/>
        </div>
        : <button onClick={() => setAddMedia(true)}>Add media</button>
}


const Input = ({ ascent, handleChange, setAddMedia }: InputProps) => {
    const [mediaLabelInput, setMediaLabelInput] = useState<string>("")
    const [mediaUrlInput, setMediaUrlInput] = useState<string>("")

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

        <button
            className={mediaLabelInput == "" || mediaUrlInput == "" ? "border-gray-500 border-2 text-gray-400 p-1 pointer-events-none" : "border-black border-2 p-1"}
            onClick={() => {

                const mutation = gql`
                    mutation UpsertAscentClimberClimbMedia($ascentMedia: [ascent_media_insert_input!]!, $climberMedia: [climber_media_insert_input!]!, $climbMedia: [climb_media_insert_input!]!) {
                        insert_ascent_media(objects: $ascentMedia, on_conflict: {constraint: ascent_media_ascent_id_media_id_key}) {
                            affected_rows
                        }
                        insert_climber_media(objects: $climberMedia, on_conflict: {constraint: climber_media_climber_id_media_id_key}) {
                            affected_rows
                        }
                        insert_climb_media(objects: $climbMedia, on_conflict: {constraint: climb_media_climb_id_media_id_key}) {
                            affected_rows
                        }
                    }
                `

                const variables = {
                    ascentMedia: {
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
                        ascent_id: ascent.id
                    },
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
                        climber_id: ascent.climber.id
                    },
                    climbMedia: {
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
                        climb_id: ascent.climb.id
                    }
                }
                
                graphqlClient.mutate({mutation: mutation, variables: variables})
                .then(rs => {
                    const affectedRows = rs.data?.insert_ascent_media.affected_rows + rs.data?.insert_climber_media.affected_rows + rs.data?.insert_climb_media.affected_rows
                    alert(`${affectedRows} row(s) updated`)
                })
                .then(handleChange)

                setMediaLabelInput("")
                setMediaUrlInput("")

                setAddMedia(false)
            }}
            >Add
        </button>
        </div>
    )
}

export default AscentMediaInput