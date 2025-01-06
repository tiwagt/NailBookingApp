import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Service } from '../types';

export async function getServices(): Promise<Service[]> {
  try {
    const servicesRef = collection(db, 'Services');
    const snapshot = await getDocs(servicesRef);
    
    if (snapshot.empty) {
      console.log('No services found in database');
      return [];
    }

    return snapshot.docs.map(doc => ({
      serviceId: doc.id,
      ...doc.data()
    })) as Service[];
    
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}