import React from 'react';
import { categoryNames } from '../data/sample.js';

export default function ProductRow({ product, onEdit, onDelete }) {
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(product.price) + ' ₫';
  const categoryLabel = categoryNames[product.category] || product.category;

  return (
    <tr data-testid="product-row" className="product-row">
      <td data-label="Tên">{product.name}</td>
      <td data-label="SKU">{product.sku}</td>
      <td data-label="Danh mục">{categoryLabel}</td>
      <td data-label="Giá">{formattedPrice}</td>
      <td data-label="Tồn kho">
        {product.stock === 0 ? (
          <span className="out-of-stock" style={{ color: '#dc2626', fontWeight: 'bold' }}>
            Hết hàng
          </span>
        ) : (
          product.stock
        )}
      </td>
      <td data-label="Trạng thái">
        <span
          data-testid="product-status"
          className={`status-badge ${product.status === 'active' ? 'status-active' : 'status-inactive'}`}
        >
          {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
        </span>
      </td>
      <td data-label="Thao tác" className="actions-cell">
        <button
          type="button"
          data-testid="edit-button"
          className="btn-edit"
          onClick={() => onEdit && onEdit(product.id)}
        >
          Sửa
        </button>
        <button
          type="button"
          data-testid="delete-button"
          className="btn-delete"
          onClick={() => onDelete && onDelete(product)}
        >
          Xoá
        </button>
      </td>
    </tr>
  );
}
