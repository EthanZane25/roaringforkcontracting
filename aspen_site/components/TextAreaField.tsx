import { ChangeEvent } from 'react';

interface TextAreaFieldProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
}

export default function TextAreaField({ value, onChange, placeholder, required }: TextAreaFieldProps) {
  return (
    <textarea
      className="block border mb-2 w-full p-2"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  );
}
