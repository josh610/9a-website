
import { gql, useQuery } from '@apollo/client'
import { QUERY_ALL_CLIMBERS } from '../../graphql/gql/climber'
import '../../styles/defaults.css'
import Table from '../ui/Table/Table'

const Climbers = () => {
  const {loading, error, data} = useQuery(gql`query Climbers {climber_aggregate {aggregate {count}}}`)

  return (
    <>
    <div>
      {loading ? error ? (<p>Error : {error.message}</p>) : (<p>Loading...</p>) : `${data.climber_aggregate.aggregate.count} Climbers`}
    </div>
    <br></br>
    <div>
        Climbers
        <Table
          columns={[
            { key: "climber", label: "Name", path: "name", sortable: true, filterable: true, links: true},
            { key: "dob", label: "Date of Birth", path: "dob", sortable: true},
            { key: "homeCountry", label: "Home Country", path: "home_country.name", sortable: true, filterable: true, links: true},
          ]}
          query={QUERY_ALL_CLIMBERS}
          queryVariables={{}}
          queryName={"climber"}
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

export default Climbers