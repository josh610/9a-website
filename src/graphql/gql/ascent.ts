import { gql } from '@apollo/client'

export interface AscentProps{
  id: number
  climber: {
    id: number
    name: String
  }
  climb: {
    name: String
    id: number
    grade: String
    crag: {
      id: number
      name: String
      country: {
        id: number
        name: String
      }
    }
  }
  proposedGrade?: string
  _date?: string
  fa?: boolean
  ascent_media?: {
    id: number
    media: {
      id: number
      type: string
      label: string
      url: string
    }
  }[]
}

export const QUERY_ALL_ASCENTS = gql`
  query Ascents($order_by: [ascent_order_by!], $where: ascent_bool_exp, $limit: Int) {
    ascent(order_by: $order_by, where: $where, limit: $limit) {
      id
      added_at
      climb {
        id
        added_at
        name
        grade
        crag {
          id
          name
          country {
            id
            name
          }
        }
      }
      climber {
        id
        added_at
        name
        home_country {
          id
          name
        }
      }
      fa
      _date
      ascent_media {
        id
        media {
            id
            type
            label
            url
        }
      }
    }
  }
  `