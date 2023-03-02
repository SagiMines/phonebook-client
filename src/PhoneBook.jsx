import { Container, Button, Row } from 'react-bootstrap';
import ContactsList from './ContactsList';
import SearchBar from './SearchBar';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import {
  GET_BY_CONTACT_ID,
  GET_FIVE_DESC,
  GET_SEARCH_VALUES,
} from './GraphQL/Queries';
import { ContactsContext } from './ContactsContext';
import './styles/PhoneBook.css';
import ContactModal from './ContactModal';

export default function PhoneBook({ keyRef }) {
  // States
  const [isSearchStarted, setIsSearchStarted] = useState(false);
  const [contacts, setContacts] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [photoFilters, setPhotoFilters] = useState({});

  // GraphQL
  const [
    getPhotoFilterData,
    {
      loading: photoFilterLoading,
      error: photoFilterError,
      data: photoFilterData,
    },
  ] = useLazyQuery(GET_BY_CONTACT_ID);
  const [getSearchValues, { loading, error, data: searchData }] =
    useLazyQuery(GET_SEARCH_VALUES);
  const { data, fetchMore } = useQuery(GET_FIVE_DESC, {
    skip: isSearchStarted,
    variables: { offset: 0 },
  });

  // Checks if a contact has already set the photo filter and updates the state
  const getPhotoFilter = async () => {
    for (const contact of contacts || data.getFiveDesc) {
      const contactPhotoFilter = await getPhotoFilterData({
        variables: { contactId: contact.id },
      });
      if (contactPhotoFilter.data) {
        const photoFilter = { ...contactPhotoFilter.data.getByContactId };
        delete photoFilter.__typename;
        photoFilters[contact.id] = photoFilter;
      }
    }
    setPhotoFilters({ ...photoFilters });
  };

  // When a user scrolls the contacts list the key changes and the phonebook component renders
  useEffect(() => {
    if (contacts) {
      getPhotoFilter();
    }
  }, [keyRef.current]);

  // Initializing the first 5 contacts on the list
  useEffect(() => {
    if (data) {
      setContacts([...data.getFiveDesc]);
      getPhotoFilter();
    }
  }, [data, setContacts]);
  return (
    <ContactsContext.Provider
      value={{
        data,
        fetchMore,
        contacts,
        setContacts,
        searchData,
        getPhotoFilterData,
        photoFilters,
        setPhotoFilters,
      }}
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
        <ContactsList keyRef={keyRef} />
      </Container>
      <ContactModal
        forPage="add"
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </ContactsContext.Provider>
  );
}
