import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosClient';

export default function ProductFormPage({ showToast }) {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));

    if (isEdit) {
      api.get(`/products/${id}`)
        .then((res) => {
          setFormData({
            name: res.data.name,
            sku: res.data.sku,
            category: res.data.category,
            price: res.data.price,
            stock: res.data.stock,
            status: res.data.status
          });
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            setNotFound(true);
          }
        });
    }
  }, [id, isEdit]);

  if (notFound) {
    return (
      <main className="product-page">
        <h2>Không tìm thấy sản phẩm</h2>
      </main>
    );
  }

  const validate = () => {
    const errs = {};
    const trimmedName = formData.name.trim();

    if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 100) {
      errs.name = 'Tên sản phẩm bắt buộc từ 3 đến 100 ký tự';
    }

    const skuRegex = /^[A-Z]{3}-\d{4}$/;
    if (!formData.sku || !skuRegex.test(formData.sku)) {
      errs.sku = 'SKU phải đúng dạng ABC-1234 (3 chữ hoa, gạch ngang, 4 chữ số)';
    }

    if (!formData.category) {
      errs.category = 'Vui lòng chọn danh mục';
    }

    const priceNum = Number(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
      errs.price = 'Giá phải là số lớn hơn 0';
    }

    const stockNum = Number(formData.stock);
    if (
      formData.stock === '' ||
      isNaN(stockNum) ||
      !Number.isInteger(stockNum) ||
      stockNum < 0
    ) {
      errs.stock = 'Tồn kho phải là số nguyên không âm';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSaving(true);

    const payload = {
      ...formData,
      name: formData.name.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        showToast('Đã cập nhật sản phẩm');
      } else {
        await api.post('/products', payload);
        showToast('Đã thêm sản phẩm');
      }
      navigate('/products');
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors((prev) => ({
          ...prev,
          sku: err.response.data.message || 'SKU đã tồn tại'
        }));
      } else {
        alert(err.response?.data?.message || 'Có lỗi xảy ra');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="product-page">
      <h2>{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
      <form data-testid="product-form" onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Tên sản phẩm</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p data-testid="field-error-name" className="field-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="sku">SKU</label>
          <input
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
          />
          {errors.sku && <p data-testid="field-error-sku" className="field-error">{errors.sku}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Danh mục</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.category && <p data-testid="field-error-category" className="field-error">{errors.category}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Giá</label>
          <input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <p data-testid="field-error-price" className="field-error">{errors.price}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="stock">Tồn kho</label>
          <input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
          />
          {errors.stock && <p data-testid="field-error-stock" className="field-error">{errors.stock}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="status">Trạng thái</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Đang bán</option>
            <option value="inactive">Ngừng bán</option>
          </select>
        </div>

        <button
          type="submit"
          data-testid="submit-button"
          disabled={saving}
          className="btn-primary"
        >
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </form>
    </main>
  );
}
