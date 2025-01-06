import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { createReview } from '../../services/reviews';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  onSuccess?: () => void;
}

export function ReviewForm({ onSuccess }: ReviewFormProps) {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to submit a review');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const reviewData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userAvatar: currentUser.photoURL || undefined,
        rating,
        comment: comment.trim(),
      };

      console.log('Submitting review with data:', reviewData); // Debug log

      await createReview(reviewData);
      
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      onSuccess?.();
    } catch (error) {
      console.error('Detailed submission error:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        currentUser: {
          uid: currentUser.uid,
          displayName: currentUser.displayName
        }
      });
      
      // More specific error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to submit review. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${
                  value <= rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          required
          minLength={10}
          maxLength={500}
        />
        <p className="mt-1 text-sm text-gray-500">
          {comment.length}/500 characters
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !comment.trim()}
        className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
} 