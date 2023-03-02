import { gql } from '@apollo/client';

// contacts
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

// photo-filter

export const CREATE_PHOTO_FILTER = gql`
  mutation createPhotoFilter($photoFilter: PhotoFilterDto!) {
    createPhotoFilter(photoFilter: $photoFilter) {
      id
      type
      amount
      contactId
    }
  }
`;

export const UPDATE_PHOTO_FILTER = gql`
  mutation updatePhotoFilter(
    $photoFilter: PhotoFilterDto!
    $contactId: Float!
  ) {
    updatePhotoFilter(photoFilter: $photoFilter, contactId: $contactId) {
      id
      type
      amount
      contactId
    }
  }
`;
