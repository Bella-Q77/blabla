import StarRating from './StarRating';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-lg border p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StarRating value={review.rating} readonly size="text-base" />
          <h4 className="font-medium text-gray-800">{review.title}</h4>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            review.is_employee
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {review.is_employee ? '在职员工' : '非公司员工'}
        </span>
      </div>
      <p className="mt-3 text-gray-600 text-sm whitespace-pre-wrap">{review.content}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
        <span>{review.username}</span>
        <span>·</span>
        <span>{new Date(review.created_at).toLocaleDateString('zh-CN')}</span>
      </div>
    </div>
  );
}
