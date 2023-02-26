import { Container, Button } from 'react-bootstrap';
import ContactsList from './ContactsList';
import SearchBar from './SearchBar';
import './styles/PhoneBook.css';

export default function PhoneBook() {
  return (
    <Container className="container-center phonebook">
      <h1>Phone Book</h1>
      <SearchBar />
      <Button variant="primary">Add Contact</Button>
      <ContactsList />
    </Container>
  );
}
