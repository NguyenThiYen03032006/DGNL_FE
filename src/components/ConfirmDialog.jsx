import React from 'react';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div data-testid="confirm-dialog" className="modal-content">
        <h3>{title || 'Xác nhận xoá'}</h3>
        <p>{message || 'Bạn có chắc chắn muốn xoá sản phẩm này?'}</p>
        <div className="modal-actions">
          <button type="button" data-testid="confirm-no" onClick={onCancel} className="btn-cancel">
            Huỷ
          </button>
          <button type="button" data-testid="confirm-yes" onClick={onConfirm} className="btn-delete">
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
}
