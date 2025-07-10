
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRating: (rate: number) => void;
  count?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRating, count = 5 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[...Array(count)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              className="sr-only"
              value={ratingValue}
              onClick={() => onRating(ratingValue)}
            />
            <Star
              className="cursor-pointer transition-colors duration-200"
              color={(ratingValue <= (hover || rating)) ? '#ffc107' : '#e4e5e9'}
              fill={(ratingValue <= (hover || rating)) ? '#ffc107' : '#e4e5e9'}
              size={36}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
