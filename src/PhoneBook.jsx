import { Container, Button } from 'react-bootstrap';
import ContactsList from './ContactsList';
import SearchBar from './SearchBar';
import { useState, useEffect, useRef } from 'react';
import './styles/PhoneBook.css';
import ContactModal from './ContactModal';

export default function PhoneBook() {
  const [modalShow, setModalShow] = useState(false);
  const [isContactAdded, setIsContactAdded] = useState(false);
  const randomKeyRef = useRef(Math.random());

  useEffect(() => {
    if (isContactAdded) {
      randomKeyRef.current = Math.random();
      setIsContactAdded(false);
    }
  }, [isContactAdded]);
  return (
    <>
      <Container className="container-center phonebook">
        <h1>Phone Book</h1>
        <SearchBar />
        <Button variant="primary" onClick={() => setModalShow(true)}>
          Add Contact
        </Button>
        <ContactsList key={randomKeyRef.current} />
      </Container>
      <ContactModal
        isContactAddedSetter={setIsContactAdded}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}
