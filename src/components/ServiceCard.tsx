import React from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { Service } from '../types';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';

interface ServiceCardProps {
  service: Service;
  isFavorite: boolean;
  onToggleFavorite: (serviceId: string) => void;
}

export function ServiceCard({ service, isFavorite, onToggleFavorite }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={service.imageUrl} 
        alt={service.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
        <p className="mt-2 text-gray-600">{service.description}</p>
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
        <button onClick={() => onToggleFavorite(service.serviceId)}>
          {isFavorite ? (
            <FaStar className="text-yellow-500" />
          ) : (
            <FaRegStar className="text-gray-400" />
          )}
        </button>
        <Link
          to={`/book?service=${service.serviceId}`}
          className="mt-4 w-full block text-center bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}