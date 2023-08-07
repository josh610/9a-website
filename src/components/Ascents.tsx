import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { AscentProps, QUERY_ALL_ASCENTS } from '../graphql/gql/ascent'
import { ClimberProps, QUERY_ALL_CLIMBERS } from '../graphql/gql/climber'
import { ClimbProps, QUERY_ALL_CLIMBS } from '../graphql/gql/climb'
import { CragProps, QUERY_ALL_CRAGS } from '../graphql/gql/crag'
import Dropdown from './ui/Dropdown'
import '../styles/defaults.css'

interface FilterProps{
  refetch: (params?: any) => any
}

const AscentsFilter = ({ refetch }: FilterProps) => {
  const [ascentDisplayLimit, setAscentDisplayLimit] = useState<Number>(10)
  const [ascentFilter, setAscentFilter] = useState({"where": {}})
  const [climbNameFilter, setClimbNameFilter] = useState({})
  const [climberNameFilter, setClimberNameFilter] = useState({climber: {name: {}}})
  const [ascentSortBy, setAscentSortBy] = useState({})

  const changeLimit = (newLimit: Number) => {
    setAscentDisplayLimit(newLimit)
    refetch({"limit": Number(newLimit)})
  }

  const changeFilter = () => {
    console.log({where: {climberNameFilter, climbNameFilter}})
    refetch({where: {climberNameFilter, climbNameFilter}})
  }

  const changeClimberNameFilter = (newFilter: {climber: {name: {}}}) => {
    setClimberNameFilter(newFilter)
    changeFilter()
  }

  const changeClimbNameFilter = (newFilter: {}) => {
    setClimbNameFilter(newFilter)
    changeFilter()
  }

  const changeSortBy = (newSort: any) => {
    setAscentSortBy(newSort)
    refetch({"order_by": newSort})
  }

  const {loading: climberQueryLoading, data: climberQueryData} = useQuery(QUERY_ALL_CLIMBERS,
    {variables: {
      "order_by": {"name": "asc"}
    }
  })
  
  const {loading: climbQueryLoading, data: climbQueryData} = useQuery(QUERY_ALL_CLIMBS,
    {variables: {
      "order_by": {"name": "asc"}
    }
  })

  const {loading: cragQueryLoading, data: cragQueryData} = useQuery(QUERY_ALL_CRAGS,
    {variables: {
      "order_by": {"name": "asc"}
    }
  })

  return (
      <div className='grid-x'>
          Filter
            <Dropdown onChange={changeClimberNameFilter} options={
                climberQueryLoading ? [{value: null, label: "Loading..."}] :
                [{value: null, label: "Climber: None"}].concat(
                  climberQueryData.climber.map((climber: ClimberProps) => {
                    return {
                      value: {climber: {name: {_eq: climber.name}}},
                      label: climber.name
                    }
                  }
                ))
              }></Dropdown>
            <Dropdown onChange={changeClimbNameFilter} options={
                climbQueryLoading ? [{value: null, label: "Loading..."}] :
                [{value: null, label: "Climb: None"}].concat(
                  climbQueryData.climb.map((climb: ClimbProps) => {
                    return {
                      value: {climb: {name: {_eq: climb.name}}},
                      label: climb.name
                    }
                  }
                ))
              }></Dropdown>
            <Dropdown onChange={changeFilter} options={
                cragQueryLoading ? [{value: null, label: "Loading..."}] :
                [{value: null, label: "Crag: None"}].concat(
                  cragQueryData.crag.map((crag: CragProps) => {
                    return {
                      value: {climb: {crag: {name: {_eq: crag.name}}}},
                      label: crag.name
                    }
                  }
                ))
              }></Dropdown>
            <Dropdown options={[{value: null, label: "Climb Country"}]}></Dropdown>
            <Dropdown options={[{value: null, label: "Climber Country"}]}></Dropdown>
          Show
            <Dropdown onChange={changeLimit} options={[
              {value: 10, label: "10"},
              {value: 20, label: "20"},
              {value: 50, label: "50"}]}
              ></Dropdown>
          Sort By
            <Dropdown onChange={changeSortBy} options={[
              {value: null, label: "None"},
              {value: {_date: "asc"}, label: "Climber Name"},
              {value: {climber: {name: "asc"}}, label: "Climber Name"},
              {value: {climb: {name: "asc"}}, label: "Climb Name"}]}
              ></Dropdown>
      </div>
  )
}

const DisplayAscent = ({climber, climb, proposedGrade, _date, fa}: AscentProps) => {

  return (
      <tr className='row'>
          <td className='column'>{climber.name}</td>
          <td className='column'>{climb.name}</td>
          <td className='column'>{climb.grade}</td>
          <td className='column'>{proposedGrade}</td>
          <td className='column'>{climb.crag.name}</td>
          <td className='column'>{_date}</td>
      </tr>
  )
}

const DisplayAscents = () => {
  const {loading, error, data, refetch} = useQuery(QUERY_ALL_ASCENTS,
      {variables: {
        "limit": 10,
      }
    })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error : {error.message}</p>

  return (
      <div className='Ascent'>
          <AscentsFilter refetch={refetch}/>
          <table className='ascents'>
              <tr className='row' key='ascent'>
                  <th className='column' key="climber">Climber</th>
                  <th className='column' key="climb">Climb</th>
                  <th className='column' key="climb">Grade</th>
                  <th className='column' key="gradeProposal">Proposed Grade</th>
                  <th className='column' key="area">Area</th>
                  <th className='column' key="date">Date</th>
              </tr>
              {data.ascent.map((ascent: AscentProps) => DisplayAscent(ascent))}
          </table>
      </div>
  )
}

export default DisplayAscents