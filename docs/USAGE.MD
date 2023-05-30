### Navbar

Navbar component. Uses a side menu for navigation that can be toggled with a hamburger menu.

#### Prop List

| Name                         | Type                           | Required | Default Value                                            | Description                                                                                                                                                                                                              |
| ---------------------------- | ------------------------------ | -------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **haveSearchBar**            | Boolean                        | No       | false                                                    | Control the search bar rendering                                                                                                                                                                                         |
| **hiddenUser**               | Boolean                        | No       | true                                                     | Hide the user                                                                                                                                                                                                            |
| **title**                    | String                         | No       | none                                                     | Set the title page in navbar                                                                                                                                                                                             |
| **h1**                       | Boolean                        | No       | false                                                    | Set h1 style font to title page in navbar                                                                                                                                                                                |
| **searchDropdownLabelsList** | Array of strings               | No       | []                                                       | List of fields that can be searched using the search bar drop down                                                                                                                                                       |
| **searchFunction**           | Function                       | No       | () => {}                                                 | Search bar function. Receive the search string as a parameter. If using the search drop down feature, must accept search strings in format: "field1:(value) field2:(value)"                                              |
| **logoutFunction**           | Function                       | No       | () => {}                                                 | Function that is triggered when user click on the logout button in the user popup menu                                                                                                                                   |
| **user**                     | User (Object)                  | No       | name: "User Display Name", email: "username@example.com" | Populates the user popup menu with information about the current user.                                                                                                                                                   |
| **sideMenuLinks**            | Array of SideMenuLink (Object) | No       | title: "Home", href: "/"                                 | Populates the side menu with links of your application. If project uses vue-router then uses router-link instead of default html anchor tag. If there is an external link, you must add "external" props to your object. |
| **customSideMenu**           | Boolean                        | No       | false                                                    | If you want to use a custom side menu instead, you need enable this prop and pass the components using Vue slots                                                                                                         |
| **isLandingPage**            | Boolean                        | No       | false                                                    | Change layout of navbar to one containing only Logo and the user icon button                                                                                                                                             |
| **systemsList**              | Array of System (Object)       | No       | []                                                       | Populates the systems menu popup with links to related external applications                                                                                                                                             |
| **currentSystemIconUrl**     | String                         | No       | none                                                     | Icon of the current application                                                                                                                                                                                          |
| **children**                 | JSX.Element                    | No       | none                                                     | Custom side menu content                                                                                                                                                                                                 |

### Interface of props

```typescript
interface User {
  name: string;
  email: string;
  profilePictureUrl?: string;
  positions?: Position[];
}

interface Position {
  id: number;
  name: string;
  roles?: Role[];
}

interface Role {
  id: number;
  name: string;
  description: string;
}

interface link {
  title: string;
  href?: string;
  external?: boolean;
}

interface SideMenuLink extends link {
  iconUrl?: string;
  children?: link[];
}

interface System {
  title: string;
  iconUrl: string;
  description: string;
  href: string;
}
```

### Footer

Footer component containing Helpdesk's information.

#### Props List

| Name                    | Type   | Required | Default Value | Description                                                   |
| ----------------------- | ------ | -------- | ------------- | ------------------------------------------------------------- |
| **title**               | String | No       | none          | Set the footer title                                          |
| **telephone**           | String | No       | none          | Set the footer telephone info                                 |
| **telephoneComplement** | String | No       | none          | Set the footer telephone complement                           |
| **email**               | String | No       | none          | Set the footer email                                          |
| **textLink**            | String | No       | none          | Set the footer text link                                      |
| **link**                | String | No       | none          | Set the link that will be redirected after click in text link |
| **description**         | String | No       | none          | Set the footer description                                    |
| **copyrightText**       | String | No       | none          | Set the footer copyright text                                 |

### Interface of props

```typescript
interface FooterProps {
  title?: string;
  telephone?: string;
  telephoneComplement?: string;
  email?: string;
  textLink?: string;
  link?: string;
  description?: string;
  copyrightText?: string;
}
```

### Page

A base page component containing the Navbar and Footer.

#### Props List

| Name                    | Type        | Required | Default Value         | Description                                                                                           |
| ----------------------- | ----------- | -------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| **navbar**              | NavbarProps | No       | Navbar default props  | Props that will be passed to the Navbar component                                                     |
| **footer**              | FooterProps | No       | Footer default values | Props that will be passed to the Footer component                                                     |
| **children**            | JSX.Element | Yes      | none                  | Contains the content that will be exhibited inside Page's main div                                    |
| **centralized**         | Boolean     | No       | false                 | Centralizes the content inside the page vertically and horizontally                                   |
| **haveToast**           | Boolean     | No       | none                  | Enable the usage of a custom toast from cinnamon package, inside the page component                   |
| **createNavbarContext** | Boolean     | Yes      | none                  | Enable the usage of custom hook useNavbar, to change navbar props dinamically                         |
| **components**          | Object      | No       | none                  | An object that accepts a custom navbar, footer or toastContainer to override these default components |

### Interface of props

```typescript
interface PageProps {
  navbar?: NavbarProps;
  footer?: FooterProps;
  children: JSX.Element | JSX.Element[];
  centralized?: boolean;
  haveToast?: boolean;
  components?: {
    navbar?: JSX.Element;
    footer?: JSX.Element;
    toastContainer?: JSX.Element;
  };
  createNavbarContext: boolean;
}
```

#### Custom Hook useNavbar

