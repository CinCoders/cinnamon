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
  SignatureText
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
  largeFooter?: boolean;
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
  largeFooter = true
}: FooterProps) => {
  return (
    <ParentFooter>
      <StyledFooter>
        {largeFooter && (
          <LargeDiv>
            <Columns>
              <LeftColumn>
                <LeftColumnText>{title && `${title}`}</LeftColumnText>
              </LeftColumn>
              <MiddleColumn className='middle'>
                <MiddleColumnText>
                  <a
                    href={`tel:${telephone?.replace(/\(|\)|\s|-+/g, '')}`}
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
        )}
        <SmallDiv>
          {copyrightText && (
            <CopyrightText>
              ©{new Date().getFullYear()} {`${copyrightText}`}
            </CopyrightText>
          )}
          {signatureText !== undefined ? (
            <SignatureText>
              {signatureLink ? (
                <a
                  href={`${signatureLink}`}
                  style={{ color: 'white', zIndex: 3 }}
                >{`${signatureText}`}</a>
              ) : (
                <a> {`${signatureText}`}</a>
              )}
            </SignatureText>
          ) : (
            <SignatureText>
              <a
                href='https://www.npmjs.com/package/@cincoders/cinnamon'
                style={{ color: 'white', zIndex: 3 }}
              >
                Made with ❤️
              </a>
              <span> by </span>
              <a
                href='https://cincoders.cin.ufpe.br/'
                style={{ color: 'white', zIndex: 3 }}
              >
                CInCoders
              </a>
            </SignatureText>
          )}
        </SmallDiv>
      </StyledFooter>
    </ParentFooter>
  );
};
