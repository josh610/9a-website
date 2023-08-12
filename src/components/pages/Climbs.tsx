
import { gql, useQuery } from '@apollo/client'
import { QUERY_ALL_CLIMBS } from '../../graphql/gql/climb'
import '../../styles/defaults.css'
import Table from '../ui/Table/Table'

const Climbs = () => {
  const {loading, error, data} = useQuery(gql`query Climbs {climb_aggregate {aggregate {count}}}`)

  return (
    <>
    <div>
      {loading ? error ? (<p>Error : {error.message}</p>) : (<p>Loading...</p>) : `${data.climb_aggregate.aggregate.count} Climbs`}
    </div>
    <br></br>
    <div>
        Climbs
        <Table
          columns={[
            { key: "climb", label: "Name", path: "name", sortable: true, filterable: true, links: true},
            { key: "grade", label: "Grade", path: "grade", sortable: true, filterable: true},
            { key: "crag", label: "Crag", path: "crag.name", sortable: true, filterable: true, links: true},
            { key: "country", label: "Country", path: "crag.country.name", sortable: true, filterable: true}
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
    </>
  )
}

export default Climbs