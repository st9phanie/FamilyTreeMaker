import React, { useRef, useState } from "react";

type Props = {
    setPhoto: (value:File) => void;
}

const ImagePicker = ({setPhoto}:Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setPhoto(file)
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="size-28 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-600 transition bg-gray-200/10"
        onClick={handleClick}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">Upload Photo</span>
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
