import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
import './styles/SearchBar.css';
export default function SearchBar() {
  return (
    <MDBInputGroup className="search">
      <MDBInput label="Search" />
      <MDBBtn rippleColor="dark">
        <MDBIcon icon="search" />
      </MDBBtn>
    </MDBInputGroup>
  );
}
