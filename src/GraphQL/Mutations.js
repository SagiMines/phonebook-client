import { gql } from '@apollo/client';

export const CREATE_CONTACT = gql`
  mutation createContact($contact: ContactDto!) {
    createContact(contact: $contact) {
      id
    }
  }
`;

export const UPDATE_CONTACT = gql`
  mutation updateContact($contact: ContactDto!, $id: Float!) {
    updateContact(contact: $contact, id: $id) {
      id
    }
  }
`;

export const REMOVE_CONTACT = gql`
  mutation removeContact($id: Float!) {
    removeContact(id: $id) {
      id
    }
  }
`;
