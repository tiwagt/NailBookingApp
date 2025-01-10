import { useState, useEffect } from 'react';
//import { services as staticServices } from '../data/services';
import { ServiceCard } from '../components/ServiceCard';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc, collection, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SwiperCore from 'swiper';
import Pagination from 'swiper';
import Navigation from 'swiper';
import 'swiper/swiper-bundle.css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

SwiperCore.use([Pagination, Navigation]);

export function Services() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFavorites(userData.favorites || []);
        }
      }
    };

    const fetchServices = async () => {
      try {
        const servicesCollection = collection(db, 'Services');
        const servicesSnapshot = await getDocs(servicesCollection);
        const servicesList = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(servicesList);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchUserFavorites();
    fetchServices();
  }, [currentUser]);

  const toggleFavorite = async (serviceId: string) => {
    const updatedFavorites = favorites.includes(serviceId)
      ? favorites.filter((id) => id !== serviceId)
      : [...favorites, serviceId];

    setFavorites(updatedFavorites);

    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // If the user document exists, update the favorites field
        await updateDoc(userRef, { favorites: updatedFavorites });
      } else {
        // If the user document does not exist, create it with the favorites
        await setDoc(userRef, { favorites: updatedFavorites });
      }
    }

    console.log('Current User:', currentUser);
    console.log('Updated Favorites:', updatedFavorites);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 sm:text-3xl">Our Services</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={`${service.serviceId}-${index}`}
              service={{
                ...service,
                imageUrl: service.imageUrl || 'path/to/default/image.jpg',
              }}
              isFavorite={favorites.includes(service.serviceId)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  );
}