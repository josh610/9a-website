import { ApolloClient, InMemoryCache } from '@apollo/client'

export const graphqlClient = new ApolloClient({
    uri: "http://localhost:8080/v1/graphql", cache: new InMemoryCache()
})