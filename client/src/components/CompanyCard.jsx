import { Link } from 'react-router-dom';
import StarRating from './StarRating';

export default function CompanyCard({ company }) {
  return (
    <Link
      to={`/company/${company.id}`}
      className="block bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-5"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{company.name}</h3>
          <div className="flex gap-3 mt-1 text-sm text-gray-500">
            {company.industry && <span>{company.industry}</span>}
            {company.location && <span>{company.location}</span>}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <StarRating value={Math.round(company.avg_rating)} readonly size="text-base" />
            <span className="text-sm text-gray-600 ml-1">
              {company.avg_rating > 0 ? company.avg_rating.toFixed(1) : '-'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{company.review_count} 条评价</p>
        </div>
      </div>
      {company.description && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{company.description}</p>
      )}
    </Link>
  );
}
