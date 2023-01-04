import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from '@apollo/client';
import Header from './Components/Header';
const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://closing-gull-83.hasura.app/v1/graphql',
    headers: {
      'x-hasura-admin-secret': `KwPSEboGhLYx615T48BHFVZ9Vqwq4T9BT5EwAzKO9BMUz28qNMMUE8xBZKMW0pGx`,
    },
  }),
  cache: new InMemoryCache(),
});
export default function App() {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Header />
      </ChakraProvider>
    </ApolloProvider>
  );
}

//export default App;
