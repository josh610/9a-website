import {  QUERY_ALL_ASCENTS } from '../../graphql/gql/ascent'
import '../../styles/defaults.css'
import Table from '../ui/Table/Table'

const Ascents = () => {
    return (
        <div className='Ascent'>
            <Table
              columns={[
                { key: "1", label: "Climber", path: "climber.name", sortable: true, filterable: true},
                { key: "2", label: "Climb", path: "climb.name", sortable: true, filterable: true},
                { key: "3", label: "Grade", path: "climb.grade", sortable: true, filterable: true},
                { key: "4", label: "Proposed Grade", path: "grade_proposal", sortable: true, filterable: true},
                { key: "5", label: "Area", path: "climb.crag.name", sortable: true, filterable: true},
                { key: "6", label: "Date", path: "_date", sortable: true, filterable: true}
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