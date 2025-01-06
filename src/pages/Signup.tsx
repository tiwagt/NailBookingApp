import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, Globe, MapPin } from 'lucide-react';
import { fetchCountries } from '../services/countryService';
import { fetchCitiesByCountry } from '../services/cityService';


export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCountries = async () => {
      const countriesData = await fetchCountries();
      const sortedCountries = countriesData.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
      setCountries(sortedCountries);
    };
    loadCountries();
  }, []);

  const handleCountryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    
    setCountry(selectedCountry);
    setCity('');
   
      if (selectedCountry) {
        try {
         
          const citiesData = await fetchCitiesByCountry(selectedCountry);
          
          // Check if citiesData is not empty
          if (citiesData && citiesData.length > 0) {
            
            const sortedCities = citiesData.sort((a: { name: string }, b: { name: string }) => 
              (a.name || '').localeCompare(b.name || '')
            );
            setCities(sortedCities);
          } else {
            toast.error('No cities found for the selected country.');
          }
        } catch (error) {
          toast.error('Failed to load cities.');
        }
      } else {
        toast.error('Country code is not defined.');
      }
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      setLoading(true);
      await signup(email, password, displayName,Number(phoneNumber) , country, city);
      toast.success('Account created successfully!');
      navigate('/profile');
    } catch (error: any) {
      let message = 'Failed to create an account';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center border border-gray-300 rounded-md">
            <User className="h-5 w-5 text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Full Name"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm"
              value={displayName}
              onChange={(e => setDisplayName(e.target.value))}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-md">
          <Phone className="h-5 w-5 text-gray-400 ml-2" />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-md">
            <Mail className="h-5 w-5 text-gray-400 ml-2" />
            <input
              id="email-address"
              name="email"
              type="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="flex items-center border border-gray-300 rounded-md">
          <Globe className="h-5 w-5 text-gray-400 ml-2" />
            <select
              value={country}
              onChange={handleCountryChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm"
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center border border-gray-300 rounded-md">
          <MapPin className="h-5 w-5 text-gray-400 ml-2" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm"
              required
              disabled={!country}
            >
              <option value="">Select City</option>
              {cities.map((city, index) => (
                <option key={`${city}-${index}`} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center border border-gray-300 rounded-md">
            <Lock className="h-5 w-5 text-gray-400 ml-2" />
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-md">
            <Lock className="h-5 w-5 text-gray-400 ml-2" />
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-pink-500 hover:text-pink-600">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}