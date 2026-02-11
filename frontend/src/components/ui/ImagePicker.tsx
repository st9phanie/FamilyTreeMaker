import { fileToBase64 } from "@/lib/helperfunctions";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  currentPhoto?: string | null;
  setPhoto: (value: any) => void;
}

const ImagePicker = ({ currentPhoto, setPhoto }: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);

  useEffect(() => {
    const hasLocalFile = fileInputRef.current?.files && fileInputRef.current.files.length > 0;

    if (!hasLocalFile) {
      setPreview(currentPhoto || null);
    }
  }, [currentPhoto]);


  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);

    setPreview(base64);
    setPhoto(file);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="size-24 rounded-full border border-sidebar-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition bg-secondary"
        onClick={handleClick}
      >
        {preview ? (
          <img
            loading="lazy"
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-text-primary-foreground text-xs text-center px-1">Upload <br /> photo</span>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImagePicker;
