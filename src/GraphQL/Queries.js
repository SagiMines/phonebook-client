import { gql } from '@apollo/client';

export const GET_ALL_CONTACTS = gql`
  query getAllContacts($offset: Float!) {
    getAllContacts(offset: $offset) {
      id
      firstName
      lastName
      nickName
    }
  }
`;
