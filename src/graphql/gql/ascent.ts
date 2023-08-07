import { gql } from '@apollo/client'

export interface AscentProps{
  climber: {
    name: String
  }
  climb: {
    name: String
    grade: String
    crag: {
      name: String
      country: {
        name: String
      }
    }
  }
  proposedGrade?: string
  _date?: string
  fa?: boolean
}

export const QUERY_ALL_ASCENTS = gql`
  query Ascents($order_by: [ascent_order_by!], $where: ascent_bool_exp, $limit: Int) {
    ascent(order_by: $order_by, where: $where, limit: $limit) {
      added_at
      climb {
        added_at
        name
        grade
        crag {
          name
          country {
            name
          }
        }
      }
      climber {
        added_at
        name
        home_country {
          name
        }
      }
      fa
      _date
    }
  }
  `