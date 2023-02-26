import { gql } from '@apollo/client';

export const CREATE_CONTACT = gql`
  mutation createContact($contact: ContactDto!) {
    createContact(contact: $contact) {
      id
      firstName
      lastName
    }
  }
`;
