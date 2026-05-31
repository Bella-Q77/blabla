import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';

export default function WriteReview() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ rating: 0, title: '', content: '', is_employee: null });
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.rating === 0) {
      setError('请选择评分');
      return;
    }
    if (form.is_employee === null) {
      setError('请选择是否为该公司员工');
      return;
    }
    const res = await fetch(`/api/companies/${id}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    navigate(`/company/${id}`);
  };

  return (
    <div className="max-w-lg mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-6">写评价</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">评分 *</label>
          <StarRating
            value={form.rating}
            onChange={rating => setForm({ ...form, rating })}
            size="text-3xl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">你是该公司员工吗？ *</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="is_employee"
                checked={form.is_employee === true}
                onChange={() => setForm({ ...form, is_employee: true })}
                className="text-blue-600"
              />
              <span>是，我是该公司员工</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="is_employee"
                checked={form.is_employee === false}
                onChange={() => setForm({ ...form, is_employee: false })}
                className="text-blue-600"
              />
              <span>否，我不是</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">评价标题 *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="一句话总结你的评价"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">详细评价 *</label>
          <textarea
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder="分享你对这家公司的看法..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          提交评价
        </button>
      </form>
    </div>
  );
}
