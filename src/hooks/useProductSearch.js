import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import api from '../api/axiosClient';

export default function useProductSearch({ q = '', category = '', status = '', page = 1, limit = 10 }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const params = { page, limit };
        if (q.trim()) params.q = q.trim();
        if (category) params.category = category;
        if (status) params.status = status;

        const res = await api.get('/products', {
          params,
          signal: controller.signal
        });

        setProducts(res.data.data || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        if (axios.isCancel(err) || err.name === 'CanceledError') {
          return;
        }
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [q, category, status, page, limit, reloadKey]);

  return { products, total, loading, error, refetch };
}
