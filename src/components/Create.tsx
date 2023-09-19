import React, { useState } from 'react'
import { DocumentNode, gql } from '@apollo/client'
import { graphqlClient } from '../graphql/Client'
import Dropdown, { DropdownFromQuery } from './ui/Dropdown'

interface InputProps {
    fieldName: string
    required?: boolean
    label: string
}

interface DbInputProps extends InputProps {
    query: DocumentNode
    tableName: string
    keyPath: string
    valuePath: string
    labelPath: string
}

/**
 * dbFields: fields that we're searching the db for, then using a value from the query
 * regFields: field can be any user input, does not need to come from the db
 */
export interface CreateProps {
    mutation: DocumentNode
    tableName: string
    dbFields: DbInputProps[]
    regFields: InputProps[]
}

interface Fields {
    [key: string]: string
}

interface RequiredFieldsList {
    [key: string]: boolean
}

const Create = (props: CreateProps) => {
    const [fields, _setFields] = useState<Fields>({})
    const setFields = (target: string, value: string) => {
        const t = fields
        t[target] = value
        _setFields(t)
    }
    const [requiredFieldsList, _setRequiredFieldsList] = useState<RequiredFieldsList>(initRequiredFieldsList(props.dbFields, props.regFields))
    const setRequiredFieldsList = (target: string, value: boolean) => {
        const t = requiredFieldsList
        t[target] = value
        _setRequiredFieldsList(t)
    }

    const [showButton, setShowButton] = useState<boolean>(false)

    const requiredFieldsCompleted = (): boolean => {
        for(const property in requiredFieldsList) {
            if(requiredFieldsList[property] == false) {
                return false
            }
        }
        return true
    }

    const handleChange = (f: InputProps, value: string) => {
        setFields(f.fieldName, value)
        if(f.required) {
            if(value != "") setRequiredFieldsList(f.fieldName, true)
            else setRequiredFieldsList(f.fieldName, false)
        }
        setShowButton(requiredFieldsCompleted())
    }


    const addToDb = () => {
        const mutation = props.mutation
        const variables = {[props.tableName]: fields}
        
        graphqlClient.mutate({mutation: mutation, variables: variables})
        .then(rs => {
            const affectedRows = rs.data[`insert_${props.tableName}`].affected_rows
            alert(`${affectedRows} row(s) updated`)
        })
    }

    return (
        <div>
            {props.dbFields.map(f => {
                return (
                    <div>
                        {f.required ? "*" : ""}
                        <DropdownFromQuery
                            placeholder={f.label}
                            query={f.query}
                            tableName={f.tableName}
                            keyPath={f.keyPath}
                            valuePath={f.valuePath}
                            labelPath={f.labelPath}
                            onChange={e => handleChange(f, e)}
                        />
                    </div>
                )
            })}
            {props.regFields.map(f => {
                return (
                    <div>
                        {f.required ? "*" : ""}
                        <input
                        placeholder={f.label}
                        onChange={e => handleChange(f, e.target.value)}
                    />
                    </div>
                )
            })}
            <br/><br/>
            {
                showButton ? 
                <button
                    className="border-2 bg-red-200"
                    onClick={addToDb}
                    >Add
                </button>
                :
                <></>
            }
        </div>
    )
}

const initRequiredFieldsList = (dbFields: DbInputProps[], regFields: InputProps[]): RequiredFieldsList => {
    let requiredFields: RequiredFieldsList = {}
    dbFields.forEach(f => {
        if(f.required) requiredFields[f.fieldName] = false
    })
    regFields.forEach(f => {
        if(f.required) requiredFields[f.fieldName] = false
    })

    return requiredFields
}

export default Create