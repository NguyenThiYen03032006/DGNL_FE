import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import api from './api/axiosClient';
import useProductSearch from './hooks/useProductSearch';
import ProductTable from './components/ProductTable';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import ProductFormPage from './pages/ProductFormPage';
import './App.css';

function ProductListPage({ triggerToast }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const qParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const statusParam = searchParams.get('status') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(qParam);
  const [categories, setCategories] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setSearchInput(qParam);
  }, [qParam]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== qParam) {
        updateParams({ q: searchInput, page: 1 });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const updateParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...newParams };

    Object.keys(merged).forEach((k) => {
      if (!merged[k] || (k === 'page' && Number(merged[k]) === 1)) {
        delete merged[k];
      }
    });
    setSearchParams(merged);
  };

  const { products, total, loading, error, refetch } = useProductSearch({
    q: qParam,
    category: categoryParam,
    status: statusParam,
    page: pageParam,
    limit: 10
  });

  const totalPages = Math.ceil(total / 10) || 1;

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete.id}`);
      triggerToast('Đã xoá sản phẩm');
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Xoá thất bại');
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <main className="product-page">
      <div className="page-header">
        <h1>Sản phẩm</h1>
        <button
          type="button"
          data-testid="add-button"
          className="btn-primary"
          onClick={() => navigate('/products/new')}
        >
          Thêm sản phẩm
        </button>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          data-testid="search-input"
          placeholder="Tìm theo tên hoặc SKU..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <select
          data-testid="category-filter"
          value={categoryParam}
          onChange={(e) => updateParams({ category: e.target.value, page: 1 })}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          data-testid="status-filter"
          value={statusParam}
          onChange={(e) => updateParams({ status: e.target.value, page: 1 })}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
        </select>
      </div>

      {loading && <div data-testid="loading">Đang tải...</div>}

      {!loading && error && (
        <div data-testid="error-message" className="error-box">
          <p>{error}</p>
          <button type="button" data-testid="retry-button" onClick={refetch}>
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div data-testid="empty-state">Không có sản phẩm nào</div>
      )}

      {!loading && !error && products.length > 0 && (
        <ProductTable
          products={products}
          onEdit={(id) => navigate(`/products/${id}/edit`)}
          onDelete={(prod) => setProductToDelete(prod)}
        />
      )}

      <div data-testid="pagination" className="pagination-bar">
        <button
          type="button"
          data-testid="page-prev"
          disabled={pageParam <= 1}
          onClick={() => updateParams({ page: pageParam - 1 })}
        >
          Trước
        </button>
        <span data-testid="page-current">
          {pageParam} / {totalPages}
        </span>
        <button
          type="button"
          data-testid="page-next"
          disabled={pageParam >= totalPages}
          onClick={() => updateParams({ page: pageParam + 1 })}
        >
          Sau
        </button>
      </div>

      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        title="Xác nhận xoá"
        message={`Bạn có chắc muốn xoá sản phẩm "${productToDelete?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </main>
  );
}

export default function App() {
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h2>OfficeMart Admin</h2>
      </header>

      <Toast message={toastMsg} />

      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductListPage triggerToast={triggerToast} />} />
        <Route path="/products/new" element={<ProductFormPage showToast={triggerToast} />} />
        <Route path="/products/:id/edit" element={<ProductFormPage showToast={triggerToast} />} />
      </Routes>
    </div>
  );
}
