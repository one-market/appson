import React from 'react'
import { appson } from '@onemarket/appson'
import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo'
import Simple from './'

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'https://api.graph.cool/simple/v1/cj7tmy5j112wl0111ihu974m1',
  }),
})

const app = appson(Simple)
  .addMiddleware(client.middleware())
  .addReducer({ apollo: client.reducer() })
  .wrapper(({ store, children }) => (
    <ApolloProvider store={store} client={client}>
      {children}
    </ApolloProvider>
  ))

app.render('#root')
