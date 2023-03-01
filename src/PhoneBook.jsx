import { Container, Button, Row } from 'react-bootstrap';
import ContactsList from './ContactsList';
import SearchBar from './SearchBar';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_FIVE_DESC, GET_SEARCH_VALUES } from './GraphQL/Queries';
import { ContactsContext } from './ContactsContext';
import './styles/PhoneBook.css';
import ContactModal from './ContactModal';

export default function PhoneBook() {
  // States
  const [isSearchStarted, setIsSearchStarted] = useState(false);
  const [contacts, setContacts] = useState();
  const [modalShow, setModalShow] = useState(false);

  // GraphQL
  const [getSearchValues, { loading, error, data: searchData }] =
    useLazyQuery(GET_SEARCH_VALUES);
  const { data, fetchMore } = useQuery(GET_FIVE_DESC, {
    skip: isSearchStarted,
    variables: { offset: 0 },
  });

  useEffect(() => {
    if (data) {
      setContacts([...data.getFiveDesc]);
    }
  }, [data]);
  return (
    <ContactsContext.Provider
      value={{ data, fetchMore, contacts, setContacts, searchData }}
    >
      <Container className="container-center phonebook">
        <h1>Phone Book</h1>
        <Row className="add-contact-container">
          <Button variant="primary" onClick={() => setModalShow(true)}>
            Add Contact
          </Button>
        </Row>
        <Row className="search-container">
          <SearchBar
            setIsSearchStarted={setIsSearchStarted}
            lazyQueryContent={{ getSearchValues, searchData }}
          />
        </Row>
        <ContactsList />
      </Container>
      <ContactModal
        forPage="add"
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </ContactsContext.Provider>
  );
}
