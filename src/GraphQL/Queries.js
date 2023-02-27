import { gql } from '@apollo/client';

export const GET_FIVE_DESC = gql`
  query getFiveDesc($offset: Float!) {
    getFiveDesc(offset: $offset) {
      id
      firstName
      lastName
      nickName
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
