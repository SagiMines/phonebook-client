import { Button, Modal } from 'react-bootstrap';
import ContactsForm from './ContactsForm';

export default function ContactModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.forPage === 'add' ? 'Add New Contact' : 'Edit Contact'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ContactsForm
          editedContactId={
            props.forPage === 'edit' ? props.editedContactId : undefined
          }
          forPage={props.forPage}
          closeModal={props.onHide}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
