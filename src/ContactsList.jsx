import { ListGroup, Row, Col } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_ALL_CONTACTS } from './GraphQL/Queries';
import './styles/ContactsList.css';
import { useEffect, useState, useRef, useContext } from 'react';
import { ContactsContext } from './ContactsContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import ContactModal from './ContactModal';

export default function ContactsList() {
  // Main context
  const { data, fetchMore, contacts, setContacts, searchData } =
    useContext(ContactsContext);
  // GraphQL
  const { data: allContacts } = useQuery(GET_ALL_CONTACTS);
  // States
  const [hasMore, setHasMore] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  // Refs
  const offsetRef = useRef(0);
  const contactsLengthRef = useRef();
  const editedContactIdRef = useRef();

  const getNextContacts = async () => {
    const contactsLength = contactsLengthRef.current;
    let newData;

    if (offsetRef.current + 5 >= contactsLength) {
      setHasMore(false);
    } else if (contactsLength - (offsetRef.current + 5) >= 5) {
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
    if (searchData && !data) {
      setHasMore(contacts.length <= 5 ? false : true);
    } else if (data) {
      offsetRef.current = 0;
      setHasMore(allContacts.getAll.length <= 5 ? false : true);
    }
  }, [searchData, setContacts, fetchMore, data]);

  useEffect(() => {
    if (allContacts) {
      contactsLengthRef.current = allContacts.getAll.length;
    }
  }, [allContacts]);

  return (
    <>
      {contacts && allContacts.getAll && (
        <div key={offsetRef.current} id="scrollableDiv">
          <InfiniteScroll
            pullDownToRefreshThreshold={1}
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
                  onClick={() => {
                    editedContactIdRef.current = contact.id;
                    setModalShow(true);
                  }}
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
                        <img
                          className="contact-img"
                          alt="Contact"
                          src={contact.photo}
                        />
                      </Col>
                    )}
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </InfiniteScroll>
        </div>
      )}
      <ContactModal
        forPage="edit"
        editedContactId={editedContactIdRef.current}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}
