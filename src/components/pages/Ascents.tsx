import {  QUERY_ALL_ASCENTS } from '../../graphql/gql/ascent'
import '../../styles/defaults.css'
import Table from '../ui/Table/Table'

const Ascents = () => {
    return (
        <div>
            Ascents
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
    )
}

export default Ascents