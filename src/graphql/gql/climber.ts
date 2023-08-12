import { gql } from '@apollo/client'

export interface ClimberProps{
    id: number
    ascents: {
        id: number
        _date?: string
        climb: {
            id: number
            name: string
            grade: string
        }
        grade_proposal?: string
        fa?: boolean
        flash?: boolean
        onsight?: boolean
    }
    home_country: {
        id: number
        name: string
    } 
    dob?: string
    name: string
    nickname?: string
    sex?: string
}

export const QUERY_ALL_CLIMBERS = gql`
query Climbers($order_by: [climber_order_by!], $where: climber_bool_exp, $limit: Int) {
    climber(order_by: $order_by, where: $where, limit: $limit) {
        id
        added_at
        ascents {
            id
            _date
            climb {
                id
                name
                grade
            }
            grade_proposal
            fa
            flash
            onsight
        }
        home_country {
            id
            name
        }
        dob
        name
        nickname
        sex
    }
  }
`