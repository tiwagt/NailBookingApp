import { db } from '../lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';

export interface SpecialOffer {
  id: string;
  description: string;
  pointsRequired: number;
}

export const getSpecialOffers = async (): Promise<SpecialOffer[]> => {
  const offersRef = collection(db, "specialOffers");
  const querySnapshot = await getDocs(offersRef);
  const offers: SpecialOffer[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as SpecialOffer[];

  return offers;
};
