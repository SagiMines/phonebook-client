import { ListGroup, Badge } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_ALL_CONTACTS } from './GraphQL/Queries';
// import { CREATE_CONTACT } from './GraphQL/Mutations';
import './styles/ContactsList.css';
import { useEffect, useState } from 'react';
// import { useEffect } from 'react';

export default function ContactsList() {
  const { error, loading, data } = useQuery(GET_ALL_CONTACTS, {
    variables: { offset: 0 },
  });
  const [contacts, setContacts] = useState();

  useEffect(() => {
    if (data) {
      setContacts([...data.getAllContacts]);
    }
  }, [data]);

  //   const addContact = async () => {
  //     await createContact({
  //       variables: {
  //         contact: {
  //           firstName: 'Sagi2',
  //           lastName: 'Mines2',
  //           phoneNumbers: ['045354353', '234234234'],
  //           address: 'dsfsdfsdf',
  //           photo:
  //             'https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bWFufGVufDB8fDB8fA%3D%3D&w=1000&q=80',
  //         },
  //       },
  //     });

  //     if (error) {
  //       console.log(error);
  //     }
  //   };
  //   useEffect(() => {
  //     addContact();
  //   }, []);

  return (
    <ListGroup as="ol" numbered>
      {contacts &&
        contacts.map((contact, index) => (
          <ListGroup.Item key={index}>
            {contact.nickName
              ? contact.nickName
              : `${contact.firstName}${contact.lastName}`}
          </ListGroup.Item>
        ))}
      {/* <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">Subheading</div>
        </div>
        <Badge bg="primary" pill>
          14
        </Badge>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">Subheading</div>
        </div>
        <Badge bg="primary" pill>
          14
        </Badge>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">Subheading</div>
        </div>
        <Badge bg="primary" pill>
          14
        </Badge>
      </ListGroup.Item> */}
    </ListGroup>
  );
}
