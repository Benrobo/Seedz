import React from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ averageRating }: { averageRating: number }) => {
  const maxStars = 5;
  const fullStars = Math.floor(
    averageRating > maxStars ? maxStars : averageRating
  );
  const remainingStars = maxStars - fullStars;

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FaStar key={`full-${i}`} size={10} className="text-yellow-300" />
    );
  }

  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <FaStar
        key={`empty-${i}`}
        size={10}
        className="empty-star text-white-400"
      />
    );
  }

  return stars;
};

export default StarRating;
