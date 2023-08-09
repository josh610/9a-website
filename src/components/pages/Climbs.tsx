
import { QUERY_ALL_CLIMBS } from '../../graphql/gql/climb'
import '../../styles/defaults.css'
import Table from '../ui/Table/Table'

const Climbs = () => {
    return (
        <div className='Ascent'>
            <Table
              columns={[
                { key: "1", label: "Name", path: "name", sortable: true, filterable: true},
                { key: "2", label: "Grade", path: "grade", sortable: true, filterable: true},
                { key: "3", label: "Crag", path: "crag.name", sortable: true, filterable: true},
                { key: "4", label: "Country", path: "crag.country.name", sortable: true, filterable: true}
                //{ key: "5", label: "Number of ascents", path: "", sortable: true, filterable: true},
                //{ key: "6", label: "Fa", path: "_date", sortable: true, filterable: true}
              ]}
              query={QUERY_ALL_CLIMBS}
              queryVariables={{}}
              queryName={"climb"}
              queryFilterMap={{
                "where": {
                    name: {},
                    grade: {},
                    crag: {
                        name: {},
                        country: {
                            name: {}
                        }
                    }
                }
              }}
              queryLimits={[10, 20, 50]}
            />
        </div>
    )
}

export default Climbs