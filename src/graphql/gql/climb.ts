import { gql } from '@apollo/client'

export interface ClimbProps{
  id: number
  ascents: {
    _date?: string
    climber: {
        name: string
        country: {
          name: string
        }
    }
  }
  crag: {
    name: string
    country: {
      name: string
    }
  } 
  grade: string
  name: string
}

export const QUERY_ALL_CLIMBS = gql`
query Climbs($order_by: [climb_order_by!], $where: climb_bool_exp, $limit: Int) {
  climb(order_by: $order_by, where: $where, limit: $limit) {
    id
    added_at
    ascents {
      _date
      climber {
          name
          home_country {
            name
          }
      }
    }
    crag {
      name
      country {
        name
      }
    }
    grade
    name
    }
  }
`