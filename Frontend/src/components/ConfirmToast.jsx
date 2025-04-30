// src/components/ConfirmToast.jsx
import React from 'react';

export const ConfirmToast = ({
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel"
}) => (
  <div style={{
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    fontFamily: 'inherit'
  }}>
    <h4 style={{
      margin: 0,
      fontWeight: 'bold',
      fontSize: '1.5rem'
    }}>
      Are you sure?
    </h4>

    <p style={{
      margin: 0,
      color: '#666',
      lineHeight: '1.4',
      fontSize: '0.8rem'
    }}>
      {message}
    </p>

    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '12px'
    }}>
      <button
        onClick={onCancel}
        style={{
          background: 'transparent',
          color: '#333',
          border: '1px solid #ccc',
          padding: '6px 18px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.8rem'
        }}
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        style={{
          background: '#ff8c42',
          color: '#fff',
          border: 'none',
          padding: '6px 18px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.9rem'
        }}
      >
        {confirmText}
      </button>
    </div>
  </div>
);
