"use client";

import { useState } from "react";

type FloatingInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
};

export function FloatingInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className="border-lavender bg-surface focus:ring-primary-light w-full rounded-lg border px-3 pt-4 pb-1.5 text-sm focus:ring-2 focus:outline-none"
      />
      <label
        className={`bg-surface pointer-events-none absolute left-3 px-1 transition-all duration-150 ${
          floated
            ? "text-primary top-0 -translate-y-1/2 text-[10px]"
            : "text-text-dark/50 top-1/2 -translate-y-1/2 text-sm"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

type FloatingSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  className?: string;
};

export function FloatingSelect({
  label,
  value,
  onChange,
  options,
  required = false,
  className = "",
}: FloatingSelectProps) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        style={{ colorScheme: "light" }}
        className="border-lavender bg-surface focus:ring-primary-light w-full appearance-none rounded-lg border px-3 pt-4 pb-1.5 text-sm focus:ring-2 focus:outline-none"
      >
        <option value="" disabled hidden></option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <label
        className={`bg-surface pointer-events-none absolute left-3 px-1 transition-all duration-150 ${
          floated
            ? "text-primary top-0 -translate-y-1/2 text-[10px]"
            : "text-text-dark/50 top-1/2 -translate-y-1/2 text-sm"
        }`}
      >
        {label}
      </label>
    </div>
  );
}
