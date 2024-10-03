import { useEffect, useState } from 'react';

import {
  DropdownWrapper,
  SearchDropdownContainer,
  Field,
  DropdownLabel,
  DropdownInput,
  DropdownButton
} from './styles';

interface SearchDropdownProps {
  inputLabelList?: string[];
  searchFunction?: (searchString: string) => void;
}

export const SearchDropdown = ({
  inputLabelList = [],
  searchFunction = () => {}
}: SearchDropdownProps) => {
  const [inputList, setInputList] = useState<string[]>([]);

  useEffect(() => {
    setInputList(new Array(inputLabelList.length));
  }, []);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    setInputList(
      inputList.map((value, index_map) => {
        if (index === index_map) {
          return e.target.value;
        } else {
          return value;
        }
      })
    );
  }

  function handleDropdownSearch() {
    let searchString = '';

    for (let i = 0; i < inputLabelList.length; i++) {
      if (inputList[i] !== undefined && inputList[i] !== '') {
        searchString += `${inputLabelList[i].toLowerCase()}:(${inputList[i]})`;
        inputList[i] = '';
        if (i < inputLabelList.length - 1) {
          searchString += ' ';
        }
      }
    }

    searchFunction(searchString);
  }

  return (
    <DropdownWrapper>
      <SearchDropdownContainer>
        {inputLabelList.map((label, index) => {
          return (
            <Field key={`field_${label + index}`}>
              <DropdownLabel>{label}:</DropdownLabel>
              <DropdownInput
                type='text'
                value={inputList[index]}
                onChange={(e) => handleInputChange(e, index)}
              />
            </Field>
          );
        })}
        <DropdownButton type='button' onClick={handleDropdownSearch}>
          Buscar
        </DropdownButton>
      </SearchDropdownContainer>
    </DropdownWrapper>
  );
};
