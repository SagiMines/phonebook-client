import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
import { useEffect, useContext } from 'react';
import { ContactsContext } from './ContactsContext';
import './styles/SearchBar.css';
export default function SearchBar({ setIsSearchStarted, lazyQueryContent }) {
  // Main context
  const { fetchMore, setContacts } = useContext(ContactsContext);

  const handleChange = async e => {
    setIsSearchStarted(true);
    if (e.target.value.length >= 2) {
      lazyQueryContent.getSearchValues({
        variables: { firstName: e.target.value },
      });
    } else {
      setIsSearchStarted(false);
      const check = await fetchMore({
        variables: { offset: 0 },
      });
      setContacts([...check.data.getFiveDesc]);
    }
  };

  useEffect(() => {
    if (lazyQueryContent.searchData) {
      setContacts([...lazyQueryContent.searchData.getSearchValues]);
    }
  }, [lazyQueryContent.searchData]);
  return (
    <MDBInputGroup className="search">
      <MDBInput label="Search" onChange={handleChange} />
      <MDBBtn rippleColor="dark">
        <MDBIcon icon="search" />
      </MDBBtn>
    </MDBInputGroup>
  );
}
