/** CURRENTLY NOT IN USE */

import { gql } from '@apollo/client'
import React, { useState } from 'react'
import { graphqlClient } from '../../graphql/Client'

interface ObjectProps {
    id: number
}

interface DataProps {
    type: string
    data: ObjectProps[]
}

interface MediaInputProps {
    data: DataProps[]
    reload: () => any
}

const MediaInput = ({ data, reload }: MediaInputProps) => {
    const [showMediaForm, toggleShowMediaForm] = useState<boolean>(false)


    const InputForm = () => {
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

                    const t = data.map((d: DataProps) => {
                        return d.data.map(o => {
                            return {
                                [`${d.type}Media`]: {
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
                                    [`${d.type}_id`]: o.id
                                }
                            }
                        })
                    })
    
                    const variables = {t}
                    
                    graphqlClient.mutate({mutation: mutation, variables: variables})
                    .then(rs => {
                        const affectedRows = rs.data?.insert_ascent_media.affected_rows + rs.data?.insert_climber_media.affected_rows + rs.data?.insert_climb_media.affected_rows
                        alert(`${affectedRows} row(s) updated`)
                    })
                    .then(reload)
    
                    setMediaLabelInput("")
                    setMediaUrlInput("")
    
                    toggleShowMediaForm(false)
                }}
                >Add
            </button>
            </div>
        )
    }


    return (
        showMediaForm
        ?
        <InputForm/>
        :
        <button onClick={() => toggleShowMediaForm(true)}>Add media</button>
    )
}



export default MediaInput