import { gql } from '@apollo/client'

export interface CragProps{
    id: number
    climbs?: {
        name: string
        grade: string
        ascents?: {
            _date?: string
            climber: {
                name: string
                home_country: {
                    name: string
                }
            }
        }
    }
    country: {
        name: string
    }
    name: string
}

export const QUERY_ALL_CRAGS = gql`
query Crags($order_by: [crag_order_by!], $where: crag_bool_exp, $limit: Int) {
    crag(order_by: $order_by, where: $where, limit: $limit) {
        id
        added_at
        climbs {
            name
            grade
            ascents {
                _date
                climber {
                    name
                    home_country {
                        name
                    }
                }
            }
        }
        country {
            name
        }
        name
    }
  }
`