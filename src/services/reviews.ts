import { 
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ReviewData {
  reviewId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Create a new review
export async function createReview(reviewData: Omit<ReviewData, 'createdAt'>) {
  try {
    console.log('Attempting to create review with data:', reviewData);

    const reviewsRef = collection(db, 'reviews');
    
    // Prepare the new review data
    const newReview = {
      ...reviewData,
      createdAt: Timestamp.now(),
      userAvatar: reviewData.userAvatar || 'https://ui-avatars.com/api/?name=Anonymous'
    };

    console.log('Formatted review data:', newReview);

    const docRef = await addDoc(reviewsRef, newReview);
    
    return docRef.id;
  } catch (error) {
    console.error('Detailed error creating review:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      reviewData
    });
    throw error;
  }
}

// Get all reviews with optional limit
export async function getReviews(limitCount: number = 10) {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      reviewId: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as ReviewData[];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

// Get reviews by user ID
export async function getUserReviews(userId: string) {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      reviewId: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as ReviewData[];
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
}

// Delete a review (only allow users to delete their own reviews)
export async function deleteReview(reviewId: string, userId: string) {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    const reviewDoc = await getDocs(query(collection(db, 'reviews'), where('userId', '==', userId)));
    
    if (reviewDoc.empty) {
      throw new Error('Review not found or unauthorized');
    }
    
    await deleteDoc(reviewRef);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}
