"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import blankAvatar from "@/assets/default-profile-picture.jpg";

export interface ImageInputProps {
  required?: boolean;
  disabled?: boolean;
  id: string;
  file?: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png"]);

export function ImageInput({
  required = false,
  disabled = false,
  id,
  file,
  setFile,
}: ImageInputProps) {
  const [imageSource, setImageSource] = React.useState<string | null>(null);
  const [showImageInput, setShowImageInput] = React.useState(false);

  React.useEffect(() => {
    if (!file) {
      setImageSource(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImageSource(reader.result);
    };
    reader.onerror = () => {
      setImageSource(null);
    };
    reader.readAsDataURL(file);
  }, [file]);

  function getImage(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    if (!ALLOWED_TYPES.has(nextFile.type)) return;
    setFile(nextFile);
    setShowImageInput(false);
  }

  function show() {
    if (!disabled) setShowImageInput(true);
  }

  function hide() {
    setShowImageInput(false);
  }

  return (
    <div className="w-full">
      <fieldset
        className="relative m-0 flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-[15px] border-0 bg-white p-0 shadow-[0_4px_6px_rgba(0,0,0,0.25)]"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        <img
          src={imageSource ?? blankAvatar}
          alt="User Picture"
          className="h-full w-full self-center rounded-[15px] object-cover"
        />

        {/* sr-only keeps the input in the DOM and tab order without visual presence */}
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          required={required}
          disabled={disabled}
          className="sr-only"
          id={id}
          onChange={getImage}
        />

        <label
          htmlFor={id}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "absolute inset-0 flex cursor-pointer items-center justify-center rounded-[15px] bg-black/25 p-4",
            "transition-opacity",
            showImageInput && !disabled
              ? "opacity-100"
              : "opacity-0 pointer-events-none",
          )}
          onFocus={show}
          onBlur={hide}
        >
          <span className="text-center text-2xl text-white">
            Escolha uma imagem
          </span>
        </label>
      </fieldset>
    </div>
  );
}
