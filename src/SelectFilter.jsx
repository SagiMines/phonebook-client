import Form from 'react-bootstrap/Form';

export default function SelectFilter({ photoFilter }) {
  // Updates the state of the chosen contact's photo filter
  const handleSelectedFilter = e => {
    photoFilter.photoFilter.type = e.target.value;
    photoFilter.setPhotoFilter({ ...photoFilter.photoFilter });
  };

  return (
    <Form.Select
      aria-label="Default select example"
      onChange={handleSelectedFilter}
    >
      <option defaultValue hidden>
        Filter Type
      </option>
      <option value="grayscale">Gray scale</option>
      <option value="blur">Blur</option>
      <option value="saturate">Saturation</option>
    </Form.Select>
  );
}
