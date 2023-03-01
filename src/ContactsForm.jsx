import { Col, Form, Button, Row } from 'react-bootstrap';
import configData from './config/config.json';
import S3FileUpload from 'react-s3';
import './styles/ContactsForm.css';
import { useState, useEffect, useContext, useRef } from 'react';
import { ContactsContext } from './ContactsContext';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_CONTACT,
  UPDATE_CONTACT,
  REMOVE_CONTACT,
} from './GraphQL/Mutations';
import { GET_ONE_CONTACT } from './GraphQL/Queries';
window.Buffer = window.Buffer || require('buffer').Buffer;

// Configuration for react-s3 package
const config = {
  bucketName: configData.S3_BUCKET_NAME,
  region: configData.S3_REGION,
  accessKeyId: configData.S3_ACCESS_KEY,
  secretAccessKey: configData.S3_ACCESS_SECRET_KEY,
};

export default function ContactsForm(props) {
  // Main context
  const { fetchMore, setContacts } = useContext(ContactsContext);
  // GraphQL
  const [createContact, { error: createError }] = useMutation(CREATE_CONTACT);
  const [updateContact, { error: updateError }] = useMutation(UPDATE_CONTACT);
  const [removeContact, { error: removeError }] = useMutation(REMOVE_CONTACT);
  const { data: queryData } = useQuery(GET_ONE_CONTACT, {
    skip: props.forPage === 'add',
    variables: { id: props.editedContactId },
  });
  // States
  const [linkClick, setLinkClick] = useState(
    props.forPage === 'add'
      ? 0
      : {
          firstName: false,
          lastName: false,
          nickName: false,
          phoneNumbers: { click: false, times: 0 },
          address: false,
          photo: false,
        }
  );
  const [state, setState] = useState({
    alerts: {
      firstName: '',
      lastName: '',
      nickName: null,
      phoneNumbers: '',
      address: '',
    },
    values: {
      firstName: null,
      lastName: null,
      nickName: null,
      phoneNumbers: [],
      address: null,
      photo: null,
    },
  });
  // Refs
  const phoneNumberInputRef = useRef({});

  const handleChange = e => {
    e.target.name === 'photo'
      ? (state.values[e.target.name] = e.target.files[0])
      : (state.values[e.target.name] = e.target.value);
    switch (e.target.name) {
      case 'firstName':
      case 'lastName':
        state.alerts[e.target.name] =
          e.target.value.length > 50
            ? "* First name can't be longer than 50 characters"
            : e.target.value.length === 0
            ? "* First name can't be empty"
            : null;
        break;
      case 'nickName':
        state.alerts[e.target.name] =
          e.target.value.length > 50
            ? "* Nickname can't be longer than 50 characters"
            : null;
        break;
      case 'address':
        state.alerts[e.target.name] =
          e.target.value.length > 100
            ? "* Address can't be longer than 100 characters"
            : e.target.value.length === 0
            ? "* Address can't be empty"
            : null;
        break;
      case 'photo':
        break;
      default:
        console.log('Wrong input');
    }
    setState({ ...state });
  };

  const updateContactFunc = async e => {
    if (!state.alerts[e.target.name]) {
      await updateContact({
        variables: {
          contact: state.values,
          id: props.editedContactId,
        },
      });

      if (updateError) {
        console.log(updateError);
      }
      const refreshContacts = await fetchMore({
        variables: { offset: 0 },
      });
      setContacts([...refreshContacts.data.getFiveDesc]);
    }
  };

  const addContact = async () => {
    await createContact({
      variables: {
        contact: state.values,
      },
    });

    if (createError) {
      console.log(createError);
    }
    const refreshContacts = await fetchMore({
      variables: { offset: 0 },
    });
    setContacts([...refreshContacts.data.getFiveDesc]);
  };

  const createNameFromKey = key => {
    let name = key;
    if (/[A-Z]/.test(key)) {
      for (let i = 0; i < key.length; i++) {
        if (/[A-Z]/.test(key[i])) {
          name = `${
            key.slice(0, i).charAt(0).toUpperCase() + key.slice(0, i).slice(1)
          } ${key.slice(i).charAt(0).toLowerCase() + key.slice(i).slice(1)}`;
          return name;
        }
      }
    }
    return name;
  };

  const handlePhoneNumberChange = e => {
    phoneNumberInputRef.current[e.target.id] = e.target.value;

    state.alerts[e.target.name] =
      e.target.value.length === 0
        ? '* The phone number cannot be empty'
        : (state.alerts[e.target.name] = !/^\d+$/.test(e.target.value)
            ? '* Phone numbers can only include digits'
            : null);
  };

  const handleSubmit = async () => {
    if (props.forPage === 'add') {
      for (const [key, value] of Object.entries(phoneNumberInputRef.current)) {
        state.values.phoneNumbers[key] = value;
      }
    }

    // filter all the inputs with alerts
    const check = Object.entries(state.alerts).filter(
      value => value[1] !== null
    );
    if (!state.values.nickName) {
      delete state.values.nickName;
    }

    if (!check.length) {
      // get the photo
      S3FileUpload.uploadFile(state.values.photo, config)
        .then(data => {
          state.values.photo = data.location;
          setState({ ...state });
          addContact();
        })
        .catch(err => console.error(err));
    } else {
      console.log('Wrong input data provided');
    }
    props.closeModal();
  };

  const handleLinkClickEdit = e => {
    e.target.name === 'phoneNumbers'
      ? (linkClick[e.target.name].click = true)
      : (linkClick[e.target.name] = true);
    setLinkClick({ ...linkClick });
  };

  const handleRemove = async () => {
    props.closeModal();
    await removeContact({
      variables: {
        id: props.editedContactId,
      },
    });

    if (removeError) {
      console.log(removeError);
    }
    const refreshContacts = await fetchMore({
      variables: { offset: 0 },
    });
    setContacts([...refreshContacts.data.getFiveDesc]);
  };

  const handleEdit = async e => {
    if (e.target.name === 'phoneNumbers') {
      for (const [key, value] of Object.entries(phoneNumberInputRef.current)) {
        state.values.phoneNumbers[key] = value;
      }
    }
    if (e.target.name === 'photo') {
      const newData = await S3FileUpload.uploadFile(state.values.photo, config);
      state.values.photo = newData.location;

      setState({ ...state });
    }

    await updateContactFunc(e);

    e.target.name !== 'phoneNumbers'
      ? (linkClick[e.target.name] = false)
      : (linkClick[e.target.name].click = false);
    setLinkClick({ ...linkClick });
  };

  const handlePhoneNumberDelete = async e => {
    const filteredArray = state.values.phoneNumbers.filter(
      (number, index) => index !== Number(e.target.id)
    );
    state.values.phoneNumbers = filteredArray;

    await updateContactFunc(e);
  };

  useEffect(() => {
    if (props.forPage === 'edit' && queryData) {
      state.values = { ...queryData.getOne };
      delete state.values.__typename;
      delete state.values.id;
      state.values.phoneNumbers = [...state.values.phoneNumbers];
      setState({ ...state });
    }
  }, [queryData]);

  return (
    <Form>
      <Row>
        {Object.keys(state.values).map((key, index) =>
          key === 'phoneNumbers' ? (
            <Col key={index} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone numbers</Form.Label>

                {props.forPage === 'edit' &&
                  state.values.phoneNumbers.map((number, index) => (
                    <div key={index}>
                      {!linkClick.phoneNumbers.click && (
                        <Row>
                          <Col>
                            <h3 key={index}>{`${index + 1}. ${number}`}</h3>
                          </Col>
                          <Col>
                            <a
                              name="phoneNumbers"
                              id={index}
                              className="delete"
                              onClick={handlePhoneNumberDelete}
                            >
                              Delete
                            </a>
                          </Col>
                        </Row>
                      )}
                      {linkClick.phoneNumbers.click && (
                        <Form.Control
                          id={index}
                          onChange={handlePhoneNumberChange}
                          name="phoneNumbers"
                          defaultValue={number}
                          type="text"
                          placeholder="Phone number"
                        />
                      )}
                    </div>
                  ))}
                {props.forPage === 'add' && (
                  <Form.Control
                    id="0"
                    onChange={handlePhoneNumberChange}
                    name="phoneNumbers"
                    type="text"
                    placeholder="Phone number"
                  />
                )}

                {((props.forPage === 'add' && linkClick !== 0) ||
                  (props.forPage === 'edit' &&
                    linkClick.phoneNumbers.times !== 0 &&
                    linkClick.phoneNumbers.click)) &&
                  Array.from({
                    length:
                      props.forPage === 'add'
                        ? linkClick
                        : linkClick.phoneNumbers.times,
                  }).map((val, index) => (
                    <Form.Control
                      id={
                        props.forPage === 'edit'
                          ? state.values.phoneNumbers.length + index
                          : index + 1
                      }
                      onChange={handlePhoneNumberChange}
                      className="phone-number"
                      name="phoneNumbers"
                      key={index}
                      type="text"
                      placeholder="Phone number"
                    />
                  ))}

                {props.forPage === 'edit' && linkClick.phoneNumbers.click && (
                  <Button
                    className="confirm-button"
                    variant="dark"
                    name="phoneNumbers"
                    onClick={handleEdit}
                  >
                    Confirm
                  </Button>
                )}
                {props.forPage === 'edit' && !linkClick.phoneNumbers.click && (
                  <a
                    name="phoneNumbers"
                    className="add-more"
                    onClick={handleLinkClickEdit}
                  >
                    Edit
                  </a>
                )}

                {((props.forPage === 'edit' && linkClick.phoneNumbers.click) ||
                  props.forPage === 'add') && (
                  <a
                    className="add-more"
                    onClick={
                      props.forPage === 'add'
                        ? () => {
                            setLinkClick(prevVal => prevVal + 1);
                          }
                        : () => {
                            linkClick.phoneNumbers.times += 1;

                            setLinkClick({ ...linkClick });
                          }
                    }
                  >
                    + Add more
                  </a>
                )}
              </Form.Group>
              <p className="input-alert">
                {state.alerts.phoneNumbers && state.alerts.phoneNumbers}
              </p>
            </Col>
          ) : key === 'photo' ? (
            <Col key={index} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Upload photo</Form.Label>
                <Row>
                  {props.forPage === 'edit' && !linkClick.photo && (
                    <img className="contact-image" src={state.values.photo} />
                  )}
                  {(props.forPage === 'add' || linkClick.photo) && (
                    <Form.Control
                      onChange={handleChange}
                      name="photo"
                      type="file"
                      accept="image/png, image/jpeg"
                    />
                  )}
                </Row>
                <Row>
                  {props.forPage === 'edit' && !linkClick.photo && (
                    <a
                      name="photo"
                      className="add-more"
                      onClick={handleLinkClickEdit}
                    >
                      Edit
                    </a>
                  )}
                </Row>

                {linkClick.photo && (
                  <Button
                    className="confirm-button"
                    variant="dark"
                    name="photo"
                    onClick={handleEdit}
                  >
                    Confirm
                  </Button>
                )}
              </Form.Group>
            </Col>
          ) : (
            <Col key={index} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{createNameFromKey(key)}</Form.Label>
                {props.forPage === 'edit' && !linkClick[key] && (
                  <h3>
                    {key === 'nickName' && !state.values[key]
                      ? 'No nickname provided!'
                      : state.values[key]}
                  </h3>
                )}
                {(props.forPage === 'add' || linkClick[key]) && (
                  <Form.Control
                    onChange={handleChange}
                    name={key}
                    defaultValue={
                      props.forPage === 'edit' ? state.values[key] : undefined
                    }
                    type="text"
                    placeholder={createNameFromKey(key)}
                  />
                )}
                {linkClick[key] && (
                  <Button
                    className="confirm-button"
                    variant="dark"
                    name={key}
                    onClick={handleEdit}
                  >
                    Confirm
                  </Button>
                )}
                {props.forPage === 'edit' && !linkClick[key] && (
                  <a
                    name={key}
                    className="add-more"
                    onClick={handleLinkClickEdit}
                  >
                    Edit
                  </a>
                )}
              </Form.Group>
              <p className="input-alert">
                {state.alerts[key] && state.alerts[key]}
              </p>
            </Col>
          )
        )}
      </Row>
      <Row className="add-contact-submit-button">
        <Button
          onClick={props.forPage === 'edit' ? handleRemove : handleSubmit}
          variant={props.forPage === 'edit' ? 'danger' : 'primary'}
        >
          {props.forPage === 'edit' ? 'Delete contact' : 'Submit'}
        </Button>
      </Row>
    </Form>
  );
}
