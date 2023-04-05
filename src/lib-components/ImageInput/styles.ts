import styled from 'styled-components';

export const StyledImage = styled.img`
  height: 100%;
  width: 100%;
  border-radius: 15px;
  align-self: center;
`;

export const StyledFieldset = styled.fieldset`
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;

  position: relative;
  border: none;

  width: 100%;
  aspect-ratio: 3/4;

  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
  background-color: #ffffff;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledLabel = styled.label`
  background-color: rgba(0, 0, 0, 0.25);
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const StyledSpan = styled.span`
  color: #ffffff;
  font-size: 1.5rem;
  text-align: center;
`;
