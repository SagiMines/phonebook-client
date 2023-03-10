import { gql } from '@apollo/client';

// contacts
export const GET_FIVE_DESC = gql`
  query getFiveDesc($offset: Float!) {
    getFiveDesc(offset: $offset) {
      id
      firstName
      lastName
      nickName
      phoneNumbers
      address
      photo
    }
  }
`;

export const GET_ALL_CONTACTS = gql`
  query {
    getAll {
      id
    }
  }
`;

export const GET_ONE_CONTACT = gql`
  query getOne($id: Float!) {
    getOne(id: $id) {
      id
      firstName
      lastName
      nickName
      phoneNumbers
      address
      photo
    }
  }
`;

export const GET_SEARCH_VALUES = gql`
  query getSearchValues($firstName: String!) {
    getSearchValues(firstName: $firstName) {
      id
      firstName
      lastName
      nickName
      phoneNumbers
      address
      photo
    }
  }
`;

// photo-filter

export const GET_BY_CONTACT_ID = gql`
  query getByContactId($contactId: Float!) {
    getByContactId(contactId: $contactId) {
      id
      type
      amount
      contactId
    }
  }
`;
