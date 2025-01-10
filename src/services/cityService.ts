import axios from 'axios';

const GEO_NAMES_USERNAME = 'gracet'; 

export const fetchCitiesByCountry = async (countryCode: string) => {
  try {
    const response = await axios.get(`https://api.geonames.org/searchJSON?country=${countryCode}&maxRows=100&username=${GEO_NAMES_USERNAME}`);
    return response.data.geonames.map((city: any) => city.name);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios error
      console.error('Error fetching cities:', error.response ? error.response.data : error.message);
    } else {
      // Handle non-Axios error
      console.error('Unexpected error fetching cities:', error);
    }
    throw error; // Rethrow the error to handle it in the component
  }
};

