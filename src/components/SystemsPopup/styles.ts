import styled from 'styled-components';

export const SystemsPopupContainer = styled.div`
  background: #F8F8F8;
  border-radius: 12px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  width: 18rem;
  min-height: max-content;
`;

export const SystemsPopupContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  padding: 0.25rem;
  min-height: max-content;
`;

export const SystemItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  height: 6rem;

  padding: 0.5rem;

  border: none;
  border-radius: 5px;
  background: transparent;

  transition: 0.3s;

  position: relative;

  text-decoration: none;

  &:hover {
    background: #E6E6E6;
  }
`;

export const SystemIcon = styled.img`
  width: 2.5rem;
  height: 2.5rem;

  margin-bottom: 0.5rem;
`;

export const SystemTitle = styled.h3`
  color: #000000;
  font-size: 62.25%;

  text-align: center;

  margin: 0;
`;