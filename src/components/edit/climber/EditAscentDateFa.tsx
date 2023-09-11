import React, { useState } from 'react'
import { gql } from '@apollo/client'
import { graphqlClient } from '../../../graphql/Client'
import { AscentProps } from '../../../graphql/gql/ascent'

interface EditAscentDateFaProps {
    ascent: AscentProps
    handleChange: () => any
}

const EditAscentDateFa = ({ ascent, handleChange }: EditAscentDateFaProps) => {
    const [dateInput, setDateInput] = useState<string>("")
    const [dateChanged, setDateChanged] = useState<boolean>(false)
    const date = ascent._date ? ascent._date : "Date unknown"

    return (
        <div>
            {ascent.climb.name} ({ascent.climb.grade}): 
            <input
                type="text"
                id={"date" + ascent.id}
                placeholder={date}
                onChange={e => {
                    setDateInput(e.target.value)
                    if(e.target.value != "") setDateChanged(true)
                    else setDateChanged(false)
                }}
            />
            {dateChanged ? (<button
                className="bg-red-500 hover:bg-red-600 font-bold"
                id="submit"
                onClick={() => {
                    const mutation = gql`
                        mutation UpdateAscent($id: Int, $date: date) {
                            update_ascent(
                                where: {id: {_eq: $id}},
                                _set: {
                                    _date: $date
                                }) {
                                affected_rows
                            }
                        }
                    `

                    const variables = 
                        {
                            id: ascent.id,
                            date: '"' + dateInput + '"'
                        }
                    
                    graphqlClient.mutate({mutation: mutation, variables: variables})
                    .then(rs => {
                        alert(rs.data?.update_ascent.affected_rows + " row(s) updated")
                    })
                    .then(handleChange)
                    .then(() => {
                        setDateChanged(false)
                    })
                }}>Save</button>) : <></>}
        </div>
    )
}

export default EditAscentDateFa