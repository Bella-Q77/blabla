import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CompanyCard from '../components/CompanyCard';

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('page', page);
    fetch(`/api/companies?${params}`)
      .then(res => {
        if (!res.ok) throw new Error('request failed');
        return res.json();
      })
      .then(data => {
        setCompanies(data.companies || []);
        setTotal(data.total || 0);
      })
      .catch(() => {
        setCompanies([]);
        setTotal(0);
      });
  }, [page, search]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="搜索公司名称或行业..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setSearchParams({ page: '1' });
            }}
          />
        </div>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">暂无公司信息</p>
          <p className="text-sm mt-2">登录后可以添加公司</p>
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setSearchParams({ page: String(p) })}
              className={`px-3 py-1 rounded ${
                p === page ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
