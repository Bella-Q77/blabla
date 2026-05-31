import { useState } from 'react';

export default function StarRating({ value = 0, onChange, readonly = false, size = 'text-xl' }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`${size} cursor-${readonly ? 'default' : 'pointer'} select-none ${
            star <= (hover || value) ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
