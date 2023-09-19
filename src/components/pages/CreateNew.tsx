import React, { useState } from 'react'
import { DocumentNode, gql } from '@apollo/client'
import Create, { CreateProps } from '../Create'
import { QUERY_ALL_CLIMBS } from '../../graphql/gql/climb'
import { QUERY_ALL_CLIMBERS } from '../../graphql/gql/climber'
import { QUERY_ALL_COUNTRIES } from '../../graphql/gql/country'
import { QUERY_ALL_CRAGS } from '../../graphql/gql/crag'


interface CreateObjectProps extends CreateProps {
    label: string
}

const CreateObject = (props: CreateObjectProps) => {
    const [display, setDisplay] = useState<boolean>(false)
    const [label, setLabel] = useState<string>(props.label)
    return (
        <div className="border-2">
            <button
                onClick={() => {
                    if(display) {
                        setDisplay(false)
                        setLabel(props.label)
                    }
                    else {
                        setDisplay(true)
                        setLabel(props.label + "▼")
                    }
                }}>
                {label}
            </button>
            {
                display ?
                <Create mutation={props.mutation} tableName={props.tableName} regFields={props.regFields} dbFields={props.dbFields}/>
                : <></>
            }
        </div>
    )
}

const CreateNew = () => {
    return (
        <div>
            Add new:

            <CreateObject
                label="Ascent"
                mutation={createInsertMutation("ascent")}
                tableName='ascent'
                regFields={[
                    {fieldName: "_date", label: "Date"},
                    {fieldName: "grade_proposal", label: "Proposed Grade"},
                    {fieldName: "fa", label: "FA"}
                ]}
                dbFields={[
                    {fieldName: "climber_id", label: "Climber", tableName: "climber", query: QUERY_ALL_CLIMBERS, keyPath: "id", valuePath: "id", labelPath: "name", required: true},
                    {fieldName: "climb_id", label: "Climb", tableName: "climb", query: QUERY_ALL_CLIMBS, keyPath: "id", valuePath: "id", labelPath: "name", required: true}
                ]}/>
                
            <CreateObject
                label="Climber"
                mutation={createInsertMutation("climber")}
                tableName='climber'
                regFields={[
                    {fieldName: "name", label: "Name", required: true},
                    {fieldName: "nickname", label: "Nickname"},
                    {fieldName: "dob", label: "Date of birth"},
                    {fieldName: "sex", label: "Sex"}
                ]}
                dbFields={[
                    {fieldName: "country_id", label: "Home Country", tableName: "country", query: QUERY_ALL_COUNTRIES, keyPath: "id", valuePath: "id", labelPath: "name"},
                ]}/>

            <CreateObject
                label="Climb"
                mutation={createInsertMutation("climb")}
                tableName='climb'
                regFields={[
                    {fieldName: "name", label: "Name", required: true},
                    {fieldName: "grade", label: "Grade", required: true},
                ]}
                dbFields={[
                    {fieldName: "crag_id", label: "Crag", tableName: "crag", query: QUERY_ALL_CRAGS, keyPath: "id", valuePath: "id", labelPath: "name"},
                ]}/>

            <CreateObject
                label="Crag"
                mutation={createInsertMutation("crag")}
                tableName='crag'
                regFields={[
                    {fieldName: "name", label: "Name", required: true}
                ]}
                dbFields={[
                    {fieldName: "country_id", label: "Country", tableName: "country", query: QUERY_ALL_COUNTRIES, keyPath: "id", valuePath: "id", labelPath: "name", required: true},
                ]}/>
        </div>
    )
}

const createInsertMutation = (tableName: string): DocumentNode => {
    return gql(`
        mutation Insert_${capitalize(tableName)}($${tableName}: [${tableName}_insert_input!]!) {
            insert_${tableName}(objects: $${tableName}) {
                affected_rows
            }
        }
    `)
}

/**
 * Capitalizes the first letter of a string
 */
const capitalize = (str: string): string => {
    const firstLetter = str.charAt(0).toUpperCase()
    return firstLetter + str.slice(1)
}

export default CreateNew