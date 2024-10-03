import styled, { css } from 'styled-components';
const Hamb = styled.span`
  width: 100%;
  height: 1px;

  display: inline-block;

  background: #db1e2f;

  position: absolute;

  transition: all 0.25s ease-in-out;
`;

export const HambTop = styled(Hamb)`
  top: 0;
  left: 0;
`;

export const HambMiddle = styled(Hamb)`
  bottom: 50%;
  top: 50%;
  left: 0;
`;

export const HambBottom = styled(Hamb)`
  left: 0;
  bottom: 0;
`;

export const Hamburger = styled.button<{ isOpen: boolean }>`
  border: none;
  width: 30px;
  height: 16px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: white;

  position: relative;
  top: 50%;
  &:hover {
    ${(props) => {
      if (!props.isOpen) {
        return css`
          ${HambBottom} {
            bottom: -20%;
          }
          ${HambTop} {
            top: -20%;
          }
        `;
      }
    }}
  }
  ${(props) => {
    if (props.isOpen) {
      return css`
        ${HambBottom} {
          bottom: 50%;
          transform: rotate(45deg);
        }
        ${HambMiddle} {
          display: none;
        }
        ${HambTop} {
          top: 50%;
          transform: rotate(-45deg);
        }
      `;
    }
  }}
`;
