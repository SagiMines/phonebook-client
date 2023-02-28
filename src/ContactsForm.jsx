import { Col, Form, Button, Row } from 'react-bootstrap';
import configData from './config/config.json';
import S3FileUpload from 'react-s3';
import './styles/ContactsForm.css';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_CONTACT } from './GraphQL/Mutations';
window.Buffer = window.Buffer || require('buffer').Buffer;

const config = {
  bucketName: configData.S3_BUCKET_NAME,
  region: configData.S3_REGION,
  accessKeyId: configData.S3_ACCESS_KEY,
  secretAccessKey: configData.S3_ACCESS_SECRET_KEY,
};

export default function ContactsForm(props) {
  const [createContact, { error }] = useMutation(CREATE_CONTACT);
  const [linkClick, setLinkClick] = useState(0);
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

  const addContact = async () => {
    console.log(state.values);
    await createContact({
      variables: {
        contact: state.values,
      },
    });

    if (error) {
      console.log(error);
    }
  };

  const handleBlur = e => {
    state.values[e.target.name].push(e.target.value);
    state.alerts[e.target.name] =
      e.target.value.length === 0
        ? '* The phone number cannot be empty'
        : (state.alerts[e.target.name] = !/^\d+$/.test(e.target.value)
            ? '* Phone numbers can only include digits'
            : null);
  };

  const handleSubmit = async () => {
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
          props.isContactAddedSetter(true);
          addContact();
        })
        .catch(err => console.error(err));
    } else {
      console.log('Wrong input data provided');
    }
    props.closeModal();
  };

  return (
    <Form>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>First name</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="firstName"
              type="text"
              placeholder="First name"
            />
          </Form.Group>
          <p className="input-alert">
            {state.alerts.firstName && state.alerts.firstName}
          </p>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="lastName"
              type="text"
              placeholder="Last name"
            />
          </Form.Group>
          <p className="input-alert">
            {state.alerts.lastName && state.alerts.lastName}
          </p>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nickname</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="nickName"
              type="text"
              placeholder="Nickname"
            />
          </Form.Group>
          <p className="input-alert">
            {state.alerts.nickName && state.alerts.nickName}
          </p>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Phone numbers</Form.Label>
            <Form.Control
              onBlur={handleBlur}
              name="phoneNumbers"
              type="text"
              placeholder="Phone number"
            />
            {linkClick !== 0 &&
              Array.from({ length: linkClick }).map((val, index) => (
                <Form.Control
                  onBlur={handleBlur}
                  className="phone-number"
                  name="phoneNumbers"
                  key={index}
                  type="text"
                  placeholder="Phone number"
                />
              ))}
            <a
              className="add-more-phones"
              onClick={() => setLinkClick(prevVal => prevVal + 1)}
            >
              + Add more
            </a>
          </Form.Group>
          <p className="input-alert">
            {state.alerts.phoneNumbers && state.alerts.phoneNumbers}
          </p>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="address"
              type="text"
              placeholder="Address"
            />
          </Form.Group>
          <p className="input-alert">
            {state.alerts.address && state.alerts.address}
          </p>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Upload photo</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="photo"
              type="file"
              accept="image/png, image/jpeg"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="add-contact-submit-button">
        <Button onClick={handleSubmit} variant="primary">
          Submit
        </Button>
      </Row>
    </Form>
  );
}
