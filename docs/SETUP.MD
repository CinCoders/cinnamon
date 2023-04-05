### 🚀 Starting the project

To get started, start by accessing the repository:

```bash
# Clone the repository
$ git clone INSERIR LINK DO REPO

# Access the project folder
$ cd src
```

Creating new components:

```bash
# Access the components folder
$ cd components

# Create a folder for the new component
$ mkdir <component_name>

# Create a index.tsx file for the component
$ touch index.tsx

# If needed, create a styles.ts file for the styles
$ touch styles.ts

# And if an image is needed, add it to the assets folder, and import and use the image in the index.tsx file that way:
import <image_name> from '../../assets/<image_name>.<png|svg|...>';
 <img src={<image_name>} alt="<image_name>"/>
```

Adding the new components to storybook:

- Storybook serves to show how the components are appearing on the screen

```bash
# Access the stories folder
$ cd ..
$ cd stories

# Create a <component_name>.stories.tsx file for the component
$ touch <component_name>.stories.tsx

# In the storybook file, use:

# 1) Import the component
import <component_name> from "../components/<component_name>";

# 2) Import storiesOf
import { storiesOf } from "@storybook/react";

# 3) Import React
import React from "react";

# 4) Make an instance of a story:
const stories = storiesOf(<Component Test>, module);

# 5) Add a story:
stories.add(<'Component Test'>, () => {
  return(
    <>
       < <component_name> />
    </>
  );
});

# Run the storybook
npm run storybook

# Access
"http://localhost:6006/"
```

### 🚀 Testing the components using yarn link

After creating the component, you can test it:

```bash
# Start the rollup
$ yarn run start

# Generate a link to simulate a npm lib
$ yarn link

# Then, go to a react-app and install the lib
$ yarn link <the name of the link after running yarn link>

# And last, import the component
import <componentName> from <the name of the link after running yarn link>
```

### Components

Import components individually where you want to use them

```jsx
import React from 'react';
import { Component } from '@cincoders/cinnamon';

export const App = () => {
  return <Component />;
};
```
