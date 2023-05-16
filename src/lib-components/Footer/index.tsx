import {
  LargeDiv,
  Columns,
  LeftColumn,
  MiddleColumn,
  RightColumn,
  LeftColumnText,
  MiddleColumnText,
  RightColumnText,
  SmallDiv,
  CopyrightText,
  StyledFooter,
  ParentFooter,
  SignatureText,
} from './styles';

export interface FooterProps {
  title?: string;
  telephone?: string;
  telephoneComplement?: string;
  email?: string;
  link?: string;
  textLink?: string;
  description?: string;
  copyrightText?: string;
  signatureText?: string;
  signatureLink?: string;
}

export const Footer = ({
  title,
  telephone,
  telephoneComplement,
  email,
  link,
  textLink,
  description,
  copyrightText,
  signatureText,
  signatureLink,
}: FooterProps) => {
  return (
    <ParentFooter>
      <StyledFooter>
        <LargeDiv>
          <Columns>
            <LeftColumn>
              <LeftColumnText>{title && `${title}`}</LeftColumnText>
            </LeftColumn>
            <MiddleColumn className='middle'>
              <MiddleColumnText>
                <a
                  href={`tel:${telephone?.replace(/\(|\)|\s|-+?/g, '')}`}
                  style={{ color: 'white', zIndex: 3 }}
                >
                  {telephone && `${telephone} `}
                </a>
                {telephoneComplement && `${telephoneComplement}`}
                <br></br>
                {email && (
                  <a
                    href={`mailto:${email}`}
                    style={{ color: 'white', zIndex: 3 }}
                  >
                    {`${email}`}
                  </a>
                )}
                <br></br>
                {link && (
                  <a href={`${link}`} style={{ color: 'white', zIndex: 3 }}>
                    {`${textLink}`}
                  </a>
                )}
              </MiddleColumnText>
            </MiddleColumn>
            {description && (
              <RightColumn>
                <RightColumnText>{`${description}`}</RightColumnText>
              </RightColumn>
            )}
          </Columns>
        </LargeDiv>
        <SmallDiv>
          {copyrightText && (
            <CopyrightText>
              ©{new Date().getFullYear()} {`${copyrightText}`}
            </CopyrightText>
          )}
          {signatureText && (
            <SignatureText> <a href={`${signatureLink}`} style={{ color: 'white', zIndex: 3 }}> {`${signatureText}`}</a></SignatureText>
          )}
        </SmallDiv>
      </StyledFooter>
    </ParentFooter>
  );
};
