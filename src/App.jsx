import PhoneBook from './PhoneBook';
import './styles/App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from '@apollo/client';
import { useRef } from 'react';
import { onError } from '@apollo/client/link/error';
import configData from './config/config.json';

const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message, location, path }) => {
      alert(`Graphql error: ${message}`);
    });
  }
});

const link = from([errorLink, new HttpLink({ uri: configData.SERVER_URL })]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

function App() {
  const keyRef = useRef(Math.random());
  return (
    <ApolloProvider client={client}>
      <div className="App container-center">
        <PhoneBook key={keyRef.current} keyRef={keyRef} />
      </div>
    </ApolloProvider>
  );
}

export default App;
