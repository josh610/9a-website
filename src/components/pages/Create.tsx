import React, { useState } from 'react'
import { graphqlClient } from '../../graphql/Client'
import { QUERY_ALL_CLIMBS } from '../../graphql/gql/climb'
import { QUERY_ALL_CLIMBERS } from '../../graphql/gql/climber'

const CreateAscent = () => {
    const [climbs, setClimbs] = useState([""])
    graphqlClient.query({query: QUERY_ALL_CLIMBS})
        .then((rs) => {
            setClimbs(
                rs.data.climbs.map((climb: any) => climb.name)
            )
        })

    const [climbers, setClimbers] = useState([""])
    graphqlClient.query({query: QUERY_ALL_CLIMBERS})
        .then((rs) => {
            setClimbers(
                rs.data.climbers.map((climber: any) => climber.name)
            )
        })

    const [climb, setClimb] = useState('')
    const [climber, setClimber] = useState('')
    const [grade, setGrade] = useState('')

    const submitHandler = (event: any) => {
        event.preventDefault()

        /*
        const mutation = gql`

        `
        
        graphqlClient.mutate({mutation})
        */
    }

    return (
        <div className='Create'>
            Create Ascent
            <form onSubmit={submitHandler}>
                <div className=''>
                    <label>Grade Proposal
                        <input
                            type='text'
                            id='grade'
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                        />
                    </label>
                </div>
                <div className=''>
                    <label>Date
                        <input
                            type='text'
                            id='grade'
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                        />
                    </label>
                </div>
                <div className=''>
                    <button type='submit'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default CreateAscent