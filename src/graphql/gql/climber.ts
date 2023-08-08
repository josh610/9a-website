import { gql } from '@apollo/client'

export interface ClimberProps{
    id: number
    ascents: {
        _date?: string
        climb: {
            name: string
            grade: string
        }
        grade_proposal?: string
        fa?: boolean
        flash?: boolean
        onsight?: boolean
    }
    home_country: {
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
            _date
            climb {
                name
                grade
            }
            grade_proposal
            fa
            flash
            onsight
        }
        home_country {
            name
        }
        dob
        name
        nickname
        sex
    }
  }
`