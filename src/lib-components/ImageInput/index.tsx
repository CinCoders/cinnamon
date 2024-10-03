import { useEffect, useState } from 'react';

import { StyledFieldset, StyledImage, StyledLabel, StyledSpan } from './styles';

import blankAvatar from '../../assets/default-profile-picture.jpg';

export interface ImageInputProps {
  required?: boolean;
  disabled?: boolean;
  id: string;
  file?: File;
  setFile: React.Dispatch<React.SetStateAction<File>>;
}

export const ImageInput = ({
  required = false,
  disabled = false,
  id,
  file,
  setFile
}: ImageInputProps) => {
  const [imageSource, setImageSource] = useState<null | string | ArrayBuffer>(
    null
  );
  const [showImageInput, setShowImageInput] = useState<boolean>(false);

  useEffect(() => {
    if (file) {
      getImageSource(file);
    }
  }, []);

  function getImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0];
      setFile(file);
      getImageSource(file);
      setShowImageInput(false);
    }
  }

  function getImageSource(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        setImageSource(reader.result);
      }
    };
  }

  return (
    <div>
      <StyledFieldset
        onMouseEnter={() => setShowImageInput(true)}
        onMouseLeave={() => setShowImageInput(false)}
      >
        <StyledImage
          src={imageSource ? imageSource : blankAvatar}
          alt='User Picture'
        />
        <input
          type='file'
          accept='.jpg, .jpeg, .png'
          required={required}
          disabled={disabled}
          style={{ display: 'none' }}
          id={id}
          onChange={getImage}
        />
        {showImageInput && (
          <StyledLabel htmlFor={id}>
            <StyledSpan>Escolha uma imagem</StyledSpan>
          </StyledLabel>
        )}
      </StyledFieldset>
    </div>
  );
};
