import { gql } from '@apollo/client'

export interface CragProps{
    id: number
    name: string
    climbs?: {
        id: number
        name: string
        grade: string
        ascents?: {
            id: number
            _date?: string
            climber: {
                id: number
                name: string
                home_country: {
                    id: number
                    name: string
                }
            }
        }
    }
    country: {
        id: number
        name: string
    }
}

export const QUERY_ALL_CRAGS = gql`
query Crags($order_by: [crag_order_by!], $where: crag_bool_exp, $limit: Int) {
    crag(order_by: $order_by, where: $where, limit: $limit) {
        id
        name
        added_at
        climbs {
            id
            name
            grade
            ascents {
                id
                _date
                climber {
                    id
                    name
                    home_country {
                        id
                        name
                    }
                }
            }
        }
        country {
            id
            name
        }
    }
  }
`