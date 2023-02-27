import { ListGroup, Badge, Row, Col } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_ALL_CONTACTS, GET_FIVE_DESC } from './GraphQL/Queries';
// import { CREATE_CONTACT } from './GraphQL/Mutations';
import './styles/ContactsList.css';
import { useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
// import { useEffect } from 'react';

export default function ContactsList() {
  const { data: allContacts } = useQuery(GET_ALL_CONTACTS);
  const { data, fetchMore } = useQuery(GET_FIVE_DESC, {
    variables: { offset: 0 },
  });
  const [contacts, setContacts] = useState();
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const contactsLengthRef = useRef();

  const getNextContacts = async () => {
    const contactsLength = contactsLengthRef.current;
    let newData;
    if (offsetRef.current + 5 === contactsLength) {
      setHasMore(false);
    } else if (contactsLength - (offsetRef.current + 5) > 5) {
      offsetRef.current += 5;
      newData = await fetchMore({
        variables: { offset: offsetRef.current },
      });
      setContacts([...newData.data.getFiveDesc]);
    } else if (contactsLength - (offsetRef.current + 5) < 5) {
      offsetRef.current = contactsLength - 5;
      newData = await fetchMore({ variables: { offset: offsetRef.current } });
      setContacts([...newData.data.getFiveDesc]);
    }
  };

  useEffect(() => {
    if (data) {
      setContacts([...data.getFiveDesc]);
    }
  }, [data]);
  useEffect(() => {
    if (allContacts) {
      contactsLengthRef.current = allContacts.getAll.length;
    }
  }, [allContacts]);

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
    <>
      {contacts && allContacts.getAll && (
        <div id="scrollableDiv">
          <InfiniteScroll
            key={offsetRef.current}
            dataLength={contacts.length}
            next={getNextContacts}
            hasMore={hasMore}
            scrollableTarget="scrollableDiv"
            loader={
              <p style={{ textAlign: 'center' }}>
                <b>Loading...</b>
              </p>
            }
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>No more contacts</b>
              </p>
            }
          >
            <ListGroup as="ol">
              {contacts.map((contact, index) => (
                <ListGroup.Item
                  as="li"
                  className="d-flex align-items-start"
                  key={index}
                >
                  <Row className="contact-info">
                    <Col>
                      {contact.nickName ? (
                        <div className="fw-bold">{contact.nickName}</div>
                      ) : (
                        <div className="fw-bold">{`${contact.firstName}${contact.lastName}`}</div>
                      )}
                    </Col>
                    {!contact.nickName && (
                      <Col>
                        <img className="contact-img" src={contact.photo} />
                      </Col>
                    )}
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </InfiniteScroll>
        </div>
      )}
    </>
  );
}
