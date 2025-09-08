import { ChangeEvent } from 'react';

interface InputFieldProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}

export default function InputField({ value, onChange, placeholder, type = 'text', required }: InputFieldProps) {
  return (
    <input
      className="block border mb-2 w-full p-2"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  );
}
