import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';

export default function CompanyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/companies/${id}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/companies/${id}/reviews`).then(r => r.ok ? r.json() : [])
    ]).then(([companyData, reviewsData]) => {
      setCompany(companyData);
      setReviews(reviewsData || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="text-center py-10 text-gray-400">加载中...</div>;
  if (!company || company.error) return <div className="text-center py-10 text-red-500">公司不存在</div>;

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{company.name}</h1>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              {company.industry && <span>行业: {company.industry}</span>}
              {company.location && <span>地点: {company.location}</span>}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(company.avg_rating)} readonly size="text-2xl" />
              <span className="text-2xl font-bold text-yellow-500">
                {company.avg_rating > 0 ? company.avg_rating.toFixed(1) : '-'}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{company.review_count} 条评价</p>
          </div>
        </div>
        {company.description && (
          <p className="mt-4 text-gray-600">{company.description}</p>
        )}
        <div className="mt-4 flex gap-3">
          {user && (
            <>
              <Link
                to={`/company/${id}/review`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                写评价
              </Link>
              <Link
                to={`/company/${id}/edit`}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
              >
                完善信息
              </Link>
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">评价 ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-8">暂无评价</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
