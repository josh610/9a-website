import React from 'react'
import { gql, useQuery } from '@apollo/client'
import {  QUERY_ALL_ASCENTS } from '../../graphql/gql/ascent'
import Table from '../ui/Table/Table'

const Ascents = () => {
  const {loading, error, data} = useQuery(gql`query Ascents {ascent_aggregate {aggregate {count}}}`)

  return (
    <div>
      <center>
        {loading ? error ? (<p>Error : {error.message}</p>) : (<p>Loading...</p>) : `${data.ascent_aggregate.aggregate.count} Ascents`}
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
            queryFilterMap={{
              "where": {
                climber: {
                  name: {},
                  home_country: {
                    name: {}
                  }
                },
                climb: {
                  name: {},
                  grade: {},
                  crag: {
                    name: {},
                    country: {
                      name: {}
                    }
                  }
                }
              }
            }}
            queryLimits={[10, 20, 50]}
          />
      </div>
    </div>
  )
}

export default Ascents