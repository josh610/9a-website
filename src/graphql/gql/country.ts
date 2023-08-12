import { gql } from '@apollo/client'

export interface CountryProps{
    id: number
    name: string
    crags?:{
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
    }
    climbers?: {
        id: number
        name: string
    }
}

export const QUERY_ALL_COUNTRIES = gql`
query Countries($order_by: [country_order_by!], $where: country_bool_exp, $limit: Int) {
    country(order_by: $order_by, where: $where, limit: $limit) {
        id
        name
        crags {
            id
            name
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
        }
        climbers {
            id
            name
        }
    }
  }
`