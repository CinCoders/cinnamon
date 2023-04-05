import styled from 'styled-components';

export const DropdownWrapper = styled.div`
  position: absolute;
  top: 40px;
  width: 100%;
`;

export const SearchDropdownContainer = styled.div`
  background: $background-white;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  row-gap: 0.75rem;
  padding: 1.5rem;
  border: $border-grey 1px solid;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
`;

export const Field = styled.fieldset`
  border: none;
  display: grid;
  grid-template-columns: 15% 85%;
  height: 2rem;
  justify-content: end;
`;

export const DropdownLabel = styled.label`
  font-size: 1.2rem;
  height: 1.5rem;
  color: $text-grey;
`;

export const DropdownInput = styled.input`
  font-size: 1.2rem;
  height: 1.5rem;
  border: none;
  color: $text-dark-grey;
  border-bottom: $border-grey 1px solid;
  outline: none;

  &:focus {
    border-bottom-color: #ie90ff;
  }
`;

export const DropdownButton = styled.button`
  width: 25%;
  max-width: 8rem;
  height: 100%;
  justify-self: end;
  align-self: center;
  border: none;
  background: $button-green;
  color: $text-white;
  font-size: 1.5rem;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);
  transition: 0.3s;

  &:hover {
    background: $button-dark-green;
  }
`;
