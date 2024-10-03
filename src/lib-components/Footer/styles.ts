import styled from "styled-components";

export const ParentFooter = styled.div`
  display: inline;
  z-index: -10;
`;

export const StyledFooter = styled.div`
  position: sticky;
  min-width: max-content;
  width: 100%;
  bottom: 0;
`;

export const LargeDiv = styled.div`
  height: 110px;
  width: 100%;
  color: white;
  background-color: #424242;

  @media (max-width: 801px) and (min-width: 502px) {
    height: 15vh;
  }

  @media (max-width: 501px) {
    height: 30vh;
  }
`;

export const Columns = styled.div`
  display: flex;
  justify-content: space-around;
  height: 100%;
  align-items: center;

  @media (max-width: 801px) and (min-width: 502px) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  @media (max-width: 501px) {
    flex-direction: column;
    flex-wrap: wrap;
  }
`;

export const LeftColumn = styled.div`
  width: 35.5%;

  @media (max-width: 801px) {
    width: 100%;
  }
`;

export const MiddleColumn = styled.div`
  width: 29%;

  @media (max-width: 801px) and (min-width: 502px) {
    flex: 0 0 50%;
    padding-left: 10%;
    width: 100%;
  }

  @media (max-width: 501px) {
    width: 100%;
  }
`;

export const RightColumn = styled.div`
  width: 35.5%;
  white-space: pre-line;

  @media (max-width: 801px) and (min-width: 502px) {
    flex: 0 0 50%;
    padding-right: 10%;
    width: 100%;
  }

  @media (max-width: 501px) {
    width: 100%;
  }
`;

export const LeftColumnText = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 1rem;
  font-weight: bold;
  white-space: pre-line;

  @media (max-width: 1001px) and (min-width: 802px) {
    justify-content: center;
  }

  @media (max-width: 801px) {
    width: 100%;
    justify-content: center;
  }
`;

export const MiddleColumnText = styled.div`
  text-align: center;
  font-size: 0.8rem;
  white-space: pre-line;

  @media (max-width: 801px) {
    width: 100%;
    justify-content: center;
  }
`;

export const RightColumnText = styled.div`
  display: flex;
  justify-content: flex-start;
  text-align: center;
  font-size: 0.8rem;

  @media (max-width: 1001px) and (min-width: 802px) {
    justify-content: center;
  }

  @media (max-width: 801px) {
    width: 100%;
    justify-content: center;
  }
  pre {
    display: inherit;
    font-family: inherit;
    margin: inherit;
  }
`;

export const SmallDiv = styled.div`
  height: 40px;
  width: 100hw;
  color: white;
  font-size: 11px;
  line-height: 40px;
  background-color: #616161;
  display: flex;
  justify-content: space-between;
  padding-inline: 30px;
`;

export const CopyrightText = styled.div`
  display: inline-block;
  text-align: left;
`;

export const SignatureText = styled.div`
  display: inline-block;
  text-align: right;

  @media (max-width: 601px) {
    display: none;
  }
`;
