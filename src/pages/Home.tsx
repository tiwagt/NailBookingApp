import React, { useEffect, useState } from 'react';
import { Star, Clock, Sparkles, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import { ReviewData, getReviews } from '../services/reviews';
import { ReviewForm } from '../components/Reviews/ReviewForm';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';

const showModal = (id: string) => {
  const modal = document.getElementById(id) as HTMLDialogElement | null;
  modal?.showModal();
};

const closeModal = (id: string) => {
  const modal = document.getElementById(id) as HTMLDialogElement | null;
  modal?.close();
};

export function Home() {
  const { services } = useServices();
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const reviewsData = await getReviews(3); // Get latest 3 reviews
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navbar 
      <nav className="bg-white shadow-md flex justify-between items-center p-4">
        <div className="text-xl font-bold">Nath Nails</div>
        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
          <span className="material-icons">menu</span>
        </button>
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="hover:text-pink-500">Home</Link>
          <Link to="/services" className="hover:text-pink-500">Services</Link>
          <Link to="/profile" className="hover:text-pink-500">About</Link>
          <Link to="/login" className="hover:text-pink-500">Contact</Link>
        </div>
      </nav>

      {/* Sidebar 
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />*/}

      {/* Hero Section */}
      <div 
        className="h-[600px] bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1920&q=80)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start md:items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Experience Luxury at Your Fingertips</h1>
            <p className="text-lg md:text-xl mb-8">Indulge in premium nail care services that combine artistry with relaxation.</p>
            <Link
              to="/book"
              className="bg-pink-500 text-white px-6 py-2 rounded-md text-lg font-medium hover:bg-pink-600"
            >
              Book Your Session
            </Link>
          </div>
        </div>
      </div>
      {/* Services Carousel Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="relative">
            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 space-x-6 scrollbar-hide">
              {services.map((service) => (
                <div key={service.serviceId} className="flex-none w-[300px] sm:w-[250px] md:w-[300px]">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img 
                      src={service.imageUrl} 
                      alt={service.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                      <p className="mt-2 text-gray-600 line-clamp-2">{service.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-5 w-5 mr-2" />
                          <span>{service.duration} mins</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <DollarSign className="h-5 w-5 mr-1" />
                          <span>{service.price}</span>
                        </div>
                      </div>
                      <Link
                        to={`/book?service=${service.serviceId}`}
                        className="mt-4 w-full block text-center bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/services"
                className="text-pink-500 font-medium hover:text-pink-600"
              >
                View All Services →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <Star className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Using only the finest products and latest techniques</p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Convenient Booking</h3>
              <p className="text-gray-600">Easy online scheduling that fits your lifestyle</p>
            </div>
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Artists</h3>
              <p className="text-gray-600">Skilled professionals dedicated to your satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-2">Customer Reviews</h2>
          <p className="text-gray-600 text-center mb-12">See what our clients have to say about their experience</p>
          
          {loading ? (
            <div className="text-center">Loading reviews...</div>
          ) : (
            <div className="relative">
              <div className="flex overflow-x-auto pb-8 -mx-4 px-4 space-x-6 scrollbar-hide">
                {reviews.map((review) => (
                  <div key={review.reviewId} className="flex-none w-[350px] sm:w-[300px] md:w-[350px]">
                    <div className="bg-white rounded-lg shadow-md p-6 h-full">
                      <div className="flex items-center mb-4">
                        <img
                          src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}`}
                          alt={review.userName}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h3 className="font-semibold">{review.userName}</h3>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={index}
                                className={`w-4 h-4 ${
                                  index < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 line-clamp-4">{review.comment}</p>
                      <div className="mt-4 text-sm text-gray-500">
                        {review.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentUser ? (
            <div className="mt-12 text-center">
              <button
                onClick={() => showModal('review-form-modal')}
                className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600"
              >
                Write a Review
              </button>
            </div>
          ) : (
            <div className="mt-8 text-center text-gray-600">
              <Link to="/login" className="text-pink-500 hover:text-pink-600">
                Login to share your experience
              </Link>
            </div>
          )}

          {/* Review Form Modal */}
          <dialog id="review-form-modal" className="modal rounded-lg p-0">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Share Your Experience</h3>
                <button
                  onClick={() => closeModal('review-form-modal')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <ReviewForm
                onSuccess={() => {
                  closeModal('review-form-modal');
                  getReviews(6).then(setReviews);
                }}
              />
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
}