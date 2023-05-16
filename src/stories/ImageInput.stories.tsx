import { useState } from 'react';
import { ImageInput } from '../lib-components/ImageInput';
import './storiesGlobals.css';

export default {
  title: 'Components/ImageInput',
  component: ImageInput
};

export const Default = () => {
  const [file, setFile] = useState<File>(new File([''], 'filename'));

  console.log(file);

  return (
    <div style={{ width: '10rem', padding: '1rem' }}>
      <ImageInput setFile={setFile} id='image-input-test' />
    </div>
  );
};
