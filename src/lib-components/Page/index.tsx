import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { MainDiv } from './styles';
import { Navbar, NavbarProps } from '../Navbar/index';
import { Footer, FooterProps } from '../Footer/index';
import { NavbarContextValue } from './useNavbar';
import { ToastContainer } from '../../components/Toast';

export interface PageProps {
  navbar?: NavbarProps;
  footer?: FooterProps;
  children: JSX.Element | JSX.Element[];
  centralized?: boolean;
  column?: boolean;
  haveToast?: boolean;
  components?: {
    navbar?: JSX.Element;
    footer?: JSX.Element;
    toastContainer?: JSX.Element;
  };
  createNavbarContext: boolean;
}

interface Dimensions {
  navHeight: number;
  footHeight: number;
}

export const NavbarContext = createContext<NavbarContextValue | undefined>(
  undefined
);

export function Page({
  navbar,
  footer,
  children,
  centralized = false,
  column = false,
  haveToast = false,
  components,
  createNavbarContext = true
}: PageProps) {
  const navbarRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const [childrenHeight, setChildrenHeight] = useState<number>(0);

  const [dimensions, setDimensions] = useState<Dimensions>({
    navHeight: 0,
    footHeight: 0
  });

  const firstRender = useRef<boolean>(true);

  const getElementSize = (entries: ResizeObserverEntry[]) => {
    entries.forEach((entry) => {
      entry?.borderBoxSize
        ? setChildrenHeight(entry.borderBoxSize[0].blockSize)
        : 0;
    });
  };

  useEffect(() => {
    const element = childrenRef?.current;
    const observer = new ResizeObserver(getElementSize);
    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setDimensions({
      navHeight: navbarRef.current ? navbarRef.current.offsetHeight : 0,
      footHeight: footerRef.current ? footerRef.current.offsetHeight : 0
    });
  }, [navbarRef.current?.offsetHeight, footerRef.current?.offsetHeight]);
  let diff = navbar ? dimensions.navHeight : 0;
  diff += footer ? dimensions.footHeight : 0;

  const [navbarProps, setNavbarProps] = useState<NavbarProps>({
    ...navbar
  });

  useEffect(() => {
    if (createNavbarContext && !firstRender.current) {
      setNavbarProps({ ...navbar });
    } else {
      firstRender.current = false;
    }
  }, [navbar]);

  const navbarContextClass = useMemo(() => {
    if (createNavbarContext) {
      return new NavbarContextValue({ ...navbarProps }, setNavbarProps);
    }
    return undefined;
  }, [createNavbarContext, navbarProps, setNavbarProps]);

  useEffect(() => {
    firstRender.current = true;
  }, [navbarContextClass]);

  return (
    <NavbarContext.Provider value={navbarContextClass}>
      <div ref={navbarRef} style={{ display: 'inline' }}>
        {components?.navbar ? components.navbar : <Navbar {...navbar} />}
      </div>
      <MainDiv
        style={{
          minHeight: `calc(100vh - ${diff}px)`,
          height:
            childrenHeight > window.innerHeight - diff
              ? 'fit-content'
              : `calc(100vh - ${diff}px)`,
          alignItems: centralized ? 'center' : 'normal',
          justifyContent: centralized ? 'center' : 'normal',
          flexDirection: column ? 'column' : 'row'
        }}
      >
        {haveToast &&
          (components?.toastContainer ? (
            components.toastContainer
          ) : (
            <ToastContainer
              toastProps={{
                position: 'top-right'
              }}
              topInitialPosition={dimensions.navHeight}
            />
          ))}
        <div ref={childrenRef}>{children}</div>
      </MainDiv>
      <div ref={footerRef} style={{ display: 'inline' }}>
        {components?.footer ? components.footer : <Footer {...footer} />}
      </div>
    </NavbarContext.Provider>
  );
}
