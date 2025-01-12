'use client';

import { useState, useEffect, useRef } from 'react';

interface EditableCellProps {
  value: string | number;
  onSave: (value: string | number) => Promise<void>;
  type?: 'text' | 'number';
}

export function EditableCell({ value, onSave, type = 'text' }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    try {
      await onSave(type === 'number' ? Number(editValue) : editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
      setEditValue(value); // Reset on error
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave();
          if (e.key === 'Escape') {
            setEditValue(value);
            setIsEditing(false);
          }
        }}
        className="w-full px-2 py-1 border rounded"
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
    >
      {value}
    </div>
  );
}
