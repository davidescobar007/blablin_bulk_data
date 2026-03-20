import { type ReactNode } from "react";
import { Input } from "../../atoms/Input";

export interface FormFieldProps {
  label: ReactNode;
  helperText?: ReactNode;
  name: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function FormField({ label, helperText, ...inputProps }: FormFieldProps) {
  return (
    <Input
      label={label}
      helperText={typeof helperText === "string" ? helperText : undefined}
      {...inputProps}
    />
  );
}
