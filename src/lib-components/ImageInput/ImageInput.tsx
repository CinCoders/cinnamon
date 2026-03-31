"use client";

import * as React from "react";

import blankAvatar from "@/assets/default-profile-picture.jpg";

export interface ImageInputProps {
  required?: boolean;
  disabled?: boolean;
  id: string;
  file?: File;
  setFile: React.Dispatch<React.SetStateAction<File>>;
}

export function ImageInput({
  required = false,
  disabled = false,
  id,
  file,
  setFile,
}: ImageInputProps) {
  const [imageSource, setImageSource] = React.useState<string | ArrayBuffer | null>(null);
  const [showImageInput, setShowImageInput] = React.useState(false);

  React.useEffect(() => {
    if (!file) {
      setImageSource(null);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) setImageSource(reader.result);
    };
  }, [file]);

  function getImage(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;

    setFile(nextFile);
    setShowImageInput(false);
  }

  return (
    <div className="w-full">
      <fieldset
        className="relative m-0 flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-[15px] border-0 bg-white p-0 shadow-[0_4px_6px_rgba(0,0,0,0.25)]"
        onMouseEnter={() => setShowImageInput(true)}
        onMouseLeave={() => setShowImageInput(false)}
      >
        <img
          src={typeof imageSource === "string" ? imageSource : blankAvatar}
          alt="User Picture"
          className="h-full w-full self-center rounded-[15px] object-cover"
        />

        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          required={required}
          disabled={disabled}
          className="hidden"
          id={id}
          onChange={getImage}
        />

        {showImageInput && !disabled ? (
          <label
            htmlFor={id}
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-[15px] bg-black/25 p-4"
          >
            <span className="text-center text-2xl text-white">
              Escolha uma imagem
            </span>
          </label>
        ) : null}
      </fieldset>
    </div>
  );
}
