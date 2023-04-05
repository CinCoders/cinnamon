import { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { ImageInput } from '../lib-components/ImageInput';

import './storiesGlobals.css';

const stories = storiesOf('ImageInput', module);

stories.add('ImageInput', () => {
  const [file, setFile] = useState<File>(new File([''], 'filename'));

  console.log(file);

  return (
    <div style={{ width: '10rem', padding: '1rem' }}>
      <ImageInput setFile={setFile} id='image-input-test' />
    </div>
  );
});