The custom hook useNavbar can change navbar props inside a page children component (or it's tree child). To use the custom hook, you need to import useNavbar from Cinnamon, and instatiate the navbar inside your functional component, just like this:

```typescript
const navbar = useNavbar();
```

Therefore, you can change some props dinamically using your navbar instance, i.e:

```typescript
if (true) {
  navbar.setTitle('Cinnamon Navbar New Title');
} else {
  navbar.setTitle('Cinnamon Navbar Title Changed');
}
```

Currently, we have four methods to change some navbar props. Here's a type description of each method:

```typescript
(method) navbar.setTitle(string): void
(method) navbar.setSideMenuLinks(SideMenuLink[]): void
(method) navbar.setHaveSearchBar(boolean): void
(method) navbar.setSearchFuncion((searchString: string) => void): void
```

Observations:

- You can only use the hook if your createNavbarContext prop in Page is true. Otherwise, you will receive a log error in your console that indicates that your navbar context wasn't created.
- You cannot use the hook if you're out of Page component scope, because you need to be below the Page component to receive the context from the provider.
- We recommend that if you don't pass a default value for your prop in Page the component declaration, set a default prop using the useNavbar inside an useEffect hook without dependency array, to avoid unnecessary re-renders.

### PageWithAuth

A base page component with authentication using keycloak.

#### Props List

| Name                    | Type        | Required | Default Value         | Description                                                                                           |
| ----------------------- | ----------- | -------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| **navbar**              | NavbarProps | No       | Navbar default props  | Props that will be passed to the Navbar component                                                     |
| **footer**              | FooterProps | No       | Footer default values | Props that will be passed to the Footer component                                                     |
| **children**            | JSX.Element | Yes      | none                  | Contains the content that will be exhibited inside Page's main div                                    |
| **centralized**         | Boolean     | No       | false                 | Centralizes the content inside the page vertically and horizontally                                   |
| **haveToast**           | Boolean     | No       | none                  | Enable the usage of a custom toast from cinnamon package, inside the page component                   |
| **createNavbarContext** | Boolean     | Yes      | none                  | Enable the usage of custom hook useNavbar, to change navbar props dinamically                         |
| **components**          | Object      | No       | none                  | An object that accepts a custom navbar, footer or toastContainer to override these default components |
| **auth**                | Object      | Yes      | none                  | An object that accepts a keycloak instance, initialized flag and roles to have access                 |

### Interface of props

```typescript
interface PageWithAuthProps extends PageProps {
  auth: {
    keycloak: Keycloak;
    initialized: boolean;
    permittedRoles: string[];
  };
}
```

### ImageInput

Image input component. User can select an image from their computer and the input auto updates itself with the selected image.

#### Props List

| Name         | Type                                       | Required | Default Value | Description                                        |
| ------------ | ------------------------------------------ | -------- | ------------- | -------------------------------------------------- |
| **id**       | String                                     | Yes      | none          | Id to bind the label to the image input            |
| **required** | Boolean                                    | No       | false         | Input need to be filled before submit              |
| **disabled** | Boolean                                    | No       | false         | Disables input                                     |
| **file**     | File                                       | No       | none          | Image file to be pre-loaded on the input Component |
| **setFile**  | React.Dispatch<React.SetStateAction<File>> | Yes      | none          | useState hook function to save the input imaged    |

### Interface of props

```typescript
interface ImageInputProps {
  required?: boolean;
  disabled?: boolean;
  id: string;
  file?: File;
  setFile: React.Dispatch<React.SetStateAction<File>>;
}
```

### ErrorScreen

Component that renders svg and informations based on http errors.

#### Props List

| Name          | Type | Required | Default Value | Description                           |
| ------------- | ---- | -------- | ------------- | ------------------------------------- |
| **errorType** | Enum | Yes      | none          | Type of the http error to be rendered |

#### Interfaces of props

```typescript
interface ErrorScreenProps {
  errorType: httpErrors;
}

enum httpErrors {
  NOTFOUND_404,
  COMINGSOON_501,
  INACTIVE_503,
  MAINTENANCE_503
}
```

### Dialog

Dialog Component. User can select a dialog among the four types: information, alert, decision and confirmation.

#### Props List

| Name               | Type                                          | Required | Default Value | Description                                                   |
| ------------------ | --------------------------------------------- | -------- | ------------- | ------------------------------------------------------------- |
| **type**           | String                                        | Yes      | none          | Type of dialog (information, alert, decision or confirmation) |
| **title**          | String                                        | Yes      | none          | Title of dialog                                               |
| **children**       | JSX.Element                                   | Yes      | none          | Dialog description                                            |
| **visibility**     | Boolean                                       | Yes      | false         | Visibility of dialog                                          |
| **setVisibility**  | React.Dispatch<React.SetStateAction<boolean>> | Yes      | none          | Method to change the state of Dialog's visibility             |
| **acceptLabel**    | String                                        | No       | Ok            | label of accept button on confirm dialog                      |
| **rejectLabel**    | String                                        | No       | Cancelar      | label of reject button on confirm dialog                      |
| **acceptFunction** | Function                                      | No       | () => void    | function that is invoke when accept button is pressed         |
| **rejectFunction** | Function                                      | No       | () => void    | function that is invoke when reject button is pressed         |

#### Interfaces of props

```typescript
interface DialogProps {
  type: 'information' | 'alert' | 'decision' | 'confirmation' | 'error';
  title: string;
  children: JSX.Element | string;
  visibility?: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptFunction?: () => void;
  rejectFunction?: () => void;
}
```

## IconRenderer

Icon renderer. Component to render icons through src and/or through icon components.

### Props List

| Name              | Type        | Required | Default Value | Description                   |
| ----------------- | ----------- | -------- | ------------- | ----------------------------- |
| **src**           | String      | Yes      | none          | Src for icon                  |
| **alt**           | String      | Yes      | none          | Title of Icon                 |
| **IconComponent** | JSX.Element | Yes      | none          | Component icon to be rendered |
