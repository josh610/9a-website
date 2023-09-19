import React from 'react'
import { gql, useQuery } from '@apollo/client'
import {  QUERY_ALL_ASCENTS } from '../../graphql/gql/ascent'
import Table from '../ui/Table/Table'
import { Link } from 'react-router-dom'


const NumberOfAscents = () => {
  const {loading, error, data} = useQuery(gql`query Ascents {ascent_aggregate {aggregate {count}}}`)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error : {error.message}</p>

  return (
    <div>
      {`${data.ascent_aggregate.aggregate.count} Ascents`}
    </div>
  )
}


const Ascents = () => {
  return (
    <div>
      <center>
        <NumberOfAscents/>
      </center>
      <br></br>
      <div>
          <Table
            columns={[
              { key: "climber", label: "Climber", path: "climber.name", sortable: true, filterable: true, links: true},
              { key: "climb", label: "Climb", path: "climb.name", sortable: true, filterable: true, links: true},
              { key: "grade", label: "Grade", path: "climb.grade", sortable: true, filterable: true, links: false},
              { key: "gradeproposal", label: "Proposed Grade", path: "grade_proposal", sortable: true, filterable: true, links: false},
              { key: "crag", label: "Area", path: "climb.crag.name", sortable: true, filterable: true, links: true},
              { key: "date", label: "Date", path: "_date", sortable: true, filterable: true, links: false}
            ]}
            query={QUERY_ALL_ASCENTS}
            queryVariables={{}}
            queryName={"ascent"}
            queryLimits={[10, 20, 50]}
          />
      </div>
    </div>
  )
}

export default Ascents