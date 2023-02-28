import { Container, Button, Row } from 'react-bootstrap';
import ContactsList from './ContactsList';
import SearchBar from './SearchBar';
import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_FIVE_DESC } from './GraphQL/Queries';
import { ContactsContext } from './ContactsContext';
import './styles/PhoneBook.css';
import ContactModal from './ContactModal';

export default function PhoneBook() {
  // GraphQL
  const { data, fetchMore } = useQuery(GET_FIVE_DESC, {
    variables: { offset: 0 },
  });
  // States
  const [contacts, setContacts] = useState();
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    if (data) {
      setContacts([...data.getFiveDesc]);
    }
  }, [data]);
  return (
    <ContactsContext.Provider
      value={{ data, fetchMore, contacts, setContacts }}
    >
      <Container className="container-center phonebook">
        <h1>Phone Book</h1>
        <Row className="add-contact-container">
          <Button variant="primary" onClick={() => setModalShow(true)}>
            Add Contact
          </Button>
        </Row>
        <Row className="search-container">
          <SearchBar />
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
