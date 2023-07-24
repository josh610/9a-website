import React from 'react'
import { gql } from '@apollo/client'
import { graphqlClient } from '../graphql/Client'
import Dropdown from './ui/Dropdown'
import '../styles/defaults.css'

export const getAscents = async () => {
    //  ${FRAGMENT_MEDIA_WITH_TAGS}
      const query = gql`
      query UsaAreas( $filter: Filter) {
        areas(filter: $filter, sort: { totalClimbs: -1 }) {
          id
          uuid
          areaName
          pathTokens
          totalClimbs
          density
          aggregate {
            byDiscipline {
                sport {
                  total
                }
                trad {
                  total
                }
                boulder {
                  total
                }
                tr {
                  total
                }
                alpine {
                  total
                }
                mixed {
                  total
                }
                aid {
                  total
                }
              }
          }
          metadata {
            lat
            lng
            areaId
          }
          # media {
          #   ... MediaWithTagsFields
          # }
        }
      }`
    
    const rs = await graphqlClient.query<IndexResponseType>({
    query,
    variables: {
        filter: {
        field_compare: [{
            field: 'totalClimbs',
            num: 400,
            comparison: 'gt'
        }, {
            field: 'density',
            num: 0.5,
            comparison: 'gt'
        }]
        }
    }
    })

    return {
    props: {
        data: rs.data,
    }
    }
}

const AscentsFilter = () => {
    return (
        <div className='grid-x'>
            Filter
                <Dropdown defaultValue="Area" values={["1", "2", "3"]}></Dropdown>
                <Dropdown defaultValue="Gender" values={["1", "2", "3"]}></Dropdown>
        </div>
    )
}

interface AscentProps{
    climber: string
    climb: string
    grade: string
    proposedGrade?: string
    area?: string
    date?: string
    fa?: boolean
}

const Ascent = ({climber, climb, grade, proposedGrade, area, date, fa}: AscentProps) => {
    let gradeString = "(" + grade + ")"
    if(fa){
        gradeString += "(FA)"
    }
    return (
        <tr className='row'>
            <td className='column'>{climber}</td>
            <td className='column'>
                <div>{climb}</div>
                <div>{gradeString}</div>
            </td>
            <td className='column'>{proposedGrade}</td>
            <td className='column'>{area}</td>
            <td className='column'>{date}</td>
        </tr>
    )
}

const Ascents = () => {
    const data = [{
        climber: "Adam Ondra",
        climb: "Silence",
        grade: "9c"
    },
    {
        climber: "Seb Bouin",
        climb: "DNA",
        grade: "9c"
    }]
    return (
        <div className='Ascent'>
            <AscentsFilter />
            <table className='ascents'>
                <tr className='row'>
                    <th className='column'>Climber</th>
                    <th className='column'>Climb</th>
                    <th className='column'>Proposed Grade</th>
                    <th className='column'>Area</th>
                    <th className='column'>Date</th>
                </tr>
                {data.map(datum => Ascent({climber: datum.climber, climb: datum.climb, grade: datum.grade, proposedGrade:undefined, area:undefined, date:undefined}))}
            </table>
        </div>
    )
}

export default Ascents