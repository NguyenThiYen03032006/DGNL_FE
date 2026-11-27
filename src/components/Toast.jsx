import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div data-testid="toast" className="toast-notification">
      {message}
    </div>
  );
}
